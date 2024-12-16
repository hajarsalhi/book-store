import { Grid, Card, CardContent, Typography } from '@mui/material';

function StorePage() {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>Book Store</Typography>
      <Grid container spacing={3}>
        {/* Example book cards */}
        {[1, 2, 3, 4].map((book) => (
          <Grid item xs={12} sm={6} md={3} key={book}>
            <Card>
              <CardContent>
                <Typography variant="h6">Book Title {book}</Typography>
                <Typography color="textSecondary">Author Name</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Price: $19.99
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default StorePage;