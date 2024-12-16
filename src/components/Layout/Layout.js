import React from 'react';
import { Link, Outlet,useNavigate } from 'react-router-dom';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';
import './Layout.css';

const Layout = () => {
  const { getCartCount } = useCart();  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">BookStore</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          {isAdmin && <Link to="/management">Stock Management</Link>}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <button onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              window.location.href = '/';
            }}>Logout</button>
          )}

{!isAdmin && (
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              sx={{ ml: 'auto' }}
            >
              <Badge badgeContent={getCartCount()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}

        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 