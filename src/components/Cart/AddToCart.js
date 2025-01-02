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
  Alert,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { bookAPI } from '../../services/api';
import BookPacks from '../Books/BookPacks';

const AddToCart = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [category,setCategory]=useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookAPI.getBook(id);
        setBook(response.data);
        setCategory(response.data.category);
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
      addToCart(book._id, quantity,category,book);
      navigate('/cart');
    } catch (err) {
      setError('Error adding to cart');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Book not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: '12px',
            backgroundColor: '#FFF8DC'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={() => navigate('/books')}
              sx={{ 
                mr: 2,
                color: '#8B4513',
                '&:hover': {
                  backgroundColor: 'rgba(139, 69, 19, 0.08)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                color: '#2C1810',
                fontWeight: 600
              }}
            >
              Add to Cart
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Card 
                elevation={0}
                sx={{ 
                  backgroundColor: 'transparent',
                  height: '100%'
                }}
              >
                <CardMedia
                  component="img"
                  image={book.imageUrl || 'https://via.placeholder.com/300x450?text=No+Cover'}
                  alt={book.title}
                  sx={{ 
                    height: 400,
                    objectFit: 'contain',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <CardContent sx={{ p: 0 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{ 
                    fontFamily: '"Playfair Display", serif',
                    color: '#2C1810',
                    fontWeight: 600
                  }}
                >
                  {book.title}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#5C4033',
                    mb: 2,
                    fontStyle: 'italic'
                  }}
                >
                  by {book.author}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    color: '#2C1810',
                    lineHeight: 1.8
                  }}
                >
                  {book.description}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="h5" 
                    color="primary" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    ${book.price.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: book.stock > 0 ? 'success.main' : 'error.main',
                      mb: 2
                    }}
                  >
                    {book.stock > 0 ? `${book.stock} copies available` : 'Out of Stock'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <TextField
                      type="number"
                      label="Quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      InputProps={{ 
                        inputProps: { min: 1, max: book.stock },
                      }}
                      sx={{
                        width: '100px',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#8B4513',
                          },
                          '&:hover fieldset': {
                            borderColor: '#654321',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8B4513',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#8B4513',
                          '&.Mui-focused': {
                            color: '#8B4513',
                          },
                        },
                      }}
                    />
                    <Typography variant="h6" sx={{ color: '#2C1810' }}>
                      Total: ${(book.price * quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/books')}
                      sx={{
                        flex: 1,
                        color: '#8B4513',
                        borderColor: '#8B4513',
                        '&:hover': {
                          borderColor: '#654321',
                          backgroundColor: 'rgba(139, 69, 19, 0.04)'
                        },
                        height: '48px'
                      }}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAddToCart}
                      disabled={book.stock === 0}
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        flex: 1,
                        backgroundColor: '#8B4513',
                        '&:hover': {
                          backgroundColor: '#654321'
                        },
                        height: '48px'
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddToCart;
