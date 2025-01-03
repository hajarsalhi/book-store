import React, { useEffect, useState } from 'react';
import { Box, Typography,Divider, Grid, Card, CardContent, CardMedia, Button,Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import axios from 'axios';


const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await bookAPI.getBestSellers();
        const filteredBooks = response.data.filter(book => book.salesCount >0).slice(0, 4);
        setBestSellers(filteredBooks);

      } catch (error) {
        console.error('Error fetching best sellers:', error);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <Box sx={{ my: 4 }}>
    <Typography variant="h4" component="h2" gutterBottom sx={{ 
      textAlign: 'center',
      fontFamily: '"Playfair Display", serif',
      color: '#2C1810'
    }}>
      Best Sellers
    </Typography>
    <Divider sx={{ 
          width: '60px', 
          margin: '0 auto', 
          borderColor: '#8B4513',
          borderWidth: 2,
          mb: 4
        }} />
    <Grid container spacing={4}>
      {bestSellers.map((book) => (
        <Grid item xs={12} sm={6} md={3} key={book._id}>
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
              height="200"
              image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
              alt={book.title}
              sx={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
            />
            <CardContent>
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
              <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {book.category || 'Other'}
                </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${book.price.toFixed(2)}
                </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
              {book.priceHistory.length > 0 && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'red', textDecoration: 'line-through' }}
                    >
                      ${book.priceHistory[book.priceHistory.length - 1].price.toFixed(2)}
                    </Typography>
                )}
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

export default BestSellers;
