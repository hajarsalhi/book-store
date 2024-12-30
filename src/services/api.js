import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Handle all responses
  }
});

// Books API
export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  getTopRatedBooks: () => api.get('/books'),
  getBestSellers: () => api.get('/books/'),  
  getBook: (id) => api.get(`/books/${id}`),
  addBook: (data) => api.post('/books', data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  addToCart: (id, quantity) => api.post(`/books/add-to-cart/${id}`, { quantity } ),
  getBookById: (id) => api.get(`/books/${id}`),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  purchaseBook: (id, quantity = 1) => api.post(`/books/purchase/${id}`, { quantity }),
  searchBooks: (queryString) => api.get(`/books/search?${queryString}`),
  getCategories: () => api.get('/books/categories'),
  getBookReviews: (bookId) => api.get(`/books/${bookId}/reviews`),
  addBookReview: (bookId, reviewData) => api.post(`/books/${bookId}/reviews`, reviewData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  updateBookReview: (bookId, reviewId, reviewData) => api.put(
    `/books/${bookId}/reviews/${reviewId}`,
    reviewData,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  ),
  deleteBookReview: (bookId, reviewId) => api.delete(
    `/books/${bookId}/reviews/${reviewId}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  ),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  signup: (data) => api.post('/auth/signup', data)
};

// User API
export const userAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getUserData: () => api.get('/auth/verify'),
};

// Coupon API
export const couponAPI = {
  validate: (code) => api.post('/coupons/validate', { code }),
  calculateLoyaltyDiscount: (totalPurchases) => api.post('/coupons/loyalty-discount', { totalPurchases })
};

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const commandAPI = {
  createCommand: (items) => api.post('/commands', { items }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  getUserCommands: () => api.get('/commands'),
  getCommandById: (id) => api.get(`/commands/${id}`)
};

export const adminAPI = {
  getSalesAnalytics: (timeRange) => {
    console.log('Making API call to:', `/admin/analytics/sales?timeRange=${timeRange}`);
    return api.get(`/admin/analytics/sales?timeRange=${timeRange}`, {
      timeout: 5000
    });
  },
};

// Add interceptor to log requests
api.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    baseURL: request.baseURL,
    headers: request.headers,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);


