import api from './index';
import type { Order, CreateOrderRequest, OrderHistory } from '../types';

export const ordersApi = {
  // Получить заказы текущего пользователя
  getMyOrders: async (): Promise<Order[]> => {
    console.log('📦 Fetching my orders...');
    try {
      const response = await api.get<Order[]>('/api/v1/orders/my');
      console.log('✅ Orders received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch orders:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить конкретный заказ
  getOrderById: async (id: number): Promise<Order> => {
    console.log('📦 Fetching order by ID:', id);
    try {
      const response = await api.get<Order>(`/api/v1/orders/${id}`);
      console.log('✅ Order received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch order:', error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Получить историю заказа
  getOrderHistory: async (orderId: number): Promise<OrderHistory[]> => {
    try {
      const response = await api.get<OrderHistory[]>(`/api/v1/orders/${orderId}/history`);
      return response.data;
    } catch (err: any) {
      // Treat 404 as "no history" so UI can render empty state instead of error
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  // Создать новый заказ
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    // Get user info from token to extract customerId
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Decode JWT to get user ID
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const customerId = payload.id;
    
    console.log('📝 Creating order with customerId:', customerId);
    
    const response = await api.post<Order>('/api/v1/orders', {
      customerId,
      comment: data.comment,
      statusId: 6, // ID статуса "Принят"
      totalPrice: 0, // Будет рассчитано админом
    });
    return response.data;
  },

  // Загрузить файлы для заказа
  uploadFiles: async (orderId: number, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    await api.post(`/api/v1/orders/${orderId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Получить список статусов заказов
  getOrderStatuses: async (): Promise<Array<{ id: number; description: string }>> => {
    const response = await api.get<Array<{ id: number; description: string }>>('/api/v1/order-status');
    return response.data;
  },
};
