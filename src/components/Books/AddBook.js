import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { bookAPI } from '../../services/api';

function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openNewCategory, setOpenNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Fantasy',
    'Biography',
    'History',
    'Children',
    'Science',
    'Technology',
    'Business',
    'Self-Help',
    'Poetry',
    'Drama',
    'Horror'
  ].sort();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookAPI.addBook(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/management');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book');
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setCategoryError('Category name cannot be empty');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      setCategoryError('Category already exists');
      return;
    }

    // Add the new category to the list
    categories.push(newCategory.trim());
    // Set it as the selected category
    setFormData({
      ...formData,
      category: newCategory.trim()
    });
    // Close the dialog
    setOpenNewCategory(false);
    setNewCategory('');
    setCategoryError('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          maxWidth: 600, 
          mx: 'auto',
          backgroundColor: '#FFF8DC',
          borderRadius: '12px'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4,
            color: '#2C1810',
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Add New Book
        </Typography>

        {success ? (
          <Alert 
            severity="success"
            sx={{ 
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              '& .MuiAlert-icon': {
                color: '#2e7d32'
              }
            }}
          >
            Book added successfully! Redirecting...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <Autocomplete
              freeSolo
              value={formData.category}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  category: newValue || ''
                });
              }}
              inputValue={formData.category}
              onInputChange={(event, newInputValue) => {
                setFormData({
                  ...formData,
                  category: newInputValue
                });
              }}
              options={categories}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  required
                  margin="normal"
                  sx={textFieldSx}
                />
              )}
              sx={{
                '& .MuiAutocomplete-tag': {
                  backgroundColor: 'rgba(139, 69, 19, 0.08)',
                  color: '#8B4513',
                }
              }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />

            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2,
                  textAlign: 'center',
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  padding: '8px',
                  borderRadius: '4px'
                }}
              >
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/management')}
                sx={{
                  color: '#8B4513',
                  borderColor: '#8B4513',
                  '&:hover': {
                    borderColor: '#654321',
                    backgroundColor: 'rgba(139, 69, 19, 0.04)',
                  },
                  height: '48px'
                }}
              >
                Cancel
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                type="submit"
                sx={{ 
                  backgroundColor: '#8B4513',
                  '&:hover': {
                    backgroundColor: '#654321',
                  },
                  height: '48px',
                  fontSize: '1.1rem'
                }}
              >
                Add Book
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}

export default AddBook;