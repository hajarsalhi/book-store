import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card,CardMedia, CardContent, Button, Divider,Link} from '@mui/material';
import { bookAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const NewReleases = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;


  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await bookAPI.getNewReleases();
        const sortedBooks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredBooks = sortedBooks.slice(0, 4);
        setNewReleases(filteredBooks);
      } catch (err) {
        setError('Error fetching new releases: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        textAlign: 'center',
        fontFamily: '"Playfair Display", serif',
        color: '#2C1810'
      }}>
        New Releases
      </Typography>
      <Divider sx={{ 
            width: '60px', 
            margin: '0 auto', 
            borderColor: '#8B4513',
            borderWidth: 2,
            mb: 4
          }} />
      <Grid container spacing={2}>
        {newReleases.map((book) => (
          <Grid item xs={12} sm={6} md={3} key={book._id}>
            <Card sx={{ 
            
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'scale(1.05)' },
            border: '1px solid #DEB887',
            borderRadius: '8px',
            boxShadow: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            
          }}>
              <CardMedia
                component="img"
                height="200"
                image={book.imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'}
                alt={book.title}
                sx={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
              <Link 
                  to={`/books/${book._id}`} 
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontFamily: '"Playfair Display", serif',
                      color: '#2C1810',
                      '&:hover': {
                        color: '#8B4513'
                      }
                    }}
                  >
                    {book.title}
                  </Typography>
                </Link>
                
                <Typography variant="body2">{book.author}</Typography>
                {!isAdmin && book.stock > 0 && (
                  <Button 
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#8B4513',
                      '&:hover': { backgroundColor: '#654321' }
                    }}
                    onClick={() => navigate(`/books/add-to-cart/${book._id}`)}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewReleases;
