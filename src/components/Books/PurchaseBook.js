import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import { bookAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

function PurchaseBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookAPI.getBookById(id);
      setBook(response.data);
    } catch (err) {
      setError('Error loading book details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      await bookAPI.purchaseBook(id);
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing purchase');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
    );
  }

  if (!book) {
    return <Alert severity="error">Book not found</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', backgroundColor: '#FFF8DC' }}>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Purchase successful! Redirecting to books page...
            </Alert>
          ) : (
            <>
              <Typography variant="h4" component="h1" gutterBottom sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#2C1810',
                mb: 3
              }}>
                Purchase Book
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <img
                    src={book.imageUrl || 'https://via.placeholder.com/200x300?text=No+Cover'}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {book.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Price: ${book.price.toFixed(2)}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      color={book.stock > 0 ? 'success.main' : 'error.main'}
                    >
                      {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
                    </Typography>
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/books')}
                      sx={{
                        color: '#8B4513',
                        borderColor: '#8B4513',
                        '&:hover': {
                          borderColor: '#654321',
                          backgroundColor: 'rgba(139, 69, 19, 0.04)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handlePurchase}
                      disabled={purchasing || book.stock < 1}
                      sx={{
                        backgroundColor: '#8B4513',
                        '&:hover': { backgroundColor: '#654321' }
                      }}
                    >
                      {purchasing ? 'Processing...' : 'Confirm Purchase'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default PurchaseBook; 