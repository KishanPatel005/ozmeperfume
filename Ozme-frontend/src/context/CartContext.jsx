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

  const removeFromCart = useCallback((id, size = null) => {
    // Dismiss any existing cart toast to prevent duplicates
    toast.dismiss('cart-remove-toast');
    
    setCart((prevCart) => {
      // If size is provided, remove item with specific id+size combination
      if (size !== null) {
        const item = prevCart.find((item) => item.id === id && item.size === size);
        if (item) {
          toast.success(`${item.name}${item.size ? ` (${item.size})` : ''} removed from cart`, { id: 'cart-remove-toast' });
        }
        return prevCart.filter((item) => !(item.id === id && item.size === size));
      } else {
        // Fallback: remove first item with matching id (for backward compatibility)
        const item = prevCart.find((item) => item.id === id);
        if (item) {
          toast.success(`${item.name}${item.size ? ` (${item.size})` : ''} removed from cart`, { id: 'cart-remove-toast' });
        }
        // Remove all items with this id (in case there are multiple sizes)
        return prevCart.filter((item) => item.id !== id);
      }
    });
  }, []);

  const addToCart = useCallback((product, quantity = 1, size = null, sizePrice = null) => {
    // Dismiss any existing cart toast to prevent duplicates
    toast.dismiss('cart-add-toast');
    
    setCart((prevCart) => {
      // Check if product already exists in cart (same product ID and same size)
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      // Determine the price to use: sizePrice if provided, otherwise product.price
      const itemPrice = sizePrice !== null ? sizePrice : product.price;
      // Determine originalPrice: if product has sizes array, find the originalPrice for this size
      let itemOriginalPrice = product.originalPrice || product.price;
      if (product.sizes && Array.isArray(product.sizes) && size) {
        const sizeObj = product.sizes.find(s => s.value === size || s.size === size);
        if (sizeObj && sizeObj.originalPrice) {
          itemOriginalPrice = sizeObj.originalPrice;
        }
      }

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists (same product ID and size)
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        // Show toast with unique ID to prevent duplicates
        toast.success(`${product.name}${size ? ` (${size})` : ''} quantity updated in cart!`, { id: 'cart-add-toast' });
        return updatedCart;
      } else {
        // Add new product to cart
        const newItem = {
          id: product.id,
          name: product.name,
          category: product.category || product.gender || 'Unisex',
          price: itemPrice,
          originalPrice: itemOriginalPrice,
          image: product.images?.[0] || product.image || '',
          quantity: quantity,
          size: size
        };
        // Show toast with unique ID to prevent duplicates
        toast.success(`${product.name}${size ? ` (${size})` : ''} added to cart!`, { id: 'cart-add-toast' });
        return [...prevCart, newItem];
      }
    });
  }, []);

  const updateQuantity = useCallback((id, newQuantity, size = null) => {
    if (newQuantity < 1) {
      // If size is provided, remove item with specific id+size combination
      if (size !== null) {
        setCart((prevCart) => {
          const item = prevCart.find((item) => item.id === id && item.size === size);
          if (item) {
            toast.success(`${item.name}${item.size ? ` (${item.size})` : ''} removed from cart`, { id: 'cart-remove-toast' });
          }
          return prevCart.filter((item) => !(item.id === id && item.size === size));
        });
      } else {
        removeFromCart(id);
      }
      return;
    }
    setCart((prevCart) => {
      // If size is provided, update item with specific id+size combination
      if (size !== null) {
        return prevCart.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Fallback: update first item with matching id (for backward compatibility)
        const itemIndex = prevCart.findIndex(item => item.id === id);
        if (itemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: newQuantity };
          return updatedCart;
        }
        return prevCart;
      }
    });
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

