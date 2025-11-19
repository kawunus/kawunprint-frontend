import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('🌐 Axios request:', config.method?.toUpperCase(), config.url);
    console.log('🔑 Token present:', !!token);
    if (token) {
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in localStorage!');
    }
    return config;
  },
  (error) => {
    console.error('🌐 Axios request error:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => {
    console.log('🌐 Axios response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🌐 Axios response error:', error.response?.status, error.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      console.warn('🌐 401 Unauthorized');
      console.warn('⚠️ Response data:', error.response?.data);
      console.warn('⚠️ Request URL:', error.config?.url);
      console.warn('⚠️ Auth header:', error.config?.headers?.Authorization);
      
      // Only redirect to login if it's NOT an order detail or history request
      // Those might have permission issues that need to be handled differently
      const url = error.config?.url || '';
      const isOrderDetailRequest = url.includes('/orders/') && (url.match(/\/orders\/\d+/) || url.includes('/history'));
      
      if (!isOrderDetailRequest) {
        console.warn('🌐 Redirecting to login');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else {
        console.warn('🌐 Order detail 401 - not redirecting (might be permission issue)');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
