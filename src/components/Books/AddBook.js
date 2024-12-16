import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert
} from '@mui/material';
import { bookAPI } from '../../services/api';

const AddBook = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    image: ''
  });

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
      await bookAPI.addBook(bookData);
      navigate('/management'); // Navigate back to management page after success
    } catch (err) {
      setError(err.message || 'Failed to add book');
    }
  };

  return (
    
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Book
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            label="Title"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            label="Author"
            name="author"
            value={bookData.author}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            value={bookData.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            label="Price"
            name="price"
            type="number"
            value={bookData.price}
            onChange={handleChange}
            fullWidth
            inputProps={{ step: "0.01" }}
          />
          <TextField
            required
            label="Stock"
            name="stock"
            type="number"
            value={bookData.stock}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Image URL"
            name="image"
            value={bookData.image}
            onChange={handleChange}
            fullWidth
          />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/management')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Add Book
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddBook;