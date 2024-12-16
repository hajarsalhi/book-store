import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import BookList from './components/Books/bookList';
import AddBook from './components/Books/AddBook';
import EditBook from './components/Books/EditBook';
import Login from './components/Auth/Login';
import StockManagement from './components/Store/StockManagement';
import SignUp from './components/Auth/SignUp.js';
import AdminRoute from './components/Auth/AdminRoute';
import AddToCart from './components/Cart/AddToCart';
import CartPage from './components/Cart/CartPage';
import { CartProvider } from './context/CartContext';
function App() {
  return (
    <CartProvider>
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="books" element={<BookList />} />
          <Route path="/books/add-to-cart/:id" element={<AddToCart />} />
          <Route path="cart" element={<CartPage />} />
          {/* Protected Routes */}
          <Route path="management" element={
            <AdminRoute>
              <StockManagement />
            </AdminRoute>
          }>
            <Route path="add-book" element={<AddBook />} />
            <Route path="edit/:id" element={<EditBook />} />
          </Route>
         
        </Route>
      </Routes>
    </Router>
    </CartProvider>
    
  );
}

export default App;