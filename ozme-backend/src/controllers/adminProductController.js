import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadMultipleImages } from '../utils/cloudinary.js';

/**
 * Sanitize product name for Cloudinary folder name
 * @param {string} productName - Product name
 * @returns {string} - Sanitized folder name
 */
const sanitizeFolderName = (productName) => {
  return productName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Get all products with pagination and search
 * @route GET /api/admin/products
 */
export const getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const gender = req.query.gender || '';
    const active = req.query.active !== undefined ? req.query.active === 'true' : undefined;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (gender) {
      query.gender = gender;
    }
    
    if (active !== undefined) {
      query.active = active;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Create new product
 * @route POST /api/admin/products
 */
export const createAdminProduct = async (req, res) => {
  try {
    // Parse product data from FormData
    let productData;
    if (req.body.productData) {
      productData = typeof req.body.productData === 'string' 
        ? JSON.parse(req.body.productData) 
        : req.body.productData;
    } else {
      productData = req.body;
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.category || !productData.gender || !productData.price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, category, gender, price',
      });
    }

    // Validate MRP >= Price
    if (productData.originalPrice && productData.price && parseFloat(productData.originalPrice) < parseFloat(productData.price)) {
      return res.status(400).json({
        success: false,
        message: 'MRP (originalPrice) must be greater than or equal to selling price',
      });
    }

    // Validate category exists (optional check)
    if (productData.category) {
      const categoryExists = await Category.findOne({ name: productData.category, active: true });
      if (!categoryExists) {
        console.warn(`Category "${productData.category}" not found in Category collection`);
      }
    }

    // Check if images are provided (either files or existing images)
    const hasFiles = req.files && req.files.length > 0;
    const hasExistingImages = productData.existingImages && productData.existingImages.length > 0;

    if (!hasFiles && !hasExistingImages) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required',
      });
    }

    if (hasFiles && req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 images allowed',
      });
    }

    // Create product in DB first (without images, or with existing images if editing)
    const productToCreate = {
      name: productData.name,
      shortDescription: productData.shortDescription,
      description: productData.description,
      category: productData.category,
      gender: productData.gender,
      tag: productData.tag,
      size: productData.size || '100ML',
      price: parseFloat(productData.price),
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : undefined,
      stockQuantity: parseInt(productData.stockQuantity) || 0,
      inStock: parseInt(productData.stockQuantity) > 0,
      active: productData.active !== undefined ? productData.active : true,
      images: productData.existingImages || [], // Start with existing images if any
    };

    const product = await Product.create(productToCreate);

    // Upload new images to Cloudinary if files are provided
    let uploadedImageUrls = [];
    if (hasFiles) {
      try {
        // Create folder structure: products_images/{product_name}/
        const folderName = sanitizeFolderName(productData.name);
        const cloudinaryFolder = `products_images/${folderName}`;

        // Convert files to base64 for Cloudinary
        const filePaths = req.files.map(file => {
          const base64 = file.buffer.toString('base64');
          return `data:${file.mimetype};base64,${base64}`;
        });

        // Upload images to Cloudinary
        const uploadResults = await uploadMultipleImages(filePaths, cloudinaryFolder);
        uploadedImageUrls = uploadResults.map(result => result.url);
      } catch (uploadError) {
        // If upload fails, delete the product and return error
        await Product.findByIdAndDelete(product._id);
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: `Failed to upload images: ${uploadError.message}`,
        });
      }
    }

    // Update product with all image URLs (existing + new)
    const allImages = [...(productData.existingImages || []), ...uploadedImageUrls];
    product.images = allImages;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Update product
 * @route PUT /api/admin/products/:id
 */
export const updateAdminProduct = async (req, res) => {
  try {
    // Validate MRP >= Price if both are provided
    if (req.body.originalPrice !== undefined && req.body.price !== undefined) {
      if (parseFloat(req.body.originalPrice) < parseFloat(req.body.price)) {
        return res.status(400).json({
          success: false,
          message: 'MRP (originalPrice) must be greater than or equal to selling price',
        });
      }
    } else if (req.body.originalPrice !== undefined) {
      // If only originalPrice is provided, check against existing price
      const existingProduct = await Product.findById(req.params.id);
      if (existingProduct && parseFloat(req.body.originalPrice) < parseFloat(existingProduct.price)) {
        return res.status(400).json({
          success: false,
          message: 'MRP (originalPrice) must be greater than or equal to selling price',
        });
      }
    } else if (req.body.price !== undefined) {
      // If only price is provided, check against existing originalPrice
      const existingProduct = await Product.findById(req.params.id);
      if (existingProduct?.originalPrice && parseFloat(existingProduct.originalPrice) < parseFloat(req.body.price)) {
        return res.status(400).json({
          success: false,
          message: 'Selling price cannot be greater than MRP (originalPrice)',
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Delete/Deactivate product
 * @route DELETE /api/admin/products/:id
 */
export const deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete by setting active to false
    product.active = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * Upload product images to Cloudinary
 * @route POST /api/admin/products/upload-images
 */
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      });
    }

    // Limit to 10 images
    if (req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 images allowed',
      });
    }

    // Convert files to base64 or use file paths
    // Multer stores files in req.files array
    const filePaths = req.files.map(file => {
      // Convert buffer to data URI for Cloudinary
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    });

    // Upload to Cloudinary
    const uploadResults = await uploadMultipleImages(filePaths, 'ozme-products');

    // Extract URLs from results
    const imageUrls = uploadResults.map(result => result.url);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: imageUrls,
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // Check if it's a Cloudinary configuration error
    if (error.message && error.message.includes('credentials not configured')) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured. Please check your .env file has CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET set.',
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images to Cloudinary. Please check your Cloudinary credentials in .env file.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

