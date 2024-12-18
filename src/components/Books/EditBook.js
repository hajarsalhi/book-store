import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { bookAPI } from '../../services/api';

const categories = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Thriller', 'Romance', 'Horror', 'Biography', 'History',
  'Philosophy', 'Poetry', 'Drama', 'Children', 'Young Adult',
  'Self-Help', 'Business', 'Technology', 'Science', 'Art',
  'Travel', 'Health', 'Cooking', 'Religion', 'Sports',
  'Post-Apocalyptic', 'Dystopian', 'Other'
];

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    console.log('Fetching book with ID:', id);
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookAPI.getBookById(id);
      console.log('Fetched book data:', response.data);
      const book = response.data;
      setBookData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price || '',
        stock: book.stock || '',
        category: book.category || 'Other',
        imageUrl: book.imageUrl || ''
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Error fetching book details: ' + err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookAPI.updateBook(id, bookData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/management');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating book');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
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
              onClick={() => navigate('/management')}
              sx={{ mr: 2, color: '#8B4513' }}
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
              Edit Book
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Book updated successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={bookData.category}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={bookData.price}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{ inputProps: { min: 0, step: "0.01" } }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={bookData.stock}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={bookData.imageUrl}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/management')}
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
                type="submit" 
                variant="contained"
                sx={{
                  backgroundColor: '#8B4513',
                  '&:hover': {
                    backgroundColor: '#654321'
                  }
                }}
              >
                Update Book
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default EditBook; 