import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: '#5D4037' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BookStore
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>Store</Button>
          <Button color="inherit" onClick={() => navigate('/management')}>Management</Button>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 