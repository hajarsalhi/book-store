import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { commandAPI } from '../../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      
      const orderItems = cartItems.map(item => ({
        bookId: item._id,
        quantity: item.quantity
      }));

      const response = await commandAPI.createCommand(orderItems);
      setOrderDetails(response.data.command);
      setSuccess(true);
      clearCart();
      
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.response?.data?.message || 'Error processing purchase');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/books');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (cartItems.length === 0 && !success) {
    return navigate('/cart');
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', backgroundColor: '#FFF8DC' }}>
          {success ? (
            <Dialog
              open={success}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  backgroundColor: '#FFF8DC'
                }
              }}
            >
              <DialogTitle sx={{ 
                textAlign: 'center', 
                color: '#2C1810',
                pt: 3 
              }}>
                <CheckCircleOutlineIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: 'success.main',
                    mb: 2 
                  }} 
                />
                <Typography variant="h5" component="div">
                  Purchase Successful!
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    Thank you for your purchase. Your order has been confirmed.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Order ID: {orderDetails?._id}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Order Summary:
                </Typography>
                <List>
                  {orderDetails?.items.map((item, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemText
                        primary={item.book.title}
                        secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                      />
                      <Typography variant="body1">
                        ${(item.quantity * item.price).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={<Typography variant="h6">Total</Typography>}
                    />
                    <Typography variant="h6">
                      ${orderDetails?.totalAmount.toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
              </DialogContent>
              <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleViewOrders}
                  sx={{
                    backgroundColor: '#2C1810',
                    '&:hover': { backgroundColor: '#1a0f0a' }
                  }}
                >
                  View Orders
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    color: '#8B4513',
                    borderColor: '#8B4513',
                    '&:hover': { 
                      borderColor: '#654321',
                      backgroundColor: 'rgba(139, 69, 19, 0.04)'
                    }
                  }}
                >
                  Continue Shopping
                </Button>
              </DialogActions>
            </Dialog>
          ) : (
            <>
              <Typography variant="h4" component="h1" gutterBottom sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#2C1810',
                mb: 3
              }}>
                Checkout
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                {cartItems.map((item) => (
                  <Box key={item._id}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Grid item xs={2}>
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/100x150'}
                          alt={item.title}
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {item.author}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}

                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Typography variant="h6">
                    Total: ${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/cart')}
                  sx={{
                    color: '#8B4513',
                    borderColor: '#8B4513',
                    '&:hover': {
                      borderColor: '#654321',
                      backgroundColor: 'rgba(139, 69, 19, 0.04)'
                    }
                  }}
                >
                  Back to Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePurchase}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#8B4513',
                    '&:hover': { backgroundColor: '#654321' }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Confirm Purchase'
                  )}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Checkout; 