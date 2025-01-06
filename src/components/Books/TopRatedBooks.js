import React, { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api';
import { Box, Typography,Divider, Grid, Card, CardContent, CardMedia, CircularProgress, Button,Link, Stack, Rating, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const TopRatedBooks = ({ books, wishlist, onAddToWishlist, onRemoveFromWishlist ,allBooksRef}) => {
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const scrollToAllBooks = () => {
    allBooksRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        const response = await bookAPI.getTopRatedBooks();
        const filteredBooks = response.data.filter(book => book.averageRating >= 4).slice(0, 4);
        setTopRatedBooks(filteredBooks);
      } catch (error) {
        console.error('Error fetching top-rated books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedBooks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <LocalLibraryIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Top Rated Books
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: 4,
              color: '#DEB887',
              fontFamily: '"Libre Baskerville", serif',
              lineHeight: 1.6
            }}
          >
            Discover our highest-rated books, loved by readers worldwide
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={scrollToAllBooks}
            sx={{
              backgroundColor: '#DEB887',
              color: '#2C1810',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#D2691E',
                color: '#FFF8DC'
              }
            }}
          >
            View All Books
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {topRatedBooks.map((book) => (
              <Grid item xs={6} key={book._id}>
                <Card sx={{ 
                  transition: 'transform 0.2s', 
                  '&:hover': { transform: 'scale(1.05)' },
                  border: '1px solid #DEB887',
                  borderRadius: '8px',
                  boxShadow: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <CardMedia
                    component="img"
                    height="450"
                    image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
                    alt={book.title}
                    sx={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
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
                    <Typography variant="body2" color="text.secondary">
                      Rating: {book.averageRating} ({book.totalRatings || 0} ratings)
                    </Typography>
                    <Typography variant="body2">{book.author}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating value={book.averageRating || 0} readOnly precision={0.5} size="small" />
                      <Typography variant="body2">({book.totalRatings || 0})</Typography>
                    </Stack>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${book.price.toFixed(2)}</Typography>
                    {book.priceHistory.length > 1 && (
                      <Typography variant="body2" sx={{ color: 'red', textDecoration: 'line-through' }}>
                        ${book.priceHistory[book.priceHistory.length - 1].price.toFixed(2)}
                      </Typography>
                    )}
                    
                    {!isAdmin && book.stock > 0 
                    && (
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
                            onRemoveFromWishlist(book._id);
                          } else {
                            onAddToWishlist(book);
                          }
                        }}
                      >
                        {Array.isArray(wishlist) && wishlist.find(item => item._id === book._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      </Button>
                    )}
                    
                    {book.stock > 0 && (
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default TopRatedBooks; 