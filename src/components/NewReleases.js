import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import { bookAPI } from '../services/api';

const NewReleases = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await bookAPI.getNewReleases();
        const filteredBooks = response.data.slice(0, 4);
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
      <Typography variant="h4" gutterBottom>
        New Releases
      </Typography>
      <Grid container spacing={2}>
        {newReleases.map((book) => (
          <Grid item xs={12} sm={6} md={3} key={book._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{book.title}</Typography>
                <Typography variant="body2">{book.author}</Typography>
                <Button variant="contained" color="primary" onClick={() => {/* Add to cart logic */}}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewReleases;
