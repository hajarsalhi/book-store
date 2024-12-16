import React, { useState } from 'react';
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
  Box
} from '@mui/material';

// Sample data - replace with your actual data source
const initialBooks = [
  { id: 1, title: "Book 1", author: "Author 1", price: 19.99, stock: 10 },
  { id: 2, title: "Book 2", author: "Author 2", price: 29.99, stock: 15 },
  { id: 3, title: "Book 3", author: "Author 3", price: 24.99, stock: 5 },
];

function StockManagement() {
  const [books, setBooks] = useState(initialBooks);

  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleEdit = (id) => {
    // Add edit functionality here
    console.log("Edit book with id:", id);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Stock Management</Typography>
      <Button 
        variant="contained" 
        sx={{ mb: 3 }}
        color="primary"
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
                key={book.id}
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
                    onClick={() => handleEdit(book.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(book.id)}
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