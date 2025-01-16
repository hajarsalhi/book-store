import axios from 'axios';

const API_URL = 'https://book-store-server-z514.onrender.com';

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
  getNewReleases:()=>api.get('/books/'),
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

// Library API
export const libraryAPI = {
  getPurchasedBooks:() => api.get(`/library/purchased-books/`,{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  updateReadingStatus:(id,status) => api.put(`/library/purchased-books/${id}`,{status}),
  saveBookNotes:(id,notes) => api.put(`/library/purchased-books/${id}/notes`,{notes}),
  addToLibrary:(id) => api.post(`/library/purchased-books/${id}`,{readingStatus:'not-started'}),
  removeFromLibrary:(id) => api.delete(`/library/purchased-books/${id}`)
};

// Coupon API
export const couponAPI = {
  validate: (code) => api.post('/coupons/validate', { code },{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  calculateLoyaltyDiscount: (totalPurchases) => api.post('/coupons/loyalty-discount', { totalPurchases })
};

export const bookPacksAPI= {
  getBookPacks:(category) => api.get(`/packs?category=${category}`)
};


export const wishListAPI = {
  getWishlist:()=> api.get('/wishlist',{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  addToWishlist:(bookId)=>api.post('/wishlist',{
    bookId:bookId,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }),
  removeFromWishlist:(id)=>api.delete(`/wishlist/${id}`,{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
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
  bulkUploadBooks: (books) => api.post('/admin/books/bulk-upload', books)
};

// Add this to your existing api.js file
export const googleBooksAPI = {
  searchByISBN: async (isbn) => {
    try {
      const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
      
      // Fallback to test mode if no API key
      if (!API_KEY) {
        console.warn('No API key found - using test mode');
        return {
          title: `Test Book (ISBN: ${isbn})`,
          author: 'Test Author',
          description: 'Test Description',
          imageUrl: 'https://via.placeholder.com/128x192',
          category: 'Test Category',
          price: 9.99,
          stock: 10
        };
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('No book found with this ISBN');
      }

      const bookInfo = data.items[0].volumeInfo;
      return {
        title: bookInfo.title,
        author: bookInfo.authors ? bookInfo.authors[0] : 'Unknown',
        description: bookInfo.description || '',
        imageUrl: bookInfo.imageLinks?.thumbnail || '',
        isbn: isbn,
        category: bookInfo.categories ? bookInfo.categories[0] : 'Uncategorized',
        publisher: bookInfo.publisher || '',
        publishedDate: bookInfo.publishedDate || '',
        pageCount: bookInfo.pageCount || 0,
        price: 0, // You'll need to set this manually
        stock: 0  // You'll need to set this manually
      };
    } catch (error) {
      console.error('Google Books API error:', error);
      throw error;
    }
  }
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


