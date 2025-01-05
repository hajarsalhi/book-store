import React, { createContext, useContext, useState, useEffect } from 'react';
import {wishListAPI} from '../services/api.js'; // Adjust the path as necessary

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await wishListAPI.getWishlist(); // Fetch the user's wishlist
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const addToWishlist = async (book) => {
    try {
      await wishListAPI.addToWishlist(book._id); // Add book to wishlist
      setWishlist((prev) => [...prev, book]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await wishListAPI.removeFromWishlist(bookId); // Remove book from wishlist
      setWishlist((prev) => prev.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}; 