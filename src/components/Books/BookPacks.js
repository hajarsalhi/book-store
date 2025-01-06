import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Checkbox, CardMedia, Alert } from '@mui/material';
import { useCart } from '../../context/CartContext';
import useBookPacks from '../../hooks/useBookPacks';

const BookPacks = () => {
  const { lastAddedBookCategory, addToCart } = useCart();
  const { packs, loading, error } = useBookPacks(lastAddedBookCategory);
  const [selectedBooks, setSelectedBooks] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleAddAllToCart = () => {
    let foundError = false;
    Object.keys(selectedBooks).forEach((bookId) => {
      if (selectedBooks[bookId]) {
        const pack = packs.length > 0 ? packs[0] : null;
        if (pack) {
          const book = pack.books.find((b) => b._id === bookId);
          if (book) {
            console.log(`Adding to cart: ${book.title}`);
            addToCart(bookId, 1, lastAddedBookCategory, book);
          } else {
            console.warn(`Book with ID ${bookId} is not part of the selected pack.`);
            foundError = true;
          }
        }
      }
    });

    if (foundError) {
      setErrorMessage('Some selected books are not part of the current pack.');
    } else {
      setErrorMessage('');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const pack = packs.length > 0 ? packs[0] : null;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom color='#2C1810'>
        Frequently Bought Together
      </Typography>
      {pack ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">{pack.description}</Typography>
                <Typography variant="body2">Books in this {pack.name} pack:</Typography>
                <Box display="flex" alignItems="center">
                  {Array.isArray(pack.books) && pack.books.length > 0 ? (
                    pack.books.map((book) => (
                      <Grid item xs={12} sm={6} md={4} ml={2} key={book._id}>
                        <Card sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                          <CardMedia
                            component="img"
                            height="150"
                            image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
                            alt={book.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Checkbox
                              size='small'
                              checked={!!selectedBooks[book._id]}
                              onChange={() => handleSelectBook(book._id)}
                            />
                            <Typography variant="h6">{book.title}</Typography>
                            <Typography variant="subtitle1">{book.author}</Typography>
                            <Typography variant="body2">{book.description}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography>No books available in this pack.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography>No packs available.</Typography>
      )}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddAllToCart} 
        sx={{ 
          backgroundColor: '#8B4513',
          mt: 2,
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          '&:hover': { backgroundColor: '#654321' }
        }}
      >
        Add Selected to Cart
      </Button>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default BookPacks;
