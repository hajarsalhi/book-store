import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [lastAddedBookCategory, setLastAddedBookCategory] = useState(null);

  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (bookId, quantity, category, bookDetails) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item._id === bookId);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === bookId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...bookDetails, quantity }];
    });
    setLastAddedBookCategory(category);
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === bookId
          ? { ...item, quantity: parseInt(quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateCartItemQuantity = (bookId, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item._id === bookId ? { ...item, quantity: newQuantity } : item
      );
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      lastAddedBookCategory,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      updateCartItemQuantity
    }}>
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
