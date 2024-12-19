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
  Divider,
  Alert
} from '@mui/material';
import { bookAPI } from '../../services/api';

const ReviewSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const response = await bookAPI.getBookReviews(bookId);
      setReviews(response.data);
    } catch (error) {
      setError('Error fetching reviews');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!user) {
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
      fetchReviews();
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
        Reviews
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {user && (
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

      <Stack spacing={2}>
        {reviews.map((review) => (
          <Card key={review._id} sx={{ backgroundColor: '#FFF8DC' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
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
              <Typography variant="body2" color="text.secondary">
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ReviewSection; 