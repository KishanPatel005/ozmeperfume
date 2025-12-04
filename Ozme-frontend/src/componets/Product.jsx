

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Share2, Plus, Minus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { products } from '../data/productData'; // Make sure this path is correct
import { useCart } from '../context/CartContext'; // Make sure this path is correct
import { useWishlist } from '../context/WishlistContext'; // Make sure this path is correct
import Headers from './Headers';

function Product({ onBack }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    // Find the product with the matching ID
    const foundProduct = products.find(p => p.id.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Redirect to shop if product not found
      navigate('/shop');
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  const sizes = [
    { value: '100ml', price: Math.round(product.price * 1.8), label: '100ml' }
  ];

  const currentPrice = sizes.find(s => s.value === selectedSize)?.price || Math.round(product.price * 1.8);

  const nextImage = () => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

  const handleAddToCartClick = () => {
    addToCart(product, quantity, selectedSize);
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi, I want to order:\n\n*${product.name}*\nSize: ${selectedSize}\nQuantity: ${quantity}\nPrice: ₹${(currentPrice * quantity).toLocaleString('en-IN')}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Headers />
      
      {/* Product Details - Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* ⬅️ Back to Shop Button (Added as requested) */}
        <div className="mt-20 mb-5">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Image Gallery */}
          <div className="relative">
            {/* Tags: BESTSELLER and Discount */}
            <div className="absolute top-0 left-0 z-10 flex flex-col gap-2">
              {product.bestseller && <div className="px-3 py-1 bg-black text-white text-xs font-bold tracking-wider">BESTSELLER</div>}
              {product.discount && <div className="px-3 py-1 bg-green-600 text-white text-xs font-bold tracking-wider">{product.discount}% OFF</div>}
            </div>

            {/* Main Image Container */}
            <div className="flex items-center justify-center relative group bg-gray-50 p-4 sm:p-8">
              <div className="relative w-full max-w-lg aspect-[3/4] overflow-hidden">
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover shadow-xl transition-transform duration-500 group-hover:scale-[1.02]" />
                {/* Navigation Buttons */}
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/70 hover:bg-black hover:text-white flex items-center justify-center rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/70 hover:bg-black hover:text-white flex items-center justify-center rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-center mt-4">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 border-2 transition-all duration-300 ${selectedImage === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}>
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="flex flex-col pt-8 lg:pt-0">
            
            <h1 className="text-4xl lg:text-4xl font-normal text-gray-900 mb-2">{product.name}</h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1">
                {/* Star Rating Display */}
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-base font-medium text-gray-900">{product.rating}</span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-600 text-sm">{product.reviews} Reviews</span>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-normal text-gray-900">₹{currentPrice.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-sm font-semibold">Save {product.discount}%</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide uppercase">SIZE</label>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button key={size.value} 
                    onClick={() => setSelectedSize(size.value)}
                    className={`py-3 px-6 text-center border-2 transition-all duration-200 
                      ${selectedSize === size.value ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-800 hover:border-black'}`}>
                    <div className="font-semibold text-sm">{size.label}</div>
                    <div className="text-xs mt-1 opacity-80">₹{size.price.toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3 tracking-wide uppercase">QUANTITY</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-medium text-black border-x border-gray-300">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {quantity > 1 && <span className="text-sm text-gray-500 font-medium">Total: ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCartClick} className="flex-1 py-3 bg-black text-white font-semibold text-sm tracking-wider hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
                <ShoppingCart className="w-5 h-5" />ADD TO CART
              </button>
              <button onClick={() => product && toggleWishlist(product)}
                className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 rounded 
                  ${product && isInWishlist(product.id) ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'}`}>
                <Heart className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-all duration-300 rounded">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* WhatsApp Order Button */}
            <button onClick={handleWhatsAppOrder}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md mb-8 rounded">
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </button>

            {/* Features */}
            <div className="space-y-3 mb-8 p-4 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Truck className="w-4 h-4 text-black" /><span>Free shipping on all orders above ₹499</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="w-4 h-4 text-black" /><span>100% Authentic & Quality Assured</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <RotateCcw className="w-4 h-4 text-black" /><span>7 days easy return policy</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-6 mb-4 border-b border-gray-200">
                {['description', 'highlights', 'notes', 'reviews'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-900'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-gray-700 text-sm">
                {activeTab === 'description' && <p className="leading-relaxed">{product.description}</p>}
                {activeTab === 'highlights' && (
                  <ul className="space-y-3 list-disc list-inside">
                    {product.highlights?.map((h, i) => <li key={i} className="text-gray-700"><span>{h}</span></li>)}
                  </ul>
                )}
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div><h4 className="font-semibold mb-1 text-black">Top Notes</h4><p>{product.notes?.top}</p></div>
                    <div><h4 className="font-semibold mb-1 text-black">Heart Notes</h4><p>{product.notes?.heart}</p></div>
                    <div><h4 className="font-semibold mb-1 text-black">Base Notes</h4><p>{product.notes?.base}</p></div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {product.customerReviews?.map(r => (
                      <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex gap-0.5">{[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)}</div>
                          {r.verified && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">Verified Purchase</span>}
                        </div>
                        <p className="font-semibold text-black mb-1">{r.name}</p>
                        <p className="text-xs text-gray-500 mb-2">{r.date}</p>
                        <p className="text-gray-700">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;