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
  Alert
} from '@mui/material';

function StockManagement() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Stock Management</Typography>
      <Button 
        variant="contained" 
        sx={{ mb: 3 }}
        color="primary"
        onClick={() => navigate('/management/add-book')}
      >
        Add New Book
      </Button>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="stock management table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow 
                key={book._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {book.title}
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.price.toFixed(2)}</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell align="center">
                  <Button 
                    size="small" 
                    sx={{ mr: 1 }}
                    variant="outlined"
                    onClick={() => handleEdit(book._id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(book._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StockManagement;