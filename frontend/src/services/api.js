import axios from 'axios';
import toast from 'react-hot-toast';


// CHANGE THIS URL TO YOUR RENDER BACKEND URL
const API_URL = 'https://ecommerce-api-btlv.onrender.com/';
// For local development, use: http://localhost:5000/api

// Log the API URL for debugging
console.log('🌐 API URL:', API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
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


API.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle network errors (no connection to backend)
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error: Cannot connect to backend');
      toast.error(`Cannot connect to server. Please make sure the backend is running at:\n${API_URL}`);
      return Promise.reject(error);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout Error: Request took too long');
      toast.error('Request timeout. Please try again.');
      return Promise.reject(error);
    }

    // Handle response errors (status codes)
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized (token expired)
      if (status === 401) {
        console.error('❌ Unauthorized: Token expired or invalid');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        console.error('❌ Forbidden: You do not have permission');
        toast.error('You do not have permission to perform this action');
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        console.error('❌ Not Found:', data.message);
        toast.error(data.message || 'Resource not found');
      }
      
      // Handle 400 Bad Request (validation errors)
      if (status === 400 && data.errors) {
        // Display each validation error
        data.errors.forEach(err => {
          toast.error(err.message);
        });
      } else if (data.message) {
        // Display single error message
        toast.error(data.message);
      }
      
      // Handle 500 Server Error
      if (status >= 500) {
        console.error('❌ Server Error:', data.message);
        toast.error('Server error. Please try again later.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;