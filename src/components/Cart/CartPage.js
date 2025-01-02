import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BookPacks from '../Books/BookPacks';

function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{
          fontFamily: '"Playfair Display", serif',
          color: '#2C1810'
        }}>
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#FFF8DC' }}>
            <Typography>Your cart is empty</Typography>
            <Button 
              onClick={() => navigate('/books')}
              sx={{ mt: 2, color: '#8B4513' }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, backgroundColor: '#FFF8DC' }}>
            {cartItems.map((item) => (
              <Box key={item._id}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <img 
                      src={item.imageUrl || 'https://via.placeholder.com/100x150'} 
                      alt={item.title}
                      style={{ width: '100%', borderRadius: '4px' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      by {item.author}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton 
                      onClick={() => removeFromCart(item._id)}
                      sx={{ color: '#CD5C5C' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}

            <BookPacks/>

            <Box sx={{ 
              mt: 3, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6">
                Total: ${total.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/books')}
                  sx={{ 
                    color: '#8B4513',
                    borderColor: '#8B4513'
                  }}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleCheckout}
                  sx={{ 
                    backgroundColor: '#8B4513',
                    '&:hover': { backgroundColor: '#654321' }
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

    </Container>
  );
}

export default CartPage;
