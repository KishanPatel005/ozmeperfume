import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ozmeCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ozmeCart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = useCallback((id) => {
    // Dismiss any existing cart toast to prevent duplicates
    toast.dismiss('cart-remove-toast');
    
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.id === id);
      if (item) {
        // Show toast with unique ID to prevent duplicates
        toast.success(`${item.name} removed from cart`, { id: 'cart-remove-toast' });
      }
      return prevCart.filter((item) => item.id !== id);
    });
  }, []);

  const addToCart = useCallback((product, quantity = 1, size = null) => {
    // Dismiss any existing cart toast to prevent duplicates
    toast.dismiss('cart-add-toast');
    
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        // Show toast with unique ID to prevent duplicates
        toast.success(`${product.name} quantity updated in cart!`, { id: 'cart-add-toast' });
        return updatedCart;
      } else {
        // Add new product to cart
        const newItem = {
          id: product.id,
          name: product.name,
          category: product.category || product.gender || 'Unisex',
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.images?.[0] || product.image || '',
          quantity: quantity,
          size: size
        };
        // Show toast with unique ID to prevent duplicates
        toast.success(`${product.name} added to cart!`, { id: 'cart-add-toast' });
        return [...prevCart, newItem];
      }
    });
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ozmeCart');
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

