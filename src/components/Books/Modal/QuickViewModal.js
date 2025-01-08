import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Grid,
  Stack,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useLocation } from 'react-router-dom';

const QuickViewModal = ({ book, open, onClose }) => {
  const navigate = useNavigate();   
  const location = useLocation();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!user;

  if (!book) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="quick-view-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '70%' },
        maxWidth: 800,
        bgcolor: '#FFF8DC',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#8B4513'
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={3}>
          {/* Book Image */}
          <Grid item xs={12} sm={4}>
            <Box
              component="img"
              src={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
              alt={book.title}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: 1
              }}
            />
          </Grid>

          {/* Book Details */}
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" component="h2" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                color: '#2C1810',
                mb: 2
              }}
            >
              {book.title}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Rating value={book.averageRating || 0} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({book.totalRatings || 0} ratings)
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {book.description?.slice(0, 300)}
              {book.description?.length > 300 ? '...' : ''}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                ${book.price?.toFixed(2)}
              </Typography>
              {book.priceHistory?.length > 1 && (
                <Typography
                  variant="body2"
                  sx={{ color: 'red', textDecoration: 'line-through' }}
                >
                  ${book.priceHistory[book.priceHistory.length - 1].price.toFixed(2)}
                </Typography>
              )}
              <Typography variant="body2" color={book.stock > 0 ? 'success.main' : 'error.main'}>
                {book.stock > 0 ? `In Stock: ${book.stock}` : 'Out of Stock'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login', { state: { from: location.pathname } });
                    return;
                  }
                  if (wishlist.find(item => item._id === book._id)) {
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
                {!isLoggedIn ? 'Login to Add to Wishlist' : 
                  (Array.isArray(wishlist) && wishlist.find(item => item._id === book._id) ? 
                    'Remove from Wishlist' : 'Add to Wishlist')}
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login', { state: { from: location.pathname } });
                    return;
                  }
                  navigate(`/books/add-to-cart/${book._id}`);
                  onClose();
                }}
                sx={{
                  backgroundColor: '#8B4513',
                  '&:hover': { backgroundColor: '#654321' }
                }}
              >
                {!isLoggedIn ? 'Login to Add to Cart' : 'Add to Cart'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  navigate(`/books/${book._id}`);
                  onClose();
                }}
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
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default QuickViewModal;