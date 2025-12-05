import Order from '../models/Order.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { sendOrderConfirmationEmail } from '../utils/orderEmails.js';

/**
 * Create order from cart
 * @route POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, promoCode, discountAmount = 0, items: requestItems, totalAmount: requestTotalAmount } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    let orderItems = [];
    let totalAmount = 0;

    // If items are provided directly in request, use those (for localStorage carts)
    if (requestItems && Array.isArray(requestItems) && requestItems.length > 0) {
      // Validate and map items from request
      for (const item of requestItems) {
        if (!item.productId) {
          return res.status(400).json({
            success: false,
            message: 'Each item must have a productId',
          });
        }

        // Verify product exists - handle both ObjectId and string IDs
        let product = null;
        
        // Check if productId is a valid MongoDB ObjectId
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId?.toString());
        
        if (isValidObjectId) {
          product = await Product.findById(item.productId);
        } else {
          // If not a valid ObjectId, try to find by other means or return error
          return res.status(400).json({
            success: false,
            message: `Invalid product ID format: ${item.productId}. Product ID must be a valid MongoDB ObjectId.`,
          });
        }
        
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
        }

        orderItems.push({
          product: item.productId,
          quantity: item.quantity || 1,
          size: item.size || '100ml',
          price: item.price || product.price, // Use provided price or product price
        });

        totalAmount += (item.price || product.price) * (item.quantity || 1);
      }
    } else {
      // Get cart items from backend (original behavior)
      const cartItems = await CartItem.find({ user: req.user.id }).populate('product');

      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty',
        });
      }

      // Map cart items to order items
      orderItems = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        price: item.product.price,
      }));

      // Calculate total from cart
      totalAmount = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    }

    // Track coupon usage if provided
    if (promoCode && discountAmount > 0) {
      const coupon = await Coupon.findOne({ code: promoCode.toUpperCase() });
      if (coupon) {
        await coupon.markAsUsed(req.user.id);
      }
    }

    // Use request total amount if provided (for cases with discounts already applied)
    if (requestTotalAmount !== undefined) {
      totalAmount = requestTotalAmount;
    } else {
      totalAmount -= discountAmount;
    }

    // Format shipping address (combine firstName and lastName into name if needed)
    const formattedShippingAddress = {
      name: shippingAddress.name || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer',
      phone: shippingAddress.phone || '',
      address: shippingAddress.address || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      pincode: shippingAddress.pincode || '',
      country: shippingAddress.country || 'India',
    };

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: formattedShippingAddress,
      paymentMethod: paymentMethod === 'ONLINE' ? 'Prepaid' : (paymentMethod || 'COD'),
      orderStatus: paymentMethod === 'ONLINE' ? 'Pending' : (paymentMethod === 'COD' ? 'Processing' : 'Pending'),
      totalAmount,
      discountAmount,
      promoCode: promoCode || null,
    });

    // Clear cart if using backend cart
    if (!requestItems || requestItems.length === 0) {
      await CartItem.deleteMany({ user: req.user.id });
    }

    await order.populate('items.product user');

    // Send confirmation email for COD orders
    if (paymentMethod === 'COD' || (!paymentMethod || paymentMethod !== 'ONLINE')) {
      try {
        await sendOrderConfirmationEmail(order, order.user);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          ...order.toJSON(),
          orderNumber: order.orderNumber,
        }
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 */
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product').populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order or is admin
    if (req.user && req.user.id !== order.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Get user's orders
 * @route GET /api/orders/user
 */
export const getUserOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Track order by tracking number or order ID
 * @route GET /api/orders/track/:identifier
 */
export const trackOrder = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Check if identifier is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    
    let order = null;

    // Try to find by ObjectId first (fastest)
    if (isValidObjectId) {
      order = await Order.findById(identifier).populate('items.product');
    }

    // If not found, try tracking number
    if (!order) {
      order = await Order.findOne({ trackingNumber: identifier }).populate('items.product');
    }

    // If still not found, check if it's an order number format (ORD-XXXXX or OZME-XXXXX)
    if (!order && /^(ORD|OZME)-[A-Z0-9]+$/i.test(identifier)) {
      // Extract the suffix after the dash
      const orderSuffix = identifier.split('-')[1].toUpperCase();
      
      // Order numbers are in format OZME-XXXXXXXX where XXXXXXXX is last 8 chars of ObjectId
      // We can't directly query by virtual field, so we'll use a regex on _id
      // Since ObjectIds are 24 hex chars, last 8 chars means we need to find orders
      // where _id ends with those 8 characters
      // We'll use a regex pattern to match the end of ObjectId
      try {
        // Try to find orders where the last 8 characters of ObjectId match
        // This is a best-effort approach since we can't query virtual fields directly
        const recentOrders = await Order.find({})
          .sort({ createdAt: -1 })
          .limit(100) // Check last 100 orders for performance
          .populate('items.product');
        
        order = recentOrders.find(o => {
          const orderNum = `OZME-${o._id.toString().slice(-8).toUpperCase()}`;
          return orderNum.toUpperCase() === identifier.toUpperCase();
        });
      } catch (err) {
        console.error('Error searching orders by number:', err);
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

