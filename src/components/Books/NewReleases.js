import React, { useEffect, useState } from 'react';
import { Box, Typography,Divider, Grid, Card, CardContent, CardMedia, CircularProgress, Button,Link, Stack, Rating, Container, Paper } from '@mui/material';
import { bookAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const NewReleases = ({ books, wishlist,onAddToWishlist, onRemoveFromWishlist }) => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;
  const isLoggedIn = !!user;


  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await bookAPI.getNewReleases();
        const sortedBooks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredBooks = sortedBooks.slice(0, 4);
        setNewReleases(filteredBooks);
      } catch (err) {
        setError('Error fetching new releases: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;


    // Similar structure for NewReleases.js and BestSellers.js
  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#2C1810',
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              mb: 2
            }}
          >
            New Releases
        </Typography>
        <Divider sx={{ 
            width: '60px', 
            margin: '0 auto', 
            borderColor: '#8B4513',
            borderWidth: 2,
            mb: 4
          }} />
      </Box>
      <Grid container spacing={4} >
          {newReleases.map((book) => (
              <Grid item xs={12} sm={6} md={3} key={book._id} >
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
                <Link href={`/books/${book._id}`} style={{ textDecoration: 'none' }}>
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
                </Link>
                  
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
                
                {book.stock > 0 &&
                !isAdmin &&
                (
                  <Button 
                    variant="outlined"
                    disabled={!isLoggedIn}
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
                )}
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!isLoggedIn}
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
                    

              </Paper>
            
              </Grid>
          ))}
        </Grid>
    </Container>
  );
};

export default NewReleases;