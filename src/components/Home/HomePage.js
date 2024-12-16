import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  return (
    <div className="home-container">
      <h1>Welcome to BookStore</h1>
      <div className="cards-container">
        <Link to="/books" className="card">
          <h2>Browse Books</h2>
          <p>Explore our collection of books</p>
        </Link>
        
        {isAdmin && ( // Only show management card if user is admin
          <Link to="/management" className="card">
            <h2>Manage Inventory</h2>
            <p>Add, edit, and manage books</p>
          </Link>
        )}
        
        {/* Other cards */}
      </div>
    </div>
  );
};

export default HomePage; 