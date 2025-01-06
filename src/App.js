import React, { useEffect } from 'react';
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
import { Provider } from 'react-redux';
import store from './store/index.js';
import AppInitializer from './components/App/AppInitializer';
import PurchaseBook from './components/Books/PurchaseBook';
import Checkout from './components/Checkout/Checkout';
import OrderHistory from './components/Orders/OrderHistory';
import SalesAnalytics from './components/Admin/Dashboard/SalesAnalytics';
import BookDetails from './components/Books/BookDetails';
import Wishlist from './components/Wishlist/Wishlist';
import { WishlistProvider } from './context/WishlistContext.js';
import Deals from './components/Books/Deals';

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <WishlistProvider>

        
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
                <Route path="admin/analytics" element={
                  <AdminRoute>
                    <SalesAnalytics />
                  </AdminRoute>
                } />
                <Route path="/books/purchase/:id" element={<PurchaseBook />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/deals" element={<Deals />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
        </WishlistProvider>
      </AppInitializer>
    </Provider>
  );
}

export default App;