import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { userAPI } from '../../services/api';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await userAPI.signup(formData);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    }
  };

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

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: '#FFF8E7'
    }}>
      <Box
        onClick={() => navigate('/')}
        sx={{ 
          position: 'absolute',
          top: 20,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(139, 69, 19, 0.08)'
          }
        }}
      >
        <AutoStoriesIcon 
          sx={{ 
            fontSize: 32, 
            color: '#8B4513'
          }} 
        />
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#8B4513',
            fontWeight: 600
          }}
        >
          BookStore
        </Typography>
      </Box>

      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%',
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
          Create Account
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
            Registration successful! Redirecting to login...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
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
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              sx={{ 
                mt: 4,
                mb: 2,
                backgroundColor: '#8B4513',
                '&:hover': {
                  backgroundColor: '#654321',
                },
                height: '48px',
                fontSize: '1.1rem'
              }}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
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
              Already have an account? Login
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default SignUp;
