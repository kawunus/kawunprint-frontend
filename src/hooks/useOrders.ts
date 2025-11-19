import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../api/orders';
import type { Order, CreateOrderRequest } from '../types';

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (data: CreateOrderRequest): Promise<Order> => {
    try {
      const order = await ordersApi.createOrder(data);
      
      // Загрузить файлы, если они есть
      if (data.files && data.files.length > 0) {
        await ordersApi.uploadFiles(order.id, data.files);
      }
      
      // Обновить список заказов
      await fetchOrders();
      
      return order;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Ошибка создания заказа');
    }
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders,
    createOrder,
  };
};
