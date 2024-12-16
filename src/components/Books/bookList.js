import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import './bookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get user from localStorage to check if admin
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAllBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching books');
      setLoading(false);
    }
  };

  const handlePurchase = async (bookId) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      await bookAPI.purchaseBook(bookId);
      // Refresh the books list after purchase
      fetchBooks();
      alert('Purchase successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error purchasing book');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="book-list">
      <h2>Books</h2>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <div className="book-image">
              <img 
                src={book.image} 
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
                }}
              />
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">By {book.author}</p>
              <p className="price">${book.price.toFixed(2)}</p>
              <p className="stock">In Stock: {book.stock}</p>
              {!isAdmin && book.stock > 0 && (
                <button 
                  className="purchase-button"
                  onClick={() => navigate(`/books/add-to-cart/${book._id}`)}
                >
                  Purchase
                </button>
              )}
              {!isAdmin && book.stock === 0 && (
                <p className="out-of-stock">Out of Stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
