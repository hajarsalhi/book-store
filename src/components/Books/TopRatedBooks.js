import React, { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api';
import { Box, Typography,Divider, Grid, Card, CardContent, CardMedia, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TopRatedBooks = () => {
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        textAlign: 'center',
        fontFamily: '"Playfair Display", serif',
        color: '#2C1810'
      }}>
        Top Rated Books
      </Typography>
      <Divider sx={{ 
            width: '60px', 
            margin: '0 auto', 
            borderColor: '#8B4513',
            borderWidth: 2,
            mb: 4
          }} />
      <Grid container spacing={4}>
        {topRatedBooks.map((book) => (
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
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#2C1810', fontSize: '1.1rem' }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {book.averageRating} ({book.totalRatings || 0} ratings)
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

export default TopRatedBooks; 