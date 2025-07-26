import { Brand, CreateBrandData, LoginData } from '@/types/types';
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

// Brands API
export const brandsAPI = {
  getAllBrands: async (): Promise<Brand[]> => {
    const response = await api.get('/brands');
    return response.data;
  },
  getBrandById: async (id: string): Promise<Brand> => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },
  createBrand: async (data: CreateBrandData): Promise<Brand> => {
    const response = await api.post('/brands', data);
    return response.data;
  },
  updateBrand: async (id: string, data: CreateBrandData): Promise<Brand> => {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  },
  deleteBrand: async (id: string): Promise<Brand> => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
  generateResponse: async (brandId: string): Promise<Response> => {
    const response = await api.post(`/brands/${brandId}/responses`);
    return response.data;
  },
}

// Responses API
export const responsesAPI = {
    rate: async (responseId: string, value: boolean): Promise<Response> => {
      const response = await api.put(`/responses/${responseId}/rating`, { value });
      return response.data;
    },
    
    removeRating: async (responseId: string): Promise<Response> => {
      const response = await api.delete(`/responses/${responseId}/rating`);
      return response.data;
    },
    
    getById: async (responseId: string): Promise<Response> => {
      const response = await api.get(`/responses/${responseId}`);
      return response.data;
    },
  };


export default api