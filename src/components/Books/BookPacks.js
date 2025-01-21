import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Checkbox, CardMedia, Alert, Stack, Divider, Chip, Popover } from '@mui/material';
import { useCart } from '../../context/CartContext';
import useBookPacks from '../../hooks/useBookPacks';
import { Fade } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const BookPacks = () => {
  const { lastAddedBookCategory, addToCart } = useCart();
  const { packs, loading, error } = useBookPacks(lastAddedBookCategory);
  const [selectedBooks, setSelectedBooks] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredBook, setHoveredBook] = useState(null);

  const handleSelectBook = (bookId) => {
    setSelectedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleAddAllToCart = (books) => {
    let foundError = false;
    
    books.forEach((book) => {
      addToCart(book._id, 1, lastAddedBookCategory, book);
    });

    if (foundError) {
      setErrorMessage('Some selected books are not part of the current pack.');
    } else {
      setErrorMessage('');
    }
  };

  const handlePopoverOpen = (event, book) => {
    setAnchorEl(event.currentTarget);
    setHoveredBook(book);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setHoveredBook(null);
  };

  const open = Boolean(anchorEl);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {packs?.map((pack) => (
        <Fade in={true} key={pack._id}>
          <Card 
            elevation={3}
            sx={{ 
              mb: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              overflow: 'visible',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: -10,
                right: 20,
                backgroundColor: '#8B4513',
                color: '#FFF',
                py: 0.5,
                px: 2,
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                zIndex: 1
              }}
            >
              <Typography variant="subtitle2">SPECIAL OFFER</Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Pack Title and Description */}
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#2C1810',
                      fontWeight: 600,
                      mb: 1,
                      fontFamily: '"Playfair Display", serif'
                    }}
                  >
                    {pack.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontStyle: 'italic'
                    }}
                  >
                    {pack.description}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: '#DEB887' }} />

                {/* Books Display */}
                <Grid container spacing={2} alignItems="stretch">
                  {pack.books?.map((book, index) => (
                    <Grid item xs={12} sm={4} key={book._id}>
                      <Box
                        onMouseEnter={(e) => handlePopoverOpen(e, book)}
                        onMouseLeave={handlePopoverClose}
                        sx={{
                          position: 'relative',
                          height: '100%',
                          p: 1.5,
                          backgroundColor: '#FDF5E6',
                          borderRadius: 1,
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={book.imageUrl}
                          alt={book.title}
                          sx={{ 
                            height: 160,
                            objectFit: 'contain',
                            mb: 1,
                            borderRadius: 1
                          }}
                        />
                        <Typography 
                          variant="subtitle2"
                          align="center"
                          sx={{
                            color: '#2C1810',
                            fontWeight: 600,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {book.title}
                        </Typography>
                        <Typography 
                          variant="caption"
                          align="center"
                          display="block"
                          sx={{ color: '#666' }}
                        >
                          by {book.author}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Action Section */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    backgroundColor: '#FDF5E6',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#8B4513',
                          fontWeight: 700,
                          lineHeight: 1
                        }}
                      >
                        ${pack.books.reduce((sum, book) => sum + book.price, 0)}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#666',
                          textDecoration: 'line-through'
                        }}
                      >
                        ${(pack.price * 1.2).toFixed(2)}
                      </Typography>
                    </Box>
                    
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddAllToCart(pack.books)}
                    sx={{
                      backgroundColor: '#8B4513',
                      ml: 2,
                      '&:hover': { 
                        backgroundColor: '#654321',
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s ease'
                      },
                      boxShadow: '0 2px 4px rgba(139, 69, 19, 0.2)',
                      px: 3
                    }}
                  >
                    Add Pack to Cart
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      ))}

      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {hoveredBook && (
          <Box sx={{ p: 2, maxWidth: 300, backgroundColor: '#FFF' }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#2C1810' }}>
              {hoveredBook.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
              by {hoveredBook.author}
            </Typography>
            {hoveredBook.description && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {hoveredBook.description}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: '#8B4513', fontWeight: 600 }}>
              Price: ${hoveredBook.price}
            </Typography>
          </Box>
        )}
      </Popover>
    </Box>
  );
};

export default BookPacks;
