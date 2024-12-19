import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import { adminAPI } from '../../../services/api';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const COLORS = ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'];

// Add custom legend styles
const legendStyle = {
  color: '#2C1810',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
};

// Add custom colors with labels for pie chart
const CATEGORY_COLORS = [
  { name: 'Fiction', color: '#2E86AB' },      // Blue
  { name: 'Non-Fiction', color: '#A23B72' },  // Purple
  { name: 'Science', color: '#F18F01' },      // Orange
  { name: 'History', color: '#C73E1D' },      // Red
  { name: 'Other', color: '#3B7A57' }         // Green
];

// Add custom tooltip components
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: '#FFF8DC',
        border: '1px solid #8B4513',
        p: 1.5,
        minWidth: 150
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#2C1810', mb: 1 }}>
        {label}
      </Typography>
      {payload.map((entry, index) => (
        <Box 
          key={index} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 0.5 
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              backgroundColor: entry.color,
              borderRadius: '50%'
            }}
          />
          <Typography variant="body2">
            {entry.name}: {entry.name === 'Revenue' ? `$${entry.value.toFixed(2)}` : entry.value}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  
  const data = payload[0];
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: '#FFF8DC',
        border: '1px solid #8B4513',
        p: 1.5,
        minWidth: 150
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#2C1810', mb: 1 }}>
        {data.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">Revenue:</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#8B4513' }}>
          ${data.value.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">Share:</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#8B4513' }}>
          {(data.percent * 100).toFixed(1)}%
        </Typography>
      </Box>
    </Paper>
  );
};

function SalesAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    monthlySales: [],
    topSellingBooks: [],
    categorySales: []
  });
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  const theme = useTheme();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', user);
    if (!user || !user.isAdmin) {
      setError('Unauthorized: Admin access required');
      setLoading(false);
      return;
    }
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching sales data for timeRange:', timeRange);
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const response = await adminAPI.getSalesAnalytics(timeRange);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      console.log('Received response:', response.data);
      setSalesData(response.data);
    } catch (err) {
      console.error('Error fetching sales data:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      });
      
      let errorMessage = 'Error fetching sales data: ';
      if (err.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out';
      } else if (err.response?.status === 404) {
        errorMessage += 'Analytics endpoint not found';
      } else if (err.response?.status === 401) {
        errorMessage += 'Unauthorized access';
      } else {
        errorMessage += (err.response?.data?.message || err.message);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend }) => (
    <Card 
      elevation={3}
      sx={{ 
        backgroundColor: '#FFF8DC',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          backgroundColor: '#FFF8DC',
          opacity: 0.95
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography color="textSecondary" variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h4" component="div" sx={{ color: '#2C1810', mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            {trend}% vs last period
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Custom legend component for pie chart
  const CustomLegend = ({ payload }) => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1,
        mt: 2
      }}>
        {payload.map((entry, index) => (
          <Box 
            key={`legend-${index}`}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: entry.color,
                borderRadius: '2px'
              }} 
            />
            <Typography variant="body2" sx={legendStyle}>
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#8B4513' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button 
            variant="contained" 
            onClick={() => fetchSalesData()}
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': { backgroundColor: '#654321' }
            }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{
              fontFamily: '"Playfair Display", serif',
              color: '#2C1810',
            }}
          >
            Sales Analytics
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{
                  backgroundColor: '#FFF8DC',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#8B4513',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#654321',
                  },
                }}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={() => fetchSalesData()}
                sx={{ color: '#8B4513' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Revenue"
              value={`$${salesData.totalRevenue.toFixed(2)}`}
              icon={<AttachMoneyIcon sx={{ color: '#8B4513', fontSize: 40 }} />}
              trend={12}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Orders"
              value={salesData.totalOrders}
              icon={<ShoppingCartIcon sx={{ color: '#8B4513', fontSize: 40 }} />}
              trend={8}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Average Order Value"
              value={`$${salesData.averageOrderValue.toFixed(2)}`}
              icon={<TrendingUpIcon sx={{ color: '#8B4513', fontSize: 40 }} />}
              trend={5}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 4, 
                backgroundColor: '#FFF8DC',
                height: 450,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
                Sales Trend
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={salesData.monthlySales}
                  margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#DEB887" 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8B4513"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: '#2C1810' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#8B4513"
                    tick={{ fill: '#2C1810' }}
                    label={{ 
                      value: 'Revenue ($)', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#2C1810'
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#DEB887"
                    tick={{ fill: '#2C1810' }}
                    label={{ 
                      value: 'Orders', 
                      angle: 90, 
                      position: 'insideRight',
                      fill: '#2C1810'
                    }}
                  />
                  <ChartTooltip content={<CustomBarTooltip />} />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={legendStyle}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    fill="#8B4513"
                    stroke="#8B4513"
                    fillOpacity={0.15}
                    name="Revenue"
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#DEB887"
                    strokeWidth={3}
                    name="Orders"
                    dot={{ 
                      fill: '#DEB887', 
                      strokeWidth: 2,
                      r: 4,
                      strokeOpacity: 0.8
                    }}
                    activeDot={{ 
                      r: 8, 
                      fill: '#DEB887',
                      strokeOpacity: 1,
                      strokeWidth: 2
                    }}
                    strokeOpacity={0.9}
                    animationBegin={500}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 4, 
                backgroundColor: '#FFF8DC',
                height: 450,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
                  <Pie
                    data={salesData.categorySales}
                    dataKey="revenue"
                    nameKey="name"
                    cx="40%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={40}
                    label={({ name, percent }) => 
                      `${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ 
                      strokeWidth: 1, 
                      stroke: '#2C1810',
                      strokeOpacity: 0.7
                    }}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {salesData.categorySales.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length].color}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      ...legendStyle,
                      right: -10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      lineHeight: '28px',
                      maxWidth: '45%',
                      paddingLeft: '10px'
                    }}
                    formatter={(value) => (
                      <span style={{ 
                        marginLeft: '8px', 
                        display: 'inline-block',
                        color: '#000000',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {value}
                      </span>
                    )}
                    iconMargin={12}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                backgroundColor: '#FFF8DC',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
                Top Selling Books
              </Typography>
              {salesData.topSellingBooks.map((book, index) => (
                <Box key={book._id}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 69, 19, 0.08)',
                      borderRadius: 1
                    }
                  }}>
                    <Typography sx={{ fontWeight: index < 3 ? 600 : 400 }}>
                      {index + 1}. {book.title}
                    </Typography>
                    <Typography sx={{ color: '#8B4513', fontWeight: 600 }}>
                      {book.salesCount} copies
                    </Typography>
                  </Box>
                  {index < salesData.topSellingBooks.length - 1 && <Divider sx={{ borderColor: '#DEB887' }} />}
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                backgroundColor: '#FFF8DC',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
                Sales by Category
              </Typography>
              {salesData.categorySales.map((category, index) => (
                <Box key={category.name}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 69, 19, 0.08)',
                      borderRadius: 1
                    }
                  }}>
                    <Typography>{category.name}</Typography>
                    <Typography sx={{ color: '#8B4513', fontWeight: 600 }}>
                      ${category.revenue.toFixed(2)}
                    </Typography>
                  </Box>
                  {index < salesData.categorySales.length - 1 && <Divider sx={{ borderColor: '#DEB887' }} />}
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SalesAnalytics;