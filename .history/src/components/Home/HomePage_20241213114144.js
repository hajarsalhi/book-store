import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Browse Books",
      description: "Explore our vast collection of books across various genres",
      image: "https://source.unsplash.com/random/400x200/?books",
      link: "/"
    },
    {
      title: "Manage Inventory",
      description: "Access our inventory management system",
      image: "https://source.unsplash.com/random/400x200/?library",
      link: "/management"
    },
    {
      title: "Special Offers",
      description: "Check out our latest deals and promotions",
      image: "https://source.unsplash.com/random/400x200/?bookstore",
      link: "/"
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to BookStore
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
            Your one-stop destination for all your reading needs
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/')}
          >
            Browse Books
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(feature.link)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* About Section */}
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h3" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We are passionate about bringing the best books to our readers. 
            With a carefully curated collection and exceptional service, 
            we strive to make every reading experience memorable.
          </Typography>
          <Button variant="contained" color="primary">
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage; 