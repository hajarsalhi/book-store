import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  Card,
  CardMedia,
  Stack,
  Chip,
  Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookPacks from '../Books/BookPacks';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState(cartItems);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDecrement = (bookId, quantity) => {
    if (quantity > 1) {
      setCartItem(cartItem.map((item) => item._id === bookId ? { ...item, quantity: item.quantity - 1 } : item));
      updateCartItemQuantity(bookId, quantity - 1);
    }
  };  

  const handleIncrement = (bookId, quantity) => {
    setCartItem(cartItem.map((item) => item._id === bookId ? { ...item, quantity: item.quantity + 1 } : item));
    updateCartItemQuantity(bookId, quantity + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#2C1810',
            borderBottom: '2px solid #DEB887',
            pb: 2,
            mb: 4
          }}
        >
          Shopping Cart
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.length === 0 ? (
              <Paper 
                elevation={3}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  backgroundColor: '#FFF8DC',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ color: '#2C1810', mb: 2 }}>
                  Your cart is empty
                </Typography>
                <Button 
                  variant="contained"
                  onClick={() => navigate('/books')}
                  sx={{ 
                    backgroundColor: '#8B4513',
                    '&:hover': { backgroundColor: '#654321' }
                  }}
                >
                  Continue Shopping
                </Button>
              </Paper>
            ) : (
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  backgroundColor: '#FFF8DC',
                  borderRadius: 2
                }}
              >
                {cartItems.map((item) => (
                  <Fade in={true} key={item._id}>
                    <Card 
                      sx={{ 
                        mb: 2, 
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
                        <Grid item xs={2}>
                          <CardMedia
                            component="img"
                            image={item.imageUrl || 'https://via.placeholder.com/100x150'}
                            alt={item.title}
                            sx={{ 
                              width: '100%', 
                              borderRadius: '4px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#2C1810',
                              fontWeight: 600,
                              mb: 1
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666',
                              mb: 1
                            }}
                          >
                            by {item.author}
                          </Typography>
                          <Chip 
                            label={item.category} 
                            size="small"
                            sx={{ 
                              backgroundColor: '#DEB887',
                              color: '#2C1810'
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#8B4513',
                              fontWeight: 700
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity}
                            <IconButton
                              size="small"
                              onClick={() => handleDecrement(item._id, item.quantity)}
                              sx={{ 
                                color: '#8B4513',
                                '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.04)' }
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => handleIncrement(item._id, item.quantity)}
                              sx={{ 
                                color: '#8B4513',
                                '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.04)' }
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton 
                            onClick={() => removeFromCart(item._id)}
                            sx={{ 
                              color: '#CD5C5C',
                              '&:hover': {
                                backgroundColor: 'rgba(205, 92, 92, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  </Fade>
                ))}
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  backgroundColor: '#FFF8DC',
                  borderRadius: 2
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2C1810',
                    borderBottom: '2px solid #DEB887',
                    pb: 1,
                    mb: 2
                  }}
                >
                  Order Summary
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${total.toFixed(2)}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button 
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/checkout')}
                    startIcon={<ShoppingCartIcon />}
                    sx={{ 
                      backgroundColor: '#8B4513',
                      '&:hover': { backgroundColor: '#654321' }
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Stack>
              </Paper>

              {/* Book Packs Section */}
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  backgroundColor: '#FFF8DC',
                  borderRadius: 2
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2C1810',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '2px solid #DEB887',
                    pb: 1,
                    mb: 2
                  }}
                >
                  <LocalOfferIcon sx={{ color: '#8B4513' }} />
                  Special Offers
                </Typography>
                <BookPacks />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default CartPage;
