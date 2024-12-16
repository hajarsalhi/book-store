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
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      link: "/"
    },
    {
      title: "Manage Inventory",
      description: "Access our inventory management system",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80",
      link: "/management"
    },
    {
      title: "Special Offers",
      description: "Check out our latest deals and promotions",
      image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=829&q=80",
      link: "/"
    }
  ];

  const featuredBooks = [
    {
      id: 1,
      title: "The Great Adventure",
      author: "John Doe",
      image: "https://source.unsplash.com/random/200x300/?book",
      price: 29.99
    },
    {
      id: 2,
      title: "Mystery of the Ages",
      author: "Jane Smith",
      image: "https://source.unsplash.com/random/200x300/?novel",
      price: 24.99
    },
    {
      id: 3,
      title: "Future World",
      author: "Mike Johnson",
      image: "https://source.unsplash.com/random/200x300/?reading",
      price: 19.99
    },
    {
      id: 4,
      title: "The Hidden Path",
      author: "Sarah Williams",
      image: "https://source.unsplash.com/random/200x300/?literature",
      price: 34.99
    }
  ];

  return (
    <Box>
      {/* Hero Section with Background Image */}
      <Box 
        sx={{ 
          height: '70vh',
          position: 'relative',
          backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?library)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
          }
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to BookStore
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
            Your one-stop destination for all your reading needs
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/store')}
          >
            Browse Books
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
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

        {/* Featured Books Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
            Featured Books
          </Typography>
          <Grid container spacing={4}>
            {featuredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={3} key={book.id}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={book.image}
                    alt={book.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.author}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${book.price}
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage; 