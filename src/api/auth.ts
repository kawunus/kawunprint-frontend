import { api } from './index';
import type { LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<string> => {
    console.log('🔐 Attempting login with:', credentials.email);
    try {
      const response = await api.post('/api/v1/login', credentials);
      console.log('✅ Login response:', response.data);
      
      // Ваш бэкенд возвращает токен в поле "message", а не "data"
      if (response.data.message) {
        // Формат: { success: true, message: token }
        console.log('✅ Token found in message field');
        return response.data.message;
      } else if (response.data.data) {
        // Формат: { success: true, data: token }
        console.log('✅ Token found in data field');
        return response.data.data;
      } else if (response.data.token) {
        // Формат: { token: "..." }
        console.log('✅ Token found in token field');
        return response.data.token;
      } else if (typeof response.data === 'string') {
        // Формат: просто строка
        console.log('✅ Token is raw string');
        return response.data;
      } else {
        console.error('❌ Unexpected response format:', response.data);
        throw new Error('Unexpected response format from server');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<string> => {
    console.log('📝 Attempting registration');
    try {
      const response = await api.post('/api/v1/register', data);
      console.log('✅ Register response:', response.data);
      
      // Нормализация ответа
      if (response.data.message) {
        console.log('✅ Token found in message field');
        return response.data.message;
      } else if (response.data.data) {
        console.log('✅ Token found in data field');
        return response.data.data;
      } else if (response.data.token) {
        console.log('✅ Token found in token field');
        return response.data.token;
      } else if (typeof response.data === 'string') {
        console.log('✅ Token is raw string');
        return response.data;
      } else {
        console.error('❌ Unexpected response format:', response.data);
        throw new Error('Unexpected response format from server');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },
};
