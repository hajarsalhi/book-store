import { Box, Paper, TextField, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { userAPI } from '../../services/api';
import { useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookIcon from '@mui/icons-material/Book';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(setUser(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Box 
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#FFF8E7'
      }}
    >
      {/* Bookstore Logo */}
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
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
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
            }}
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
            sx={{
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
            }}
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
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/signup')}
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
            Create Account
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login; 