import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import { Box, Typography, Tabs, Tab, Grid, Card, CardMedia, CardContent, Button, Divider, Rating, Stack, CircularProgress, Alert, Container, Paper } from '@mui/material';
import './bookList.css';
import AdvancedSearch from './AdvancedSearch';
import TopRatedBooks from './TopRatedBooks';
import { useWishlist } from '../../context/WishlistContext';
import { useLocation } from 'react-router-dom';
import QuickViewModal from './Modal/QuickViewModal';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const {wishlistItems,addToWishlist,removeFromWishlist} = useWishlist();
  const allBooksRef = useRef(null);
  const location = useLocation();
  const [selectedBook, setSelectedBook] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    category: [],
    rating: 0,
    inStock: false,
    priceRange: [0, 1000],
    publicationDate: null
  });
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;
  const isLoggedIn = !!user;

  console.log('Search Active:', searchActive);
  console.log('Current Filters:', filters);

  const isAnyFilterActive = (filters) => {
    return (
      filters.title?.trim().length > 0 ||
      filters.author?.trim().length > 0 ||
      filters.category?.length > 0 ||
      filters.rating > 0 ||
      filters.inStock ||
      (filters.priceRange && 
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000)) ||
      filters.publicationDate !== null
    );
  };

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
  };

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handleSearch = async (newFilters) => {
    try {
      setError(null);
      setLoading(true);
      
      setFilters(newFilters);
      
      const hasActiveFilters = 
        newFilters.title?.trim().length > 0 ||
        newFilters.author?.trim().length > 0 ||
        newFilters.category?.length > 0 ||
        newFilters.rating > 0 ||
        newFilters.inStock ||
        (newFilters.priceRange && 
          (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 1000)) ||
        newFilters.publicationDate !== null;

      setSearchActive(hasActiveFilters);

      const queryParams = new URLSearchParams();
      
      if (newFilters.title?.trim()) {
        queryParams.append('title', newFilters.title.trim());
      }
      if (newFilters.priceRange?.[0] > 0 || newFilters.priceRange?.[1] < 200) {
        queryParams.append('priceRange', newFilters.priceRange.join(','));
      }
      if (newFilters.category?.length > 0) {
        queryParams.append('category', newFilters.category.join(','));
      }
      if (newFilters.author?.trim()) {
        queryParams.append('author', newFilters.author.trim());
      }
      if (newFilters.publicationDate) {
        queryParams.append('publicationDate', newFilters.publicationDate.toISOString());
      }
      if (newFilters.rating) {
        queryParams.append('rating', newFilters.rating.toString());
      }
      if (newFilters.inStock) {
        queryParams.append('inStock', newFilters.inStock.toString());
      }

      const queryString = queryParams.toString();
      console.log('Search params:', queryString);

      const response = await bookAPI.searchBooks(queryString);
      setBooks(response.data);
      setSelectedCategory('all');

    } catch (error) {
      console.error('Search error:', error);
      setError(error.response?.data?.message || error.message || 'Error searching books');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (book) => {
    setSelectedBook(book);
    setQuickViewOpen(true);
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
      { !searchActive &&   
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TopRatedBooks books={books.filter(book => book.isTopRated)} 
          wishlist={wishlistItems} onAddToWishlist={addToWishlist} 
          onRemoveFromWishlist={removeFromWishlist} allBooksRef={allBooksRef} 
        />
      </Box>
      }

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
      
      <Grid container spacing={4} ref={allBooksRef}>
        {filteredBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${book._id}-${index}`}>
            <Card 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                height:'100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
                border: '1px solid #DEB887',
                borderRadius: '8px',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
              component="img"
              height="450"
              image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
              alt={book.title}
              sx={{ objectFit: 'cover' , borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}
            
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
                
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate('/login', { state: { from: location.pathname } });
                          return;
                        }
                        if (Array.isArray(wishlistItems) && wishlistItems.find(item => item._id === book._id)) {
                          removeFromWishlist(book._id);
                        } else {
                          addToWishlist(book);
                        }
                      }}
                      sx={{
                        backgroundColor: '#8B4513',
                        '&:hover': { backgroundColor: '#654321' },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(139, 69, 19, 0.12)',
                        }
                      }}
                    >
                      {!isLoggedIn ? 'Login to Add to Wishlist' : 
                        (Array.isArray(wishlistItems) && wishlistItems.find(item => item._id === book._id) ? 
                          'Remove from Wishlist' : 'Add to Wishlist')}
                    </Button>

                    <Button 
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate('/login', { state: { from: location.pathname } });
                          return;
                        }
                        navigate(`/books/add-to-cart/${book._id}`);
                      }}
                      sx={{
                        backgroundColor: '#8B4513',
                        '&:hover': { backgroundColor: '#654321' },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(139, 69, 19, 0.12)',
                        }
                      }}
                    >
                      {!isLoggedIn ? 'Login to Add to Cart' : 'Add to Cart'}
                    </Button>
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleQuickView(book)}
                    sx={{
                      color: '#8B4513',
                      borderColor: '#8B4513',
                      mb: 1,
                      mt:2,
                      '&:hover': {
                        borderColor: '#654321',
                        backgroundColor: 'rgba(139, 69, 19, 0.04)'
                      }
                    }}
                  >
                    Quick View
                  </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <QuickViewModal
        book={selectedBook}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </Box>
  );
};

export default BookList;
