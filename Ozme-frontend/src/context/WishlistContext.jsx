import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('ozmeWishlist');
        if (savedWishlist) {
          const parsed = JSON.parse(savedWishlist);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          } else {
            console.warn('Wishlist data is not an array, resetting...');
            localStorage.removeItem('ozmeWishlist');
            setWishlist([]);
          }
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        localStorage.removeItem('ozmeWishlist');
        setWishlist([]);
      }
    };
    
    loadWishlist();
    
    // Listen for storage events to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'ozmeWishlist') {
        loadWishlist();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ozmeWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((product) => {
    // Dismiss any existing wishlist toast to prevent duplicates
    toast.dismiss('wishlist-add-toast');
    
    setWishlist((prevWishlist) => {
      // Check if product already exists in wishlist
      const exists = prevWishlist.some((item) => item.id === product.id);
      
      if (exists) {
        // Product already in wishlist
        toast.success(`${product.name} is already in your wishlist!`, { id: 'wishlist-add-toast' });
        return prevWishlist;
      } else {
        // Add new product to wishlist
        const newItem = {
          id: product.id,
          name: product.name,
          category: product.category || product.gender || 'Unisex',
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.images?.[0] || product.image || '',
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          tag: product.tag || product.bestseller ? 'Bestseller' : null
        };
        toast.success(`${product.name} added to wishlist!`, { id: 'wishlist-add-toast' });
        return [...prevWishlist, newItem];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    // Dismiss any existing wishlist toast to prevent duplicates
    toast.dismiss('wishlist-remove-toast');
    
    setWishlist((prevWishlist) => {
      const item = prevWishlist.find((item) => item.id === id);
      if (item) {
        toast.success(`${item.name} removed from wishlist`, { id: 'wishlist-remove-toast' });
      }
      return prevWishlist.filter((item) => item.id !== id);
    });
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        // Remove from wishlist
        const item = prevWishlist.find((item) => item.id === product.id);
        if (item) {
          toast.dismiss('wishlist-remove-toast');
          toast.success(`${item.name} removed from wishlist`, { id: 'wishlist-remove-toast' });
        }
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        // Add to wishlist
        toast.dismiss('wishlist-add-toast');
        const newItem = {
          id: product.id,
          name: product.name,
          category: product.category || product.gender || 'Unisex',
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.images?.[0] || product.image || '',
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          tag: product.tag || (product.bestseller ? 'Bestseller' : null)
        };
        toast.success(`${product.name} added to wishlist!`, { id: 'wishlist-add-toast' });
        return [...prevWishlist, newItem];
      }
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    localStorage.removeItem('ozmeWishlist');
  }, []);

  const getWishlistCount = useCallback(() => {
    return wishlist.length;
  }, [wishlist]);

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

