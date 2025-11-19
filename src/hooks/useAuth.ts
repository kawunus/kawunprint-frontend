import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../types';
import { getUserInfoFromToken } from '../utils/jwt';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isClient: boolean;
  userRole: string | null;
  userName: string | null;
  userEmail: string | null;
  isActive: boolean;
  login: (credentials: LoginRequest) => Promise<string>;
  register: (data: RegisterRequest) => Promise<string>;
  logout: () => void;
  isLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const userInfo = getUserInfoFromToken();
      const role = userInfo?.role?.toUpperCase();
      const userIsClient = role === 'CLIENT';
      const full = userInfo?.full || `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim();
      const email = userInfo?.email || null;
      const active = userInfo?.isActive !== false; // По умолчанию true если не указано
      
      setIsAuthenticated(true);
      setIsClient(userIsClient);
      setUserRole(role || null);
      setUserName(full || null);
      setUserEmail(email);
      setIsActive(active);
    } else {
      setIsAuthenticated(false);
      setIsClient(false);
      setUserRole(null);
      setUserName(null);
      setUserEmail(null);
      setIsActive(true);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Слушаем кастомное событие authChange
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      console.log('🔑 useAuth: Starting login...');
      const token = await authApi.login(credentials);
      console.log('🔑 useAuth: Token received, length:', token?.length);
      
      localStorage.setItem('authToken', token);
      console.log('🔑 useAuth: Token saved to localStorage');
      
      // Verify token was saved
      const savedToken = localStorage.getItem('authToken');
      console.log('🔑 useAuth: Verified token in localStorage:', savedToken === token ? 'YES' : 'NO');
      
      const userInfo = getUserInfoFromToken();
      console.log('🔑 useAuth: User info from token:', userInfo);
      
      const role = userInfo?.role?.toUpperCase();
      const userIsClient = role === 'CLIENT';
      const full = userInfo?.full || `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim();
      const email = userInfo?.email || null;
      const active = userInfo?.isActive !== false;
      
      setIsAuthenticated(true);
      setIsClient(userIsClient);
      setUserRole(role || null);
      setUserName(full || null);
      setUserEmail(email);
      setIsActive(active);
      
      console.log('🔑 useAuth: Auth state updated, isAuthenticated: true');
      
      // Отправляем кастомное событие для обновления Header
      window.dispatchEvent(new Event('authChange'));
      
      return token;
    } catch (error) {
      console.error('🔑 useAuth: Login failed:', error);
      setIsAuthenticated(false);
      setIsClient(false);
      setUserRole(null);
      setUserName(null);
      setUserEmail(null);
      setIsActive(true);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const token = await authApi.register(data);
      localStorage.setItem('authToken', token);
      
      const userInfo = getUserInfoFromToken();
      const role = userInfo?.role?.toUpperCase();
      const userIsClient = role === 'CLIENT';
      const full = userInfo?.full || `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim();
      const email = userInfo?.email || null;
      const active = userInfo?.isActive !== false;
      
      setIsAuthenticated(true);
      setIsClient(userIsClient);
      setUserRole(role || null);
      setUserName(full || null);
      setUserEmail(email);
      setIsActive(active);
      
      // Отправляем кастомное событие для обновления Header
      window.dispatchEvent(new Event('authChange'));
      
      return token;
    } catch (error) {
      setIsAuthenticated(false);
      setIsClient(false);
      setUserRole(null);
      setUserName(null);
      setUserEmail(null);
      setIsActive(true);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setIsClient(false);
    setUserRole(null);
    setUserName(null);
    setUserEmail(null);
    setIsActive(true);
    // Отправляем кастомное событие для обновления Header
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/login';
  }, []);

  return {
    isAuthenticated,
    isClient,
    userRole,
    userName,
    userEmail,
    isActive,
    login,
    register,
    logout,
    isLoading,
  };
};
