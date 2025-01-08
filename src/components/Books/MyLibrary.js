import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { libraryAPI } from '../../services/api';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const MyLibrary = () => {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    fetchPurchasedBooks();
  }, []);

  const fetchPurchasedBooks = async () => {
    try {
      const response = await libraryAPI.getPurchasedBooks();
      setPurchasedBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching your library books');
      setLoading(false);
    }
  };

  const handleRemoveFromLibrary = async (bookId) => {
    try {
      const response = await libraryAPI.removeFromLibrary(bookId);
      if (response.status === 200) {
        setPurchasedBooks(books => books.filter(book => book.bookId._id !== bookId));
      } else {
        setError('Failed to remove book from library');
      }
    } catch (err) {
      console.error('Error removing book:', err);
      setError('Error removing book from library');
    }
  };

  const handleReadingStatusChange = async (bookId, currentStatus) => {
    const newStatus = currentStatus === 'not-started' ? 'reading' : 
                     currentStatus === 'reading' ? 'completed' : 'not-started';
                     
    try {
      await libraryAPI.updateReadingStatus(bookId, newStatus);
      setPurchasedBooks(books => 
        books.map(book => 
          book.bookId._id === bookId ? { ...book, readingStatus: newStatus } : book
        )
      );
    } catch (err) {
      setError('Error updating reading status');
    }
  };

  const handleSaveNote = async () => {
    try {
      await libraryAPI.saveBookNotes(selectedBook.bookId._id, currentNote);
      setPurchasedBooks(books => 
        books.map(book => 
          book._id === selectedBook._id ? { ...book, notes: currentNote } : book
        )
      );
      setNoteDialogOpen(false);
    } catch (err) {
      setError('Error saving note');
    }
  };

  const openNoteDialog = (book) => {
    setSelectedBook(book);
    setCurrentNote(book.notes || '');
    setNoteDialogOpen(true);
  };

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 0: // All Books
        return purchasedBooks;
      case 1: // Currently Reading
        return purchasedBooks.filter(book => book.readingStatus === 'reading');
      case 2: // With Notes
        return purchasedBooks.filter(book => book.notes && book.notes.trim().length > 0);
      default:
        return purchasedBooks;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontFamily: '"Playfair Display", serif',
            color: '#2C1810'
          }}
        >
          <LocalLibraryIcon sx={{ fontSize: 40 }} />
          My Library
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: '#8B4513',
              '&.Mui-selected': {
                color: '#2C1810'
              }
            }
          }}
        >
          <Tab label="All Books" />
          <Tab label="Currently Reading" />
          <Tab label="With Notes" />
        </Tabs>
      </Box>

      <Grid container spacing={4}>
        {getFilteredBooks().map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF8DC',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={item.bookId.imageUrl}
                alt={item.bookId.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <CardActions>
                  <IconButton 
                    onClick={() => handleRemoveFromLibrary(item.bookId._id)}
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: '#8B4513',
                      '&:hover': {
                        color: '#654321'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontFamily: '"Playfair Display", serif',
                    color: '#2C1810'
                  }}
                >
                  {item.bookId.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {item.bookId.author}
                </Typography>

                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<MenuBookIcon />}
                    onClick={() => handleReadingStatusChange(item.bookId._id, item.readingStatus)}
                    sx={{
                      backgroundColor: item.readingStatus === 'reading' ? '#2C1810' : '#8B4513',
                      '&:hover': { backgroundColor: '#654321' }
                    }}
                  >
                    {item.readingStatus === 'not-started' ? 'Start Reading' :
                     item.readingStatus === 'reading' ? 'Mark as Completed' :
                     'Start New Reading'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EditNoteIcon />}
                    onClick={() => openNoteDialog(item)}
                    sx={{ 
                      color: '#8B4513',
                      borderColor: '#8B4513',
                      '&:hover': {
                        borderColor: '#654321',
                        backgroundColor: 'rgba(139, 69, 19, 0.04)'
                      }
                    }}
                  >
                    {item.notes ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Notes Dialog */}
      <Dialog 
        open={noteDialogOpen} 
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#FFF8DC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Notes for {selectedBook?.bookId?.title}</Typography>
          <IconButton onClick={() => setNoteDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#FFF8DC', pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Write your notes here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#8B4513' },
                '&:hover fieldset': { borderColor: '#654321' },
                '&.Mui-focused fieldset': { borderColor: '#8B4513' }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#FFF8DC', p: 2 }}>
          <Button 
            onClick={() => setNoteDialogOpen(false)}
            sx={{ color: '#8B4513' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNote}
            variant="contained"
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': { backgroundColor: '#654321' }
            }}
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyLibrary;
