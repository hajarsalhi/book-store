import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Books API
export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  getBook: (id) => api.get(`/books/${id}`),
  addBook: (data) => api.post('/books', data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  addToCart: (id, quantity) => api.post(`/books/add-to-cart/${id}`, { quantity } ),
  getBookById: (id) => api.get(`/books/${id}`),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  purchaseBook: (id, quantity = 1) => api.post(`/books/purchase/${id}`, { quantity }),
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
  signup: (data) => api.post('/auth/signup', data)

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
  createCommand: (items) => {
    console.log('API call with items:', items); // Debug log
    return api.post('/commands', { items });
  },
  getUserCommands: () => api.get('/commands'),
  getCommandById: (id) => api.get(`/commands/${id}`)
};


