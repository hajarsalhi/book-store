import { Box, Container, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TopRatedBooks from '../Books/TopRatedBooks';
import { useWishlist } from '../../context/WishlistContext';
import NewReleases from '../Books/NewReleases';
import BestSellers from '../Books/BestSellers';

function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const {wishlist,addToWishlist,removeFromWishlist} = useWishlist();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await bookAPI.getAllBooks();
        setFeaturedBooks(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchFeaturedBooks();
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

  useEffect(() => {
    fetchBooks();
  }, []);


  return (
    <Box sx={{ backgroundColor: '#FFF8DC', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(rgba(70, 35, 10, 0.95), rgba(110, 55, 20, 0.90)), 
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E"),
            url('/images/library-bg.jpg')`,
          backgroundSize: 'auto, auto, cover',
          backgroundPosition: 'center',
          color: '#FFF8DC',
          py: { xs: 8, md: 12 },
          mb: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(25, 15, 5, 0.1)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg">
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
                Discover Your Next Literary Adventure
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
                Immerse yourself in our carefully curated collection of timeless classics 
                and contemporary masterpieces
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/books')}
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
                Explore Collection
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>


      {/* Featured Books Section */}
      <NewReleases books={books.filter(book => book.isNew)} wishlist={wishlist} onAddToWishlist={addToWishlist} onRemoveFromWishlist={removeFromWishlist} />
      <BestSellers books={books.filter(book => book.isBestSeller)} wishlist={wishlist} onAddToWishlist={addToWishlist} onRemoveFromWishlist={removeFromWishlist} />
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: '#2C1810',
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              mb: 2
            }}
          >
            Featured Books
          </Typography>
          <Divider sx={{ 
            width: '60px', 
            margin: '0 auto', 
            borderColor: '#8B4513',
            borderWidth: 2,
            mb: 4
          }} />
        </Box>
        
        <Grid container spacing={4}>
          {featuredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(139, 69, 19, 0.15)'
                  }
                }}
              >
                <Box sx={{ 
                  position: 'relative',
                  paddingTop: '140%',
                  mb: 2,
                  overflow: 'hidden'
                }}>
                  <img
                    src={book.imageUrl || '/images/default-book.jpg'}
                    alt={book.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: '#2C1810'
                  }}
                >
                  {book.title}
                </Typography>
                <Typography 
                  sx={{ 
                    mb: 2,
                    color: '#5C4033',
                    fontFamily: '"Libre Baskerville", serif',
                    fontSize: '0.9rem'
                  }}
                >
                  {book.author}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 'auto',
                    mb: 2,
                    color: '#8B4513',
                    fontWeight: 700
                  }}
                >
                  ${book.price}
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={() => navigate(`/books/add-to-cart/${book._id}`)}
                  sx={{
                    borderColor: '#8B4513',
                    color: '#8B4513',
                    '&:hover': {
                      borderColor: '#654321',
                      backgroundColor: '#4CAF50',
                      color: '#FFF8DC'
                    }
                  }}
                >
                  Purchase
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

    </Box>
  );
}

export default HomePage; 