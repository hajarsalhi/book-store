import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { commandAPI } from '../../services/api';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await commandAPI.getUserCommands();
      setOrders(response.data);
    } catch (err) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', backgroundColor: '#FFF8DC' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{
              fontFamily: '"Playfair Display", serif',
              color: '#2C1810'
            }}>
              Order History
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/books')}
              sx={{
                color: '#8B4513',
                borderColor: '#8B4513',
                '&:hover': {
                  borderColor: '#654321',
                  backgroundColor: 'rgba(139, 69, 19, 0.04)'
                }
              }}
            >
              Continue Shopping
            </Button>
          </Box>

          {orders.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No orders found
            </Typography>
          ) : (
            <List>
              {orders.map((order, index) => (
                <Accordion 
                  key={order._id}
                  sx={{ 
                    mb: 2,
                    backgroundColor: 'transparent',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      backgroundColor: 'rgba(139, 69, 19, 0.05)',
                      borderRadius: '8px'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      pr: 2
                    }}>
                      <Box>
                        <Typography variant="subtitle1">
                          Order #{order._id.slice(-6)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip 
                          label={order.status}
                          color={order.status === 'completed' ? 'success' : 'default'}
                          size="small"
                        />
                        <Typography variant="h6">
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {order.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ px: 0 }}>
                          <ListItemText
                            primary={item.book.title}
                            secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                          />
                          <Typography>
                            ${(item.quantity * item.price).toFixed(2)}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default OrderHistory; 