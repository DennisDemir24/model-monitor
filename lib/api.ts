import { LoginData } from '@/types/types';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.error || 'An unexpected error occurred';
      
      // Don't show toast for 401 errors (handled by auth context)
      if (error.response?.status !== 401) {
        toast.error(message);
      }
      
      return Promise.reject(error);
    }
  );

  // Auth API
  export const authAPI = {
    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
  }




export default api