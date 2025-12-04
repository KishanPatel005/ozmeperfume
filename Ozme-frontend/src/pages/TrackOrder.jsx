import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, Package, MapPin, FileText, X, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function TrackOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  // Load order data from localStorage and refresh when location changes
  useEffect(() => {
    const loadOrderData = () => {
      // First, try to get currentOrder from localStorage
      const storedOrder = localStorage.getItem('currentOrder');
      if (storedOrder) {
        try {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderData(parsedOrder);
          return;
        } catch (error) {
          console.error('Error parsing order data:', error);
        }
      }

      // If no currentOrder, check if orderId is in location state or URL params
      const orderIdFromState = location.state?.orderId;
      if (orderIdFromState) {
        // Try to find order in allOrders
        try {
          const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
          const foundOrder = allOrders.find(o => o.orderId === orderIdFromState);
          if (foundOrder) {
            setOrderData(foundOrder);
            // Set as current order for consistency
            localStorage.setItem('currentOrder', JSON.stringify(foundOrder));
            return;
          }
        } catch (error) {
          console.error('Error loading order from history:', error);
        }
      }

      // If no order found, set to null
      setOrderData(null);
    };

    // Load order data on mount and when location changes
    loadOrderData();

    // Also listen for storage events (in case order is updated from another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'currentOrder' || e.key === 'allOrders') {
        loadOrderData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname, location.state]);

  // Calculate delivery date (3-5 days from order date)
  const getDeliveryDate = () => {
    if (!orderData?.orderDate) return 'Thursday';
    const orderDate = new Date(orderData.orderDate);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4); // 4 days later
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[deliveryDate.getDay()];
  };

  // Format order date
  const formatOrderDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status progress
  const getStatusProgress = () => {
    const status = orderData?.status || 'Processing';
    return {
      ordered: status === 'Processing' || status === 'Shipped' || status === 'Delivered',
      shipped: status === 'Shipped' || status === 'Delivered',
      outForDelivery: status === 'Out for Delivery' || status === 'Delivered',
      delivered: status === 'Delivered',
    };
  };

  const progress = getStatusProgress();

  // Handle Invoice Download
  const handleInvoiceDownload = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text, x, y, maxWidth, fontSize = 10, fontStyle = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('OZME PERFUMES', margin, 25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Invoice', pageWidth - margin, 25, { align: 'right' });
    
    yPosition = 50;
    doc.setTextColor(0, 0, 0);

    // Order Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Information', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Order ID: ${orderData.orderId}`, margin, yPosition, pageWidth - 2 * margin, 10);
    yPosition = addText(`Order Date: ${formatOrderDate(orderData.orderDate)}`, margin, yPosition, pageWidth - 2 * margin, 10);
    yPosition = addText(`Payment Method: ${orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}`, margin, yPosition, pageWidth - 2 * margin, 10);
    yPosition += 5;

    // Customer Information
    if (orderData.shippingAddress) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const customerName = `${orderData.shippingAddress.firstName || ''} ${orderData.shippingAddress.lastName || ''}`.trim();
      if (customerName) {
        yPosition = addText(`Name: ${customerName}`, margin, yPosition, pageWidth - 2 * margin, 10);
      }
      if (orderData.shippingAddress.email) {
        yPosition = addText(`Email: ${orderData.shippingAddress.email}`, margin, yPosition, pageWidth - 2 * margin, 10);
      }
      if (orderData.shippingAddress.phone) {
        yPosition = addText(`Phone: ${orderData.shippingAddress.phone}`, margin, yPosition, pageWidth - 2 * margin, 10);
      }
      yPosition += 3;

      // Shipping Address
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Shipping Address:', margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const addressLines = [];
      if (orderData.shippingAddress.address) {
        addressLines.push(orderData.shippingAddress.address);
      }
      if (orderData.shippingAddress.apartment) {
        addressLines.push(orderData.shippingAddress.apartment);
      }
      const cityState = [
        orderData.shippingAddress.city,
        orderData.shippingAddress.state,
        orderData.shippingAddress.pincode
      ].filter(Boolean).join(', ');
      if (cityState) {
        addressLines.push(cityState);
      }

      addressLines.forEach(line => {
        yPosition = addText(line, margin, yPosition, pageWidth - 2 * margin, 10);
      });
      yPosition += 5;
    }

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // Order Items
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items', margin, yPosition);
    yPosition += 10;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Product', margin + 2, yPosition);
    doc.text('Qty', pageWidth - 100, yPosition);
    doc.text('Price', pageWidth - 60, yPosition);
    doc.text('Total', pageWidth - margin - 20, yPosition, { align: 'right' });
    yPosition += 8;

    // Order Items - Calculate subtotal from items
    doc.setFont('helvetica', 'normal');
    let calculatedSubtotal = 0;
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        const itemName = item.name || 'Product';
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const itemTotal = price * quantity;
        calculatedSubtotal += itemTotal;

        // Product name (with wrapping)
        const nameLines = doc.splitTextToSize(itemName, pageWidth - 140);
        doc.setFontSize(9);
        doc.text(nameLines, margin + 2, yPosition);
        
        // Quantity, Price, Total
        doc.text(quantity.toString(), pageWidth - 100, yPosition);
        doc.text(`₹${price.toLocaleString('en-IN')}`, pageWidth - 60, yPosition);
        doc.text(`₹${itemTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPosition, { align: 'right' });
        
        yPosition += Math.max(nameLines.length * 4, 8);
        
        // Add a line between items
        if (index < orderData.items.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 3;
        }
      });
    }

    yPosition += 5;

    // Check if we need a new page for summary
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Order Summary
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const subtotal = orderData.subtotal || calculatedSubtotal;
    const shipping = orderData.shippingCost || 0;
    const grandTotal = subtotal + shipping;

    doc.text('Subtotal:', pageWidth - 80, yPosition, { align: 'right' });
    doc.text(`₹${subtotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPosition, { align: 'right' });
    yPosition += 6;

    if (shipping > 0 || orderData.shippingCost !== undefined) {
      doc.text('Shipping:', pageWidth - 80, yPosition, { align: 'right' });
      doc.text(shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPosition, { align: 'right' });
      yPosition += 6;
    }

    yPosition += 2;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 80, yPosition, { align: 'right' });
    doc.text(`₹${grandTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPosition, { align: 'right' });
    yPosition += 10;

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for your purchase!', margin, pageHeight - 15);
    doc.text('Inclusive of all taxes', pageWidth - margin - 2, pageHeight - 15, { align: 'right' });

    // Save the PDF
    const fileName = `invoice-${orderData.orderId}.pdf`;
    doc.save(fileName);
  };

  if (!orderData) {
  return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-6">No order data available. Please place an order first.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-900 transition-all"
          >
            Go to Shop
          </button>
        </div>
              </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-25">
        {/* Top Section: Arriving Date + Product Image + See all orders */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-2">
              Arriving {getDeliveryDate()}
            </h1>
            <p className="text-sm text-gray-500">Order ID: {orderData.orderId}</p>
          </div>
          
          {/* Product Image */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="flex gap-2 sm:gap-4">
              {orderData.items.slice(0, 2).map((item, index) => (
                <div key={index} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium sm:mt-2"
          >
            See all orders
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
              <div
                className={`h-full transition-all duration-500 ${
                  progress.delivered
                    ? 'bg-blue-600 w-full'
                    : progress.outForDelivery
                    ? 'bg-blue-600 w-3/4'
                    : progress.shipped
                    ? 'bg-blue-600 w-1/2'
                    : progress.ordered
                    ? 'bg-blue-600 w-1/4'
                    : 'bg-gray-200 w-0'
                }`}
              />
            </div>

            {/* Status Points */}
            <div className="relative z-10 flex items-center justify-between w-full">
              {/* Ordered */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    progress.ordered
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {progress.ordered ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    progress.ordered ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  Ordered
                </span>
              </div>

              {/* Shipped */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    progress.shipped
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {progress.shipped ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    progress.shipped ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  Shipped
                </span>
              </div>

              {/* Out for delivery */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    progress.outForDelivery
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {progress.outForDelivery ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium text-center ${
                    progress.outForDelivery ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  Out for delivery
                </span>
              </div>

              {/* Delivered */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    progress.delivered
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {progress.delivered ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    progress.delivered ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  Delivered
                </span>
              </div>
                    </div>
                    </div>
                  </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Delivery Info Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Delivery Info</h3>
            <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Update delivery instructions</span>
                      </div>
                    </div>

          {/* Shipping Address Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">
                {orderData.shippingAddress?.firstName} {orderData.shippingAddress?.lastName}
              </p>
              {orderData.shippingAddress?.address && (
                <p>{orderData.shippingAddress.address}</p>
              )}
              {orderData.shippingAddress?.apartment && (
                <p>{orderData.shippingAddress.apartment}</p>
              )}
              {orderData.shippingAddress?.city && (
                <p>
                  {orderData.shippingAddress.city}
                  {orderData.shippingAddress.state && `, ${orderData.shippingAddress.state}`}
                  {orderData.shippingAddress.pincode && ` ${orderData.shippingAddress.pincode}`}
                </p>
              )}
                      </div>
                    </div>

          {/* Order Info Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Order Info</h3>
            <div className="space-y-3">
              <button className="block text-black hover:text-blue-700 text-sm font-medium text-left">
                View order details
              </button>
              
                      </div>
                    </div>
                  </div>

        {/* Order Details Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <button
              onClick={handleInvoiceDownload}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all duration-300 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
                </div>

                {/* Order Items */}
          <div className="space-y-4 mb-6">
            {orderData.items?.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                              </div>
                            <div className="flex-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                    {item.category || 'Perfume'}
                  </p>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">{item.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Quantity: {item.quantity}</span>
                    {item.size && <span>Size: {item.size}</span>}
                  </div>
                    </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                        </div>
                      </div>
                    ))}
                  </div>

          {/* Order Summary */}
          <div className="pt-6 border-t border-gray-200">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{orderData.subtotal?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">
                  {orderData.shippingCost === 0 ? 'FREE' : `₹${orderData.shippingCost?.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-500">₹</span>
                  <span className="text-2xl font-semibold text-gray-900">
                    {orderData.totalAmount?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">
                  {orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium text-gray-900">{formatOrderDate(orderData.orderDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
