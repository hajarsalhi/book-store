import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../store/userSlice';
import BarChartIcon from '@mui/icons-material/BarChart';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector(state => state.user);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate('/', { replace: true });
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#2C1810',
        color: '#DEB887',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer' 
            }} 
            onClick={() => navigate('/')}
          >
            <MenuBookIcon sx={{ color: '#DEB887', mr: 1 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#DEB887',
                fontFamily: '"Playfair Display", serif',
              }}
            >
              BookStore
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              sx={{ 
                color: '#DEB887',
                display: isMobile ? 'none' : 'block',
                '&:hover': {
                  color: '#F5DEB3'
                }
              }} 
              onClick={() => navigate('/books')}
            >
              Books
            </Button>
            
            {user?.isAdmin && (
              <>
                <Button
                  sx={{ color: '#DEB887' }}
                  onClick={() => navigate('/management')}
                >
                  Management
                </Button>
                <Button
                  sx={{ 
                    color: '#DEB887',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                  onClick={() => navigate('/admin/analytics')}
                >
                  <BarChartIcon />
                  Analytics
                </Button>
              </>
            )}

            {user ? (
              <>
                <IconButton 
                  onClick={() => navigate('/cart')} 
                  sx={{ color: '#DEB887' }}
                >
                  <Badge badgeContent={cartItems.length} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <Button 
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    color: '#DEB887',
                    borderColor: '#DEB887',
                    '&:hover': {
                      borderColor: '#F5DEB3',
                      color: '#F5DEB3',
                      backgroundColor: 'rgba(222, 184, 135, 0.1)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    backgroundColor: '#DEB887',
                    color: '#2C1810',
                    '&:hover': {
                      backgroundColor: '#F5DEB3'
                    }
                  }}
                >
                  Login
                </Button>

                <Button 
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    backgroundColor: '#DEB887',
                    color: '#2C1810',
                    '&:hover': {
                      backgroundColor: '#F5DEB3'
                    }
                  }}
                >
                  Signup
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 