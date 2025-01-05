import React from 'react';
import { Container, Box, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
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
          Your Wishlist
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
        {wishlist.length === 0 ? (
          <Typography>No items in your wishlist.</Typography>
        ) : (
          Array.isArray(wishlist) && wishlist
          .filter(book => book?._id)
          .map((book) => (
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
                  onClick={() => removeFromWishlist(book._id)} // Remove from wishlist
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
                  Remove
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => navigate(`/books/add-to-cart/${book._id}`)} 
                  sx={{
                    borderColor: '#8B4513',
                    color: '#8B4513',
                    mt: 2,
                    '&:hover': {
                      borderColor: '#654321',
                      backgroundColor: '#4CAF50',
                      color: '#FFF8DC'
                    }
                  }}
                >
                  Add to Cart
                </Button>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Wishlist; 