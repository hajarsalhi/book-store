import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: '#FFF8DC'  // Matching our theme's background
      }}
    >
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          pt: 3,  // Add some padding top
          pb: 6   // Add some padding bottom
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 