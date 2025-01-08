import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Tooltip,
  Container,
  TextField,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';

function StockManagement() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('Error loading books: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [location.pathname]);



  
  // Only show the table if we're on the main management page
  if (location.pathname !== '/management') {
    return <Outlet />;
  }

  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add any auth headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete book');
        }

        // Refresh the books list after successful deletion
        fetchBooks();
      } catch (err) {
        setError('Error deleting book: ' + err.message);
      }
    }
  };

  const handleEdit = (id) => {
    // Add edit functionality here
    navigate(`/management/edit/${id}`);
    console.log("Edit book with id:", id);
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      // Refresh the books list after adding
      fetchBooks();
    } catch (err) {
      setError('Error adding book: ' + err.message);
    }
  };

  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        py: 4,
        backgroundColor: '#FFF8DC',
        minHeight: '100vh'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalLibraryIcon sx={{ fontSize: 40, color: '#8B4513' }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                color: '#2C1810',
                fontWeight: 600
              }}
            >
              Stock Management
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/management/add-book')}
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': {
                backgroundColor: '#654321',
              },
              borderRadius: '8px',
              px: 3
            }}
          >
            Add New Book
          </Button>
          <Button 
            variant="contained" 
            startIcon={<UploadIcon />}
            onClick= {() => navigate('/management/bulk-upload')}
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': {
                backgroundColor: '#654321',
              },
              borderRadius: '8px',
              px: 3
            }}
          >
            Bulk Upload
          </Button>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 3, 
            width: '100%', 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#FFF',
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
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8B4513' }} />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress sx={{ color: '#8B4513' }} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '8px',
              backgroundColor: '#FFF0F0'
            }}
          >
            {error}
          </Alert>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#2C1810' }}>
                  <TableCell sx={{ color: '#FFF8DC', fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ color: '#FFF8DC', fontWeight: 600 }}>Author</TableCell>
                  <TableCell sx={{ color: '#FFF8DC', fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ color: '#FFF8DC', fontWeight: 600 }}>Price ($)</TableCell>
                  <TableCell sx={{ color: '#FFF8DC', fontWeight: 600 }}>Stock</TableCell>
                  <TableCell align="center" sx={{ color: '#FFF8DC', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow 
                    key={book._id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: '#FFF8DC',
                        transition: 'background-color 0.3s'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {book.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Chip 
                        label={book.category || 'Other'} 
                        size="small"
                        sx={{ 
                          backgroundColor: '#DEB887',
                          color: '#2C1810'
                        }}
                      />
                    </TableCell>
                    <TableCell>${book.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={book.stock}
                        size="small"
                        color={book.stock > 10 ? "success" : book.stock > 0 ? "warning" : "error"}
                        sx={{ minWidth: '60px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Book">
                          <IconButton 
                            onClick={() => handleEdit(book._id)}
                            sx={{ 
                              color: '#8B4513',
                              '&:hover': { backgroundColor: '#FFF0DC' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Book">
                          <IconButton 
                            onClick={() => handleDelete(book._id)}
                            sx={{ 
                              color: '#CD5C5C',
                              '&:hover': { backgroundColor: '#FFF0F0' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default StockManagement;