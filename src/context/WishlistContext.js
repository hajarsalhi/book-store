import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishListAPI } from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      console.log('Fetching wishlist for user:', user.id);
      fetchWishlist();
    } else {
      console.log('No user found, clearing wishlist');
      setWishlistItems([]);
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      console.log('Starting wishlist fetch...');
      setLoading(true);
      const response = await wishListAPI.getWishlist();
      console.log('Wishlist API Response:', response);

      if (response.data) {
        setWishlistItems(response.data);
        console.log('Wishlist items set:', response.data);
      }
      setError(null);
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setWishlistItems([]);
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (book) => {
    try {
      setError(null);
      setWishlistItems(prev => [...prev, book]);
      
      await wishListAPI.addToWishlist(book._id);
      return true;
    } catch (err) {
      console.error('Add to wishlist error:', err);
      setWishlistItems(prev => prev.filter(item => item._id !== book._id));
      setError('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (bookId) => {
    const previousItems = [...wishlistItems];
    try {
      setError(null);
      
      setWishlistItems(prev => prev.filter(item => item._id !== bookId));
      
      await wishListAPI.removeFromWishlist(bookId);
      return true;
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      setWishlistItems(previousItems);
      setError('Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (bookId) => {
    return Array.isArray(wishlistItems) && 
           wishlistItems.some(item => item._id === bookId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setError(null);
  };

  const refreshWishlist = async () => {
    console.log('Manually refreshing wishlist...');
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loading,
      error,
      clearWishlist,
      refreshWishlist
    }}>
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