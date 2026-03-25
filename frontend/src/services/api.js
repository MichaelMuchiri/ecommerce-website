import axios from 'axios';
import toast from 'react-hot-toast';

// ============================================
// API URL CONFIGURATION - Works for both local and production
// ============================================

// Automatically uses:
// - http://localhost:5000/api when running locally (npm start)
// - https://ecommerce-api-btlv.onrender.com/api when deployed to Vercel
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🌐 API URL:', API_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);

// ============================================
// CREATE AXIOS INSTANCE
// ============================================
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ============================================
// REQUEST INTERCEPTOR - Add Auth Token
// ============================================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle Errors
// ============================================
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network error - no connection to backend
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error:', error);
      toast.error(`Cannot connect to server. Please make sure backend is running at ${API_URL}`);
    }
    
    // Timeout error
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout Error:', error);
      toast.error('Request timeout. Please try again.');
    }
    
    // Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Forbidden - not enough permissions
    if (error.response?.status === 403) {
      console.error('❌ Forbidden:', error);
      toast.error('You do not have permission to perform this action');
    }
    
    // Not Found
    if (error.response?.status === 404) {
      console.error('❌ Not Found:', error);
      toast.error(error.response.data?.message || 'Resource not found');
    }
    
    // Server Error
    if (error.response?.status >= 500) {
      console.error('❌ Server Error:', error);
      toast.error('Server error. Please try again later.');
    }
    
    // Display error message from server
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;