import { Plus, Edit, Trash2, Search, Ticket, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

// Sample coupon data
const initialCoupons = [
  {
    id: 1,
    code: 'SUMMER20',
    type: 'Percentage',
    value: 20,
    minOrder: 50,
    maxDiscount: 100,
    usageLimit: 100,
    usedCount: 45,
    expiry: '2024-12-31',
    status: 'Active',
    description: 'Summer special discount'
  },
  {
    id: 2,
    code: 'WELCOME10',
    type: 'Fixed Amount',
    value: 10,
    minOrder: 30,
    maxDiscount: 10,
    usageLimit: 500,
    usedCount: 234,
    expiry: '2024-12-31',
    status: 'Active',
    description: 'Welcome discount for new users'
  },
  {
    id: 3,
    code: 'FLASH50',
    type: 'Percentage',
    value: 50,
    minOrder: 100,
    maxDiscount: 200,
    usageLimit: 50,
    usedCount: 50,
    expiry: '2024-11-30',
    status: 'Inactive',
    description: 'Flash sale discount'
  },
  {
    id: 4,
    code: 'FREESHIP',
    type: 'Fixed Amount',
    value: 5,
    minOrder: 25,
    maxDiscount: 5,
    usageLimit: 200,
    usedCount: 89,
    expiry: '2025-01-31',
    status: 'Active',
    description: 'Free shipping coupon'
  }
];

const Coupons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== couponId));
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowAddForm(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      'Inactive': 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  // Stats calculation
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.status === 'Active').length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0)
  };

  if (showAddForm) {
    return <AddCouponForm 
      onBack={() => {
        setShowAddForm(false);
        setEditingCoupon(null);
      }} 
      editingCoupon={editingCoupon}
      onSave={(coupon) => {
        if (editingCoupon) {
          setCoupons(coupons.map(c => c.id === coupon.id ? coupon : c));
        } else {
          setCoupons([...coupons, { ...coupon, id: coupons.length + 1, usedCount: 0 }]);
        }
        setShowAddForm(false);
        setEditingCoupon(null);
      }}
    />;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2 tracking-tight">
            Coupon <span className="font-serif italic text-amber-600">Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">Manage your discount coupons</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Create Coupon</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Coupons</p>
              <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">{stats.total}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Ticket className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Coupons</p>
              <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">{stats.active}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Usage</p>
              <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">{stats.totalUsage}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons by code or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent text-gray-800 dark:text-white rounded-xl"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
                      {coupon.code}
                    </h3>
                    {getStatusBadge(coupon.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {coupon.type} - {coupon.type === 'Percentage' ? `${coupon.value}%` : `$${coupon.value}`} off
                  </p>
                  {coupon.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                      {coupon.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(coupon)}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                    title="Edit coupon"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-amber-50/50 dark:bg-gray-900/50 rounded-xl p-3 border border-amber-100/20 dark:border-amber-900/20">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min Order</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${coupon.minOrder}</p>
                </div>
                <div className="bg-amber-50/50 dark:bg-gray-900/50 rounded-xl p-3 border border-amber-100/20 dark:border-amber-900/20">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max Discount</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${coupon.maxDiscount}</p>
                </div>
                <div className="bg-amber-50/50 dark:bg-gray-900/50 rounded-xl p-3 border border-amber-100/20 dark:border-amber-900/20">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Usage</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </p>
                </div>
                <div className="bg-amber-50/50 dark:bg-gray-900/50 rounded-xl p-3 border border-amber-100/20 dark:border-amber-900/20">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expiry</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{coupon.expiry}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Usage Progress</p>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {((coupon.usedCount / coupon.usageLimit) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add/Edit Coupon Form Component
const AddCouponForm = ({ onBack, editingCoupon, onSave }) => {
  const [formData, setFormData] = useState(editingCoupon || {
    code: '',
    type: 'Percentage',
    value: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    expiry: '',
    status: 'Active',
    description: ''
  });

  const handleSave = () => {
    if (!formData.code || !formData.value || !formData.minOrder || !formData.maxDiscount || !formData.usageLimit || !formData.expiry) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2 tracking-tight">
            {editingCoupon ? 'Edit' : 'Create New'} <span className="font-serif italic text-amber-600">Coupon</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            {editingCoupon ? 'Update coupon information' : 'Create a new discount coupon'}
          </p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-amber-100/20 dark:border-amber-900/20 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back to Coupons</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Coupon <span className="font-serif italic">Details</span>
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE20"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Discount Type *
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleChange('value', parseFloat(e.target.value))}
                    placeholder={formData.type === 'Percentage' ? '20' : '10'}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Min Order Amount ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => handleChange('minOrder', parseFloat(e.target.value))}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Max Discount ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => handleChange('maxDiscount', parseFloat(e.target.value))}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Usage Limit *
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => handleChange('usageLimit', parseInt(e.target.value))}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiry}
                    onChange={(e) => handleChange('expiry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the coupon..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Coupon <span className="font-serif italic">Status</span>
              </h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select 
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleSave}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all font-semibold"
            >
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
            <button 
              onClick={onBack}
              className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-amber-100/20 dark:border-amber-900/20 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupons;