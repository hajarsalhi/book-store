import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import { Box, Typography, Tabs, Tab, Grid, Card, CardMedia, CardContent, Button, Divider, Rating, Stack, CircularProgress, Alert, Container, Paper } from '@mui/material';
import './bookList.css';
import AdvancedSearch from './AdvancedSearch';
import TopRatedBooks from './TopRatedBooks';
import BestSellers from './BestSellers';
import NewReleases from './NewReleases';
import { useWishlist } from '../../context/WishlistContext';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const {wishlist,addToWishlist,removeFromWishlist} = useWishlist();

  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await bookAPI.getAllBooks();
      const uniqueCategories = [...new Set(response.data.map(book => book.category).filter(Boolean))];
      setCategories(['all', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSearchActive(newValue);
  };

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handleSearch = async (filters) => {
    try {
      setError(null); // Clear any existing errors
      setLoading(true); // Show loading state
      setSearchTerm(filters);
      setSearchActive(filters.title?.trim().length > 0); // Set searchActive based on title filter

      const queryParams = new URLSearchParams();
      
      if (filters.title?.trim()) {
        queryParams.append('title', filters.title.trim());
      }
      if (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 200) {
        queryParams.append('priceRange', filters.priceRange.join(','));
      }
      if (filters.category?.length > 0) {
        queryParams.append('category', filters.category.join(','));
      }
      if (filters.author?.trim()) {
        queryParams.append('author', filters.author.trim());
      }
      if (filters.publicationDate) {
        queryParams.append('publicationDate', filters.publicationDate.toISOString());
      }
      if (filters.rating) {
        queryParams.append('rating', filters.rating.toString());
      }
      if (filters.inStock) {
        queryParams.append('inStock', filters.inStock.toString());
      }

      const queryString = queryParams.toString();
      console.log('Search params:', queryString);

      const response = await bookAPI.searchBooks(queryString);
      setBooks(response.data);
      setSelectedCategory('all');

    } catch (error) {
      console.error('Search error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Error searching books'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

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
              label={category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)} 
              value={category}
            />
          ))}
        </Tabs>
      </Box>

      <AdvancedSearch onSearch={handleSearch} categories={categories.filter(cat => cat !== 'all')} />

      {/* Conditionally render sections based on searchActive */}
      {!searchActive && <NewReleases books={books.filter(book => book.isNew)} wishlist={wishlist} onAddToWishlist={addToWishlist} onRemoveFromWishlist={removeFromWishlist} />}
      {!searchActive && <TopRatedBooks books={books.filter(book => book.isTopRated)} wishlist={wishlist} onAddToWishlist={addToWishlist} onRemoveFromWishlist={removeFromWishlist} />}
      {!searchActive && <BestSellers books={books.filter(book => book.isBestSeller)} wishlist={wishlist} onAddToWishlist={addToWishlist} onRemoveFromWishlist={removeFromWishlist} />}

      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        textAlign: 'center',
        fontFamily: '"Playfair Display", serif',
        color: '#2C1810'
      }}>
        All Books
      </Typography>
      <Divider sx={{ 
            width: '60px', 
            margin: '0 auto', 
            borderColor: '#8B4513',
            borderWidth: 2,
            mb: 4
          }} />
      {/* Books Grid */}
      
      <Grid container spacing={4}>
        {filteredBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${book._id}-${index}`}>
            <Card sx={{ position: 'relative', overflow: 'hidden', height:'100%'}}>
              <CardMedia
              component="img"
              height="450"
              image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
              alt={book.title}
              sx={{ objectFit: 'cover' , transition: 'transform 0.3s ease'}}
            
              />
                
              <CardContent sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 1,
                },
              }}>
                <Link 
                  to={`/books/${book._id}`} 
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontFamily: '"Playfair Display", serif',
                      color: '#2C1810',
                      '&:hover': {
                        color: '#8B4513'
                      }
                    }}
                  >
                    {book.title}
                  </Typography>
                </Link>
                
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Rating 
                    value={book.averageRating || 0} 
                    readOnly 
                    precision={0.5}
                    size="small"
                    sx={{ 
                      color: '#8B4513',
                      '& .MuiRating-iconEmpty': {
                        color: '#DEB887'
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({book.totalRatings || 0})
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {book.category || 'Other'}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${book.price.toFixed(2)}
                </Typography>
                {book.priceHistory.length > 1 && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', textDecoration: 'line-through' }}
                    >
                      ${book.priceHistory[book.priceHistory.length - 1].price.toFixed(2)}
                    </Typography>
                  )}
                <Typography variant="body2" color={book.stock > 0 ? 'success.main' : 'error.main'}>
                  {book.stock > 0 ? `In Stock: ${book.stock}` : 'Out of Stock'}
                </Typography>
                
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#8B4513',
                      '&:hover': { backgroundColor: '#654321' }
                    }}
                    onClick={() => {
                      if (Array.isArray(wishlist) && wishlist.find(item => item._id === book._id)) {
                        removeFromWishlist(book._id);
                      } else {
                        addToWishlist(book);
                      }
                    }}
                  >
                    {Array.isArray(wishlist) && wishlist.find(item => item._id === book._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
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
