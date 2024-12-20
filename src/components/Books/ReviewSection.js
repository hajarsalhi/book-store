import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { bookAPI } from '../../services/api';

const ReviewSection = ({ bookId, onReviewsChange }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedReview, setEditedReview] = useState({ rating: 0, comment: '' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Current user:', parsedUser); // Debug log
      setCurrentUser(parsedUser);
    }
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const response = await bookAPI.getBookReviews(bookId);
      console.log('Fetched reviews:', response.data); // Debug log
      if (Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        setError('Invalid review data format');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!currentUser) {
        setError('Please login to submit a review');
        return;
      }

      if (userReview.rating === 0) {
        setError('Please select a rating');
        return;
      }

      await bookAPI.addBookReview(bookId, userReview);
      setSuccess('Review submitted successfully');
      setUserReview({ rating: 0, comment: '' });
      await fetchReviews();
      if (onReviewsChange) onReviewsChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review');
    }
  };

  // Review menu handlers
  const handleReviewMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleReviewMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  // Edit handlers
  const handleEditClick = () => {
    console.log('Selected review for edit:', selectedReview);
    setEditingReviewId(selectedReview._id);
    setEditedReview({
      rating: selectedReview.rating,
      comment: selectedReview.comment
    });
    setIsEditDialogOpen(true);
    handleReviewMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      console.log('Editing review:', {
        bookId,
        reviewId: editingReviewId,
        editedData: editedReview
      });

      await bookAPI.updateBookReview(
        bookId,
        editingReviewId,
        {
          rating: editedReview.rating,
          comment: editedReview.comment
        }
      );

      setSuccess('Review updated successfully');
      setIsEditDialogOpen(false);
      setEditingReviewId(null);
      await fetchReviews();
      if (onReviewsChange) onReviewsChange();
    } catch (error) {
      console.error('Error updating review:', error);
      setError(error.response?.data?.message || 'Error updating review');
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingReviewId(null);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    console.log('Selected review for delete:', selectedReview);
    setDeletingReviewId(selectedReview._id);
    setIsDeleteDialogOpen(true);
    handleReviewMenuClose();
  };

  const handleDeleteReview = async () => {
    try {
      console.log('Deleting review:', {
        bookId,
        reviewId: deletingReviewId
      });

      await bookAPI.deleteBookReview(bookId, deletingReviewId);
      setSuccess('Review deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingReviewId(null);
      await fetchReviews();
      if (onReviewsChange) onReviewsChange();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError(error.response?.data?.message || 'Error deleting review');
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingReviewId(null);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
          Reviews ({reviews.length})
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Write Review Section */}
        {currentUser && !reviews.find(review => 
          (currentUser._id && review.user.toString() === currentUser._id.toString()) ||
          (currentUser.id && review.user.toString() === currentUser.id.toString())
        ) && (
          <Card sx={{ mb: 3, backgroundColor: '#FFF8DC' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Write a Review
              </Typography>
              <form onSubmit={handleSubmitReview}>
                <Stack spacing={2}>
                  <Box>
                    <Typography component="legend">Your Rating</Typography>
                    <Rating
                      value={userReview.rating}
                      onChange={(e, newValue) => {
                        setUserReview(prev => ({ ...prev, rating: newValue }));
                      }}
                      sx={{ color: '#8B4513' }}
                    />
                  </Box>
                  <TextField
                    multiline
                    rows={4}
                    placeholder="Share your thoughts about this book..."
                    value={userReview.comment}
                    onChange={(e) => {
                      setUserReview(prev => ({ ...prev, comment: e.target.value }));
                    }}
                    sx={{
                      backgroundColor: '#FFF',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#8B4513',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#8B4513',
                      '&:hover': {
                        backgroundColor: '#654321',
                      },
                    }}
                  >
                    Submit Review
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Card key={review._id} sx={{ backgroundColor: '#FFF8DC' }}>
              <CardContent>
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="flex-start"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#8B4513' }}>
                      {review.userName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {review.userName}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        sx={{ color: '#8B4513' }}
                      />
                    </Box>
                  </Stack>
                  
                  {currentUser && review.user && (
                    currentUser._id === review.user || 
                    currentUser.id === review.user
                  ) && (
                    <IconButton 
                      onClick={(e) => {
                        console.log('Review clicked:', review);
                        handleReviewMenuClick(e, review);
                      }}
                      size="small"
                      sx={{ 
                        color: '#8B4513',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 69, 19, 0.1)',
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 2, mb: 1 }}
                >
                  {review.comment}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                >
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Move Menu outside Box but inside Stack */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleReviewMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            backgroundColor: '#FFF8DC',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(139, 69, 19, 0.08)'
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#8B4513' }} />
          </ListItemIcon>
          <Typography sx={{ color: '#8B4513' }}>Edit Review</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
          </ListItemIcon>
          <Typography sx={{ color: '#d32f2f' }}>Delete Review</Typography>
        </MenuItem>
      </Menu>

      {/* Move Dialogs outside Box but inside Stack */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#FFF8DC',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2C1810' }}>Edit Review</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={editedReview.rating}
                onChange={(e, newValue) => {
                  setEditedReview(prev => ({ ...prev, rating: newValue }));
                }}
                sx={{ color: '#8B4513' }}
              />
            </Box>
            <TextField
              multiline
              rows={4}
              value={editedReview.comment}
              onChange={(e) => {
                setEditedReview(prev => ({ ...prev, comment: e.target.value }));
              }}
              sx={{
                backgroundColor: '#FFF',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#8B4513',
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit}
            sx={{
              color: '#8B4513',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#FFF8DC',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ color: '#2C1810' }}>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteReview}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ReviewSection; 