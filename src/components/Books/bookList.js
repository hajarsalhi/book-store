import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import { Box, Typography, Tabs, Tab, Grid, Card, CardMedia, CardContent, Button, Divider } from '@mui/material';
import './bookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  
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

  // Group books by category with null check
  const booksByCategory = books.reduce((acc, book) => {
    const category = book.category || 'Other'; // Default to 'Other' if category is undefined
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(book);
    return acc;
  }, {});

  // Get unique categories with null check
  const categories = ['all', ...new Set(books.map(book => book.category || 'Other'))];

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        textAlign: 'center',
        fontFamily: '"Playfair Display", serif',
        color: '#2C1810'
      }}>
        Our Book Collection
      </Typography>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              color: '#8B4513',
              '&.Mui-selected': { color: '#2C1810' }
            }
          }}
        >
          {categories.map(category => (
            <Tab 
              key={category} 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
              value={category}
            />
          ))}
        </Tabs>
      </Box>

      {/* Books Grid */}
      <Grid container spacing={4}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="img"
                height="250"
                image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ 
                  fontFamily: '"Playfair Display", serif',
                  color: '#2C1810'
                }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {book.category || 'Other'}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${book.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color={book.stock > 0 ? 'success.main' : 'error.main'}>
                  {book.stock > 0 ? `In Stock: ${book.stock}` : 'Out of Stock'}
                </Typography>
                
                {!isAdmin && book.stock > 0 && (
                  <Button 
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#8B4513',
                      '&:hover': { backgroundColor: '#654321' }
                    }}
                    onClick={() => navigate(`/books/add-to-cart/${book._id}`)}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookList;
