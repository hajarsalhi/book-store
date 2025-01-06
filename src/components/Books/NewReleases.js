import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card,CardMedia, CardContent, Button, Divider,Link, Rating, Stack} from '@mui/material';
import { bookAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const NewReleases = ({ wishlist,onAddToWishlist, onRemoveFromWishlist }) => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;


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

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        textAlign: 'center',
        fontFamily: '"Playfair Display", serif',
        color: '#2C1810'
      }}>
        New Releases
      </Typography>
      <Divider sx={{ 
            width: '60px', 
            margin: '0 auto', 
            borderColor: '#8B4513',
            borderWidth: 2,
            mb: 4
          }} />
      <Grid container spacing={2}>
        {newReleases.map((book) => (
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
              {!isAdmin && (<Button
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

export default NewReleases;
