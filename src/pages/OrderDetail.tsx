import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import type { Order, OrderHistory } from '../types';
import { Button } from '../components/ui/Button';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<Array<{ id: number; description: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        console.log('🔍 OrderDetail: Fetching order data for ID:', id);
        console.log('🔑 OrderDetail: Auth token exists:', !!localStorage.getItem('authToken'));
        
        const [orderData, historyData, statusesData] = await Promise.all([
          ordersApi.getOrderById(Number(id)),
          ordersApi.getOrderHistory(Number(id)),
          ordersApi.getOrderStatuses(),
        ]);
        setOrder(orderData);
        setHistory(historyData);
        setOrderStatuses(statusesData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Не удалось загрузить детали заказа');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  const statusNameById = useMemo(() => {
    const map = new Map<number, string>();
    orderStatuses.forEach(s => map.set(s.id, s.description));
    return (id?: number) => map.get(id || 0) || 'Неизвестно';
  }, [orderStatuses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-700">{error || 'Заказ не найден'}</p>
        </div>
        <Link to="/orders">
          <Button variant="secondary">← Назад к заказам</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (statusId: number) => {
    if (statusId === 2) { // Завершён
      return 'bg-green-100 text-green-800';
    } else if (statusId === 3) { // Отменён
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="secondary" size="sm" className="mb-4">
            ← Назад к заказам
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Заказ №{order.id}</h1>
      </div>

      {/* Order Info Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Статус</p>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.statusId || 0)}`}>
              {statusNameById(order.statusId)}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Дата создания</p>
            <p className="text-base text-gray-900">
              {new Date(order.createdAt).toLocaleString('ru-RU')}
            </p>
          </div>

          {order.completedAt && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Дата завершения</p>
              <p className="text-base text-gray-900">
                {new Date(order.completedAt).toLocaleString('ru-RU')}
              </p>
            </div>
          )}

          {order.totalPrice > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Стоимость</p>
              <p className="text-xl font-semibold text-gray-900">
                {order.totalPrice.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          )}

          {order.comment && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Комментарий</p>
              <p className="text-base text-gray-900 bg-gray-50 p-3 rounded">
                {order.comment}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">История изменений</h2>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">История отсутствует</p>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleString('ru-RU')}
                    </p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      Статус изменён на: <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(entry.statusId || 0)}`}>
                        {statusNameById(entry.statusId)}
                      </span>
                    </p>
                    {entry.comment && (
                      <p className="text-sm text-gray-600 mt-1">
                        {entry.comment}
                      </p>
                    )}
                    {entry.employee && (
                      <p className="text-xs text-gray-400 mt-1">
                        Изменил: {entry.employee.firstName} {entry.employee.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
