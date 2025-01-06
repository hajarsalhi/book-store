import React, { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Box,
  Divider,
  Rating,
  Button,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

const Deals = () => {
  const [dealsBooks, setDealsBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDealsBooks();
  }, []);

  const fetchDealsBooks = async () => {
    try {
      const response = await bookAPI.getAllBooks();
      // Filter books that have price history and where current price is lower than previous price
      const booksWithDeals = response.data.filter(book => 
        book.priceHistory && 
        book.priceHistory.length > 1 &&
        book.price < book.priceHistory[book.priceHistory.length - 1].price
      );
      setDealsBooks(booksWithDeals);
      setLoading(false);
    } catch (err) {
      setError('Error fetching deals');
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#2C1810',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            mb: 2
          }}
        >
          Special Deals
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#8B4513',
            fontFamily: '"Libre Baskerville", serif',
            mb: 3
          }}
        >
          Discover our books with special price reductions
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
        {dealsBooks.map((book) => (
          <Grid item xs={12} sm={6} md={3} key={book._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontFamily: '"Playfair Display", serif',
                    color: '#2C1810'
                  }}
                >
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Rating 
                    value={book.averageRating || 0} 
                    readOnly 
                    precision={0.5}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({book.totalRatings || 0})
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${book.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'red', textDecoration: 'line-through' }}
                  >
                    ${book.priceHistory[book.priceHistory.length - 1].price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: 'green',
                      backgroundColor: '#e8f5e9',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    Save ${(book.priceHistory[book.priceHistory.length - 1].price - book.price).toFixed(2)}
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      if (Array.isArray(wishlist) && wishlist.find(item => item._id === book._id)) {
                        removeFromWishlist(book._id);
                      } else {
                        addToWishlist(book);
                      }
                    }}
                    sx={{
                      backgroundColor: '#8B4513',
                      '&:hover': { backgroundColor: '#654321' }
                    }}
                  >
                    {Array.isArray(wishlist) && wishlist.find(item => item._id === book._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/books/${book._id}`)}
                    sx={{
                      color: '#8B4513',
                      borderColor: '#8B4513',
                      '&:hover': {
                        borderColor: '#654321',
                        backgroundColor: 'rgba(139, 69, 19, 0.04)'
                      }
                    }}
                  >
                    View Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Deals;
