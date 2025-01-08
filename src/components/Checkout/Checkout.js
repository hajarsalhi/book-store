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
  ListItemText,
  TextField,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Stack
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import { commandAPI } from '../../services/api';
import { couponAPI } from '../../services/api';
import { libraryAPI } from '../../services/api';
import { userAPI } from '../../services/api';


function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [relatedBooksWithAuthor, setRelatedBooksWithAuthor] = useState([]);
  const [relatedBooksWithCategory, setRelatedBooksWithCategory] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [couponError, setCouponError] = useState('');
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [messageColor, setMessageColor] = useState('');
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountCaracter, setDiscountCaracter]= useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validateCard = () => {
    const errors = {};
    
    // Card number validation (16 digits)
    if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Invalid card number';
    }

    // Card holder validation
    if (!paymentDetails.cardHolder.trim()) {
      errors.cardHolder = 'Cardholder name is required';
    }

    // Expiry date validation (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentDetails.expiryDate)) {
      errors.expiryDate = 'Invalid expiry date (MM/YY)';
    }

    // CVV validation (3 or 4 digits)
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      errors.cvv = 'Invalid CVV';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .match(/.{1,4}/g)
        ?.join(' ') || '';
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    setPaymentDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePurchase = async () => {
    if (!validateCard()) {
      return;
    }

    try {
      setLoading(true);
      
      // Calculate final total starting with original total
      let finalTotal = total;

      // Apply coupon discount first if it exists
      if (discount > 0) {
        if (discountCaracter === '%') {
          finalTotal -= (finalTotal * (discount / 100));
        } else if (discountCaracter === '$') {
          finalTotal -= discount;
        }
      }

      // Then apply loyalty discount if it exists
      const loyaltyDiscountResponse = await couponAPI.calculateLoyaltyDiscount();
      const loyaltyDiscountPercentage = loyaltyDiscountResponse.data.discount;
      setLoyaltyDiscount(loyaltyDiscountPercentage);
      
      if (loyaltyDiscountPercentage > 0) {
        finalTotal -= (finalTotal * (loyaltyDiscountPercentage / 100));
      }

      // Ensure final total is not negative
      finalTotal = Math.max(finalTotal, 0);
      setTotalAmount(finalTotal);

      // Create the order with the final total
      const orderItems = cartItems.map(item => ({
        bookId: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await commandAPI.createCommand({ 
        items: orderItems, 
        totalAmount: finalTotal,
        appliedDiscounts: {
          coupon: discount > 0 ? { amount: discount, type: discountCaracter } : null,
          loyalty: loyaltyDiscountPercentage > 0 ? { amount: loyaltyDiscountPercentage, type: '%' } : null
        }
      });

      for (const item of response.data.command.items) {
        await libraryAPI.addToLibrary(item.book._id);
      }

      setOrderDetails(response.data.command);
      setRelatedBooksWithAuthor(response.data.relatedBooksWithAuthor);
      setRelatedBooksWithCategory(response.data.relatedBooksWithCategory);
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

// Utility function to handle errors
  const handleError = (status) => {
    if (status) {
      switch (status) {
        case 400:
          return 'Coupon has expired or is not valid. Please use a different coupon.';
        case 401:
          return 'Coupon usage limit reached.';
        case 402:
          return 'Minimum purchase amount not met for this coupon.';
        case 403:
          return 'You have already used this coupon.';
        case 404:
          return 'Coupon not found. Please check the code and try again.';
        case 200:
          return 'Coupon applied successfully, discount applied';
        case 201:
          return 'Free shipping applied!'
        default:
          return 'An error occurred while applying the coupon. Please try again.';
      }
    } else {
      return 'Network error. Please check your connection.';
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await couponAPI.validate(couponCode);
      console.log('Coupon validation response:', response);

      // Set discount based on the response
      const discountValue = response.data.discount;
      setDiscount(discountValue);

      // Calculate discounted total based on coupon type
      let newDiscountedTotal = total; // Start with the total
      if (response.data.couponType === 'percentage') {
        newDiscountedTotal -= (total * (discountValue / 100));
        setDiscountCaracter("%");
      } else if (response.data.couponType === 'fixed') {
        newDiscountedTotal -= discountValue;
        setDiscountCaracter("$");
      }

      // Ensure discounted total is not negative
      newDiscountedTotal = Math.max(newDiscountedTotal, 0);
      setDiscountedTotal(newDiscountedTotal);
      setTotalAmount(newDiscountedTotal);

      setCouponError('');
      if (response.status === 200 || response.status === 201) {
        setMessageColor('green');
      } else {
        setMessageColor('red');
      }
      const errorMessage = handleError(response?.status);
      console.log('Error applying coupon:', errorMessage);
      setCouponError(errorMessage);
    } catch (err) {
      console.log('Error', err);
    }
  };

  if (cartItems.length === 0 && !success) {
    return navigate('/cart');
  }

  const buttonText = loading ? (
    <CircularProgress size={24} sx={{ color: 'white' }} />
  ) : discount > 0 ? `Pay $${discountedTotal.toFixed(2)}` : `Pay $${total.toFixed(2)}`;

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
                  <Typography variant="body2" color="text.secondary" align="center">
                    Loyalty Discount: {loyaltyDiscount.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total Amount to Pay: ${totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                
                {relatedBooksWithAuthor.length > 0 && (
                  <>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }} >
                      The author of this book also wrote:
                    </Typography>
                    <List>
                      {relatedBooksWithAuthor.map((book) => (
                        <Card key={book._id} sx={{ p: 2, mb: 2 }}>
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              image={book.imageUrl}
                              alt={book.title}
                              sx={{ height: 100 , width: 50 }}
                              onClick={() => navigate(`/books/${book._id}`)}
                            />
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom sx={{ color: '#2C1810' }} onClick={() => navigate(`/books/${book._id}`)}>{book.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ color: '#2C1810' }}>{book.author}</Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      

                      )).slice(0, 3)}
                    </List>
                  </>
                )}

                <Divider sx={{ mb: 2 }} />

                {relatedBooksWithCategory.length > 0 && (
                  <>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
                      Books in the same category:
                    </Typography>
                    <List>
                      {relatedBooksWithCategory.filter(book => !relatedBooksWithAuthor.includes(book)).map((book) => (
                        <Card key={book._id} sx={{ p: 2, mb: 2 }}>
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              image={book.imageUrl}
                              alt={book.title}
                              sx={{ height: 100 , width: 50 }}
                              onClick={() => navigate(`/books/${book._id}`)}
                            />
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom sx={{ color: '#2C1810' }} onClick={() => navigate(`/books/${book._id}`)}>{book.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ color: '#2C1810' }}>{book.author}</Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      )).slice(0, 3)}
                    </List>
                  </>
                )}
                
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
                      primary={<Typography variant="h6">Paiement Summary</Typography>}
                      secondary={
                        <Stack spacing={1}>
                          {discount > 0 && (
                            <Typography variant="body1" color="green">
                              Coupon Discount: -{discount}{discountCaracter}
                            </Typography>
                          )}
                          {loyaltyDiscount > 0 && (
                            <Typography variant="body1" color="green">
                              Loyalty Discount: -{loyaltyDiscount}%
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                    <Typography variant="h6">
                      Total payed: ${totalAmount.toFixed(2)}
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
<Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#2C1810',
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  <CreditCardIcon /> Coupon
                </Typography>

                <TextField
                  label="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
                <Button variant="contained" onClick={handleApplyCoupon} sx={{
                  color: '#8B4513',
                  borderColor: '#8B4513',
                  ml:2,
                  mt:2,
                  '&:hover': {
                    borderColor: '#654321',
                    backgroundColor: 'rgba(139, 70, 19, 0.04)'
                  }
                }}>
                  Apply Coupon
                </Button>
                {couponError && (
                  <Typography color={messageColor} variant="body1">
                    {couponError}
                  </Typography>
                )}
              </Box>

                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Typography variant="h6">
                    Total: ${total.toFixed(2)}
                  </Typography>
                  {discount > 0 && (
                    <Typography variant="h6" color="green">
                      Discount Applied:{discount}{discountCaracter}
                    </Typography>
                    
                  ) && (<Typography variant="h6">Total after Discount: ${discountedTotal.toFixed(2)}</Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#2C1810',
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  <CreditCardIcon /> Payment Details
                </Typography>

                <Stack spacing={3} sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    error={!!paymentErrors.cardNumber}
                    helperText={paymentErrors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    inputProps={{ maxLength: 19 }}
                    sx={textFieldSx}
                  />

                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    name="cardHolder"
                    value={paymentDetails.cardHolder}
                    onChange={handlePaymentChange}
                    error={!!paymentErrors.cardHolder}
                    helperText={paymentErrors.cardHolder}
                    sx={textFieldSx}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Expiry Date"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handlePaymentChange}
                      error={!!paymentErrors.expiryDate}
                      helperText={paymentErrors.expiryDate}
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                      sx={{ ...textFieldSx, width: '50%' }}
                    />

                    <TextField
                      label="CVV"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentChange}
                      error={!!paymentErrors.cvv}
                      helperText={paymentErrors.cvv}
                      type="password"
                      inputProps={{ maxLength: 4 }}
                      sx={{ ...textFieldSx, width: '50%' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <LockIcon sx={{ color: '#8B4513' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

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
                  startIcon={<CreditCardIcon />}
                  sx={{
                    backgroundColor: '#8B4513',
                    '&:hover': { backgroundColor: '#654321' }
                  }}
                >
                  {buttonText}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

const textFieldSx = {
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
};

export default Checkout; 