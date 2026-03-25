import axios from 'axios';
import toast from 'react-hot-toast';

// CORRECT URL - backend uses /api prefix
const API_URL = 'https://ecommerce-api-btlv.onrender.com/api';

console.log('🌐 API URL:', API_URL);

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error: Cannot connect to backend');
      toast.error(`Cannot connect to server. Make sure backend is running at ${API_URL}`);
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout Error: Request took too long');
      toast.error('Request timeout. Please try again.');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;