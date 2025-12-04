import { ArrowLeft, Check, Clock, Package, Truck, MapPin, CreditCard, User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

// Sample orders data
const orders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    amount: 299.99,
    paymentMethod: 'Credit Card',
    status: 'Delivered',
    date: '2024-03-15',
    items: [
      { name: 'Wireless Headphones', qty: 1, price: 99.99 },
      { name: 'Smart Watch', qty: 1, price: 199.99 }
    ],
    subtotal: 299.99,
    shipping: 0,
    discount: 0,
    shippingAddress: '123 Main St, New York, NY 10001',
    timeline: [
      { status: 'Order Placed', date: '2024-03-15 10:30 AM', completed: true },
      { status: 'Processing', date: '2024-03-15 11:00 AM', completed: true },
      { status: 'Shipped', date: '2024-03-16 09:00 AM', completed: true },
      { status: 'Delivered', date: '2024-03-18 02:30 PM', completed: true }
    ]
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 8901',
    amount: 149.99,
    paymentMethod: 'PayPal',
    status: 'Shipped',
    date: '2024-03-18',
    items: [
      { name: 'Laptop Stand', qty: 2, price: 49.99 },
      { name: 'USB-C Hub', qty: 1, price: 39.99 }
    ],
    subtotal: 139.98,
    shipping: 10.00,
    discount: 0,
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    timeline: [
      { status: 'Order Placed', date: '2024-03-18 02:15 PM', completed: true },
      { status: 'Processing', date: '2024-03-18 03:00 PM', completed: true },
      { status: 'Shipped', date: '2024-03-19 10:00 AM', completed: true },
      { status: 'Delivered', date: null, completed: false }
    ]
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    amount: 129.99,
    paymentMethod: 'Credit Card',
    status: 'Processing',
    date: '2024-03-20',
    items: [
      { name: 'Mechanical Keyboard', qty: 1, price: 129.99 }
    ],
    subtotal: 129.99,
    shipping: 0,
    discount: 0,
    shippingAddress: '789 Pine St, Chicago, IL 60601',
    timeline: [
      { status: 'Order Placed', date: '2024-03-20 11:45 AM', completed: true },
      { status: 'Processing', date: '2024-03-20 12:00 PM', completed: true },
      { status: 'Shipped', date: null, completed: false },
      { status: 'Delivered', date: null, completed: false }
    ]
  }
];

const OrderDetails = ({ orderId, onBack }) => {
  const [note, setNote] = useState('');
  const order = orders.find(o => o.id === orderId) || orders[0];

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      'Shipped': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      'Processing': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      'Canceled': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    };
    
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-amber-100/20 dark:border-blue-900/20 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back to Orders</span>
          </button>
          <div>
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-1 tracking-tight">
              Order <span className="font-serif italic text-amber-600">Details</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">Order ID: {order.id}</p>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-blue-100/20 dark:border-amber-900/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Order <span className="font-serif italic">Items</span>
              </h2>
            </div>

            <div className="p-6 space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-gray-700/30 dark:to-transparent rounded-xl border border-amber-100/20 dark:border-blue-900/20">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Quantity: {item.qty}</p>
                  </div>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t border-blue-100/20 dark:border-blue-900/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-800 dark:text-white font-semibold">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-800 dark:text-white font-semibold">
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-blue-100/20 dark:border-blue-900/20">
                  <span className="text-gray-800 dark:text-white">Total</span>
                  <span className="text-amber-600 dark:text-blue-400">${order.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-blue-900/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Order <span className="font-serif italic text-amber-600">Timeline</span>
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    event.completed 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {event.completed ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`text-sm font-semibold ${
                      event.completed ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {event.status}
                    </p>
                    {event.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Note */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-blue-900/20">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Add <span className="font-serif italic">Note</span>
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <textarea
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal notes for this order..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white resize-none"
              />

              <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-semibold">
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-blue-900/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Customer <span className="font-serif italic">Info</span>
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Name</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{order.customer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{order.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{order.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-blue-900/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Shipping <span className="font-serif italic">Address</span>
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-blue-900/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Payment <span className="font-serif italic">Info</span>
              </h2>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Method</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                  Paid
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-blue-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-blue-900/20">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Update <span className="font-serif italic">Status</span>
              </h2>
            </div>

            <div className="p-6 space-y-3">
              <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-semibold">
                Mark as Processing
              </button>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-semibold">
                Mark as Shipped
              </button>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all font-semibold">
                Mark as Delivered
              </button>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all font-semibold">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;