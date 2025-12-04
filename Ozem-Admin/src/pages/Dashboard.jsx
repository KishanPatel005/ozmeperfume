import {
  DollarSign,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Download,
  Filter,
  Calendar
} from 'lucide-react';

// Dashboard Data
const dashboardStats = {
  totalSales: { value: '$45,231.89', trend: { positive: true, value: '+20.1%' } },
  totalOrders: { value: '328', trend: { positive: true, value: '+12.5%' } },
  pendingOrders: { value: '23', trend: { positive: false, value: '-5.2%' } },
  shippedOrders: { value: '145', trend: { positive: true, value: '+8.3%' } },
  deliveredOrders: { value: '142', trend: { positive: true, value: '+15.7%' } },
  canceledOrders: { value: '18', trend: { positive: false, value: '-3.1%' } },
  totalUsers: { value: '1,234', trend: { positive: true, value: '+18.2%' } },
  totalProducts: { value: '456', trend: { positive: true, value: '+5.4%' } },
};

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: '$234.50', status: 'Delivered', date: '2024-01-20' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: '$156.00', status: 'Shipped', date: '2024-01-20' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: '$89.99', status: 'Pending', date: '2024-01-19' },
  { id: 'ORD-004', customer: 'Alice Brown', amount: '$445.20', status: 'Processing', date: '2024-01-19' },
  { id: 'ORD-005', customer: 'Charlie Wilson', amount: '$123.45', status: 'Delivered', date: '2024-01-18' },
];

const lowStockProducts = [
  { id: 1, name: 'Wireless Mouse', sku: 'WM-001', stock: 5, threshold: 10 },
  { id: 2, name: 'USB Cable', sku: 'UC-002', stock: 3, threshold: 15 },
  { id: 3, name: 'Phone Case', sku: 'PC-003', stock: 8, threshold: 20 },
  { id: 4, name: 'Screen Protector', sku: 'SP-004', stock: 2, threshold: 10 },
];

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 shadow-lg">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
          <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.positive ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
              <span className={`text-sm font-semibold ${trend.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      'Shipped': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      'Processing': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      'Canceled': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2 tracking-tight">
            Dashboard <span className="font-serif italic text-amber-600">Overview</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-amber-100/20 dark:border-amber-900/20 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all">
            <Download className="w-4 h-4" />
            <span className="text-sm font-semibold">Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={dashboardStats.totalSales.value}
          icon={DollarSign}
          gradient="from-amber-400 to-amber-600"
          trend={dashboardStats.totalSales.trend}
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats.totalOrders.value}
          icon={ShoppingCart}
          gradient="from-emerald-500 to-emerald-600"
          trend={dashboardStats.totalOrders.trend}
        />
        <StatCard
          title="Pending Orders"
          value={dashboardStats.pendingOrders.value}
          icon={Clock}
          gradient="from-orange-500 to-orange-600"
          trend={dashboardStats.pendingOrders.trend}
        />
        <StatCard
          title="Shipped Orders"
          value={dashboardStats.shippedOrders.value}
          icon={Truck}
          gradient="from-purple-500 to-pink-600"
          trend={dashboardStats.shippedOrders.trend}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Delivered Orders"
          value={dashboardStats.deliveredOrders.value}
          icon={CheckCircle}
          gradient="from-emerald-500 to-teal-600"
          trend={dashboardStats.deliveredOrders.trend}
        />
        <StatCard
          title="Canceled Orders"
          value={dashboardStats.canceledOrders.value}
          icon={XCircle}
          gradient="from-rose-500 to-pink-600"
          trend={dashboardStats.canceledOrders.trend}
        />
        <StatCard
          title="Total Customers"
          value={dashboardStats.totalUsers.value}
          icon={Users}
          gradient="from-blue-500 to-cyan-600"
          trend={dashboardStats.totalUsers.trend}
        />
        <StatCard
          title="Total Products"
          value={dashboardStats.totalProducts.value}
          icon={Package}
          gradient="from-orange-500 to-amber-600"
          trend={dashboardStats.totalProducts.trend}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light text-gray-900 dark:text-white mb-1">
                  Recent <span className="font-serif italic">Orders</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Latest customer orders</p>
              </div>
              <button className="p-2 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-lg transition-all">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50/50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100/20 dark:divide-amber-900/20">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{order.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-amber-50/50 dark:bg-gray-900/50 border-t border-amber-100/20 dark:border-amber-900/20">
            <button className="w-full py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center justify-center gap-2 group">
              View All Orders
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-light text-gray-900 dark:text-white mb-1">
                    Low Stock <span className="font-serif italic">Alerts</span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Products running low</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10 rounded-xl border border-rose-200 dark:border-rose-800/30 hover:shadow-lg transition-all">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{product.stock}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">units</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min: {product.threshold}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-amber-50/50 dark:bg-gray-900/50 border-t border-amber-100/20 dark:border-amber-900/20">
            <button className="w-full py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center justify-center gap-2 group">
              Manage Inventory
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;