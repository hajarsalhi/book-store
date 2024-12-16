import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Alert
} from '@mui/material';
import { bookAPI } from '../../services/api';

const AddToCart = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookAPI.getBook(id);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading book details');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= book.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      // Add to cart logic here
      // You'll need to implement this in your API
      addToCart(book, quantity);
      navigate('/cart'); // Navigate to cart page after adding
    } catch (err) {
      setError('Error adding to cart');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!book) return <Typography>Book not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={book.image}
                alt={book.title}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                by {book.author}
              </Typography>
              <Typography variant="body1" paragraph>
                {book.description}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                ${book.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Available: {book.stock} copies
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  InputProps={{ inputProps: { min: 1, max: book.stock } }}
                  sx={{ width: '100px', mr: 2 }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Total: ${(book.price * quantity).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  sx={{ mr: 2 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/books')}
                >
                  Back to Books
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddToCart;
