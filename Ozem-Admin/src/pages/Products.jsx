import { Plus, Edit, Trash2, Search, Package, TrendingUp, AlertCircle, Filter, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest('/admin/products');
      
      if (response && response.success) {
        // Transform backend products to match frontend format
        const transformedProducts = response.data.products.map(product => ({
          id: product._id,
          _id: product._id,
          name: product.name,
          sku: product._id.slice(-8).toUpperCase(), // Use last 8 chars of ID as SKU
          category: product.category,
          brand: 'OZME', // Default brand
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
          stock: product.stockQuantity || 0,
          status: !product.active ? 'Out of Stock' : (product.stockQuantity < 20 ? 'Low Stock' : 'Active'),
          image: product.images?.[0] || '',
          images: product.images || [],
          description: product.description,
          gender: product.gender,
          inStock: product.inStock,
          active: product.active,
        }));
        setProducts(transformedProducts);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await apiRequest(`/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response && response.success) {
        setProducts(products.filter(p => p.id !== productId && p._id !== productId));
      } else {
        alert(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      'Out of Stock': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  // Stats calculation
  const stats = {
    total: products.length,
    lowStock: products.filter(p => (p.stock || 0) < 20 && p.active).length,
    totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
  };

  const handleSave = async (productData) => {
    try {
      const productPayload = {
        name: productData.name,
        description: productData.description || productData.name,
        price: parseFloat(productData.price),
        originalPrice: productData.discount > 0 ? parseFloat(productData.price) / (1 - productData.discount / 100) : parseFloat(productData.price),
        images: productData.image ? [productData.image] : [],
        category: productData.category,
        gender: productData.gender || 'Unisex',
        stockQuantity: parseInt(productData.stock) || 0,
        inStock: productData.stock > 0,
        active: productData.status !== 'Out of Stock',
      };

      let response;
      if (editingProduct) {
        // Update existing product
        response = await apiRequest(`/admin/products/${editingProduct._id || editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(productPayload),
        });
      } else {
        // Create new product
        response = await apiRequest('/admin/products', {
          method: 'POST',
          body: JSON.stringify(productPayload),
        });
      }

      if (response && response.success) {
        // Refresh products list
        await fetchProducts();
        setShowAddForm(false);
        setEditingProduct(null);
      } else {
        alert(response?.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err.message || 'Failed to save product');
    }
  };

  if (showAddForm) {
    return <AddProductForm 
      onBack={() => {
        setShowAddForm(false);
        setEditingProduct(null);
      }} 
      editingProduct={editingProduct}
      onSave={handleSave}
    />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2 tracking-tight">
            Product <span className="font-serif italic text-amber-600">Catalog</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-amber-100/20 dark:border-amber-900/20 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter</span>
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Products</p>
              <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">{stats.total}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500 to-pink-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Low Stock Items</p>
              <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">{stats.lowStock}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 p-6 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Inventory Value</p>
              <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">${stats.totalValue.toLocaleString()}</h3>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
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
            placeholder="Search products by name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-transparent text-gray-800 dark:text-white rounded-xl"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
          <h2 className="text-xl font-light text-gray-900 dark:text-white">
            All <span className="font-serif italic">Products</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/20 dark:divide-amber-900/20">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{product.sku || product._id?.slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.gender || 'Unisex'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                    ₹{product.price?.toLocaleString('en-IN') || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.discount > 0 ? `${product.discount}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span className={(product.stock || 0) < 20 ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id || product.id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add/Edit Product Form Component
const AddProductForm = ({ onBack, editingProduct, onSave }) => {
  const [formData, setFormData] = useState(editingProduct ? {
    name: editingProduct.name || '',
    description: editingProduct.description || '',
    category: editingProduct.category || '',
    gender: editingProduct.gender || 'Unisex',
    price: editingProduct.price || '',
    originalPrice: editingProduct.originalPrice || editingProduct.price || '',
    discount: editingProduct.discount || 0,
    stock: editingProduct.stock || editingProduct.stockQuantity || '',
    status: editingProduct.status || (editingProduct.active ? 'Active' : 'Out of Stock'),
    image: editingProduct.image || editingProduct.images?.[0] || '',
  } : {
    name: '',
    description: '',
    category: '',
    gender: 'Unisex',
    price: '',
    originalPrice: '',
    discount: 0,
    stock: '',
    status: 'Active',
    image: ''
  });

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.price || formData.stock === '') {
      alert('Please fill in all required fields (Name, Category, Price, Stock)');
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
            {editingProduct ? 'Edit' : 'Add New'} <span className="font-serif italic text-amber-600">Product</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            {editingProduct ? 'Update product information' : 'Create a new product in your catalog'}
          </p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-amber-100/20 dark:border-amber-900/20 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Back to Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Basic <span className="font-serif italic">Information</span>
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Oriental">Oriental</option>
                    <option value="Floral">Floral</option>
                    <option value="Woody">Woody</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender || 'Unisex'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleChange('discount', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
                {formData.image && (
                  <div className="mt-3">
                    <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100/20 dark:border-amber-900/20 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-amber-100/20 dark:border-amber-900/20">
              <h2 className="text-xl font-light text-gray-900 dark:text-white">
                Product <span className="font-serif italic">Status</span>
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
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleSave}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all font-semibold"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
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

export default Products;