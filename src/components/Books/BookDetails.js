import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import { bookAPI } from '../../services/api';
import ReviewSection from './ReviewSection';

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await bookAPI.getBook(id);
      setBook(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching book details');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await bookAPI.addToCart(id, 1);
      navigate(`/books/add-to-cart/${book._id}`);
    } catch (error) {
      setError('Error adding book to cart');
    }
  };

  const handleReviewsChange = async () => {
    try {
      const response = await bookAPI.getBook(id);
      setBook(response.data);
    } catch (error) {
      setError('Error updating book details');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Book Details Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#FFF8DC' }}>
            <CardMedia
              component="img"
              height="400"
              image={book.imageUrl || 'https://via.placeholder.com/300x400?text=No+Cover'}
              alt={book.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ pl: { md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              fontFamily: '"Playfair Display", serif',
              color: '#2C1810'
            }}>
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Rating 
                value={book.averageRating} 
                readOnly 
                precision={0.5}
                sx={{ color: '#8B4513' }}
              />
              <Typography variant="body2" color="text.secondary">
                ({book.totalRatings} {book.totalRatings === 1 ? 'review' : 'reviews'})
              </Typography>
            </Stack>

            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Price: 
              {book.priceHistory.length > 0 && (
                <span style={{ color: 'red', textDecoration: 'line-through', marginRight: '8px' }}>
                  ${book.priceHistory[book.priceHistory.length - 1].price.toFixed(2)}
                </span>
              )}
              ${book.price.toFixed(2)}
            </Typography>

            <Typography variant="body2" color={book.stock > 0 ? 'success.main' : 'error.main'} sx={{ mb: 3 }}>
              {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
            </Typography>

            {!user?.isAdmin && book.stock > 0 && (
              <Button
                variant="contained"
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: '#8B4513',
                  mb: 3,
                  '&:hover': {
                    backgroundColor: '#654321'
                  }
                }}
              >
                Add to Cart
              </Button>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {book.description}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Category: {book.category}
            </Typography>
          </Box>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <ReviewSection 
            bookId={id} 
            onReviewsChange={handleReviewsChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookDetails; 