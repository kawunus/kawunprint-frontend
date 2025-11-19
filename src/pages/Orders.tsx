import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { formatLocalDateTime, parseDbDate } from '../utils/datetime';
import { ordersApi } from '../api/orders';

export const Orders: React.FC = () => {
  const { orders, loading, error, refreshOrders } = useOrders();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRu = i18n.language?.startsWith('ru');
  
  // Filters toolbar state
  const [search, setSearch] = useState<string>('');
  const [appliedStatusId, setAppliedStatusId] = useState<number | ''>('');
  const [appliedDateFrom, setAppliedDateFrom] = useState<string>('');
  const [appliedDateTo, setAppliedDateTo] = useState<string>('');
  const [appliedMinTotal, setAppliedMinTotal] = useState<string>('');
  const [appliedMaxTotal, setAppliedMaxTotal] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filters modal temp state
  const [modalStatusId, setModalStatusId] = useState<number | ''>('');
  const [modalDateFrom, setModalDateFrom] = useState<string>('');
  const [modalDateTo, setModalDateTo] = useState<string>('');
  const [modalMinTotal, setModalMinTotal] = useState<string>('');
  const [modalMaxTotal, setModalMaxTotal] = useState<string>('');
  
  // Order statuses from server
  const [orderStatuses, setOrderStatuses] = useState<Array<{ id: number; description: string }>>([]);

  // Load order statuses
  useEffect(() => {
    ordersApi.getOrderStatuses()
      .then(setOrderStatuses)
      .catch(err => console.error('Failed to load statuses:', err));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFilters(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const statusNameById = useMemo(() => {
    const map = new Map<number, string>();
    orderStatuses.forEach(s => map.set(s.id, s.description));
    return (id?: number, fallback?: string) => (id != null ? map.get(id) : undefined) || fallback || '';
  }, [orderStatuses]);

  const getStatusColor = (statusId?: number) => {
    const statusName = statusNameById(statusId)?.toLowerCase() || '';
    if (statusName.includes('завершён') || statusName.includes('завершено') || statusName.includes('completed')) {
      return 'bg-green-100 text-green-800';
    } else if (statusName.includes('отменён') || statusName.includes('отменено') || statusName.includes('cancelled')) {
      return 'bg-red-100 text-red-800';
    } else if (statusName.includes('принят') || statusName.includes('принято') || statusName.includes('accepted')) {
      return 'bg-blue-100 text-blue-800';
    } else if (statusName.includes('процесс') || statusName.includes('progress') || statusName.includes('печат') || statusName.includes('print')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusName.includes('информац') || statusName.includes('info')) {
      return 'bg-purple-100 text-purple-800';
    } else if (statusName.includes('проектирован') || statusName.includes('design')) {
      return 'bg-indigo-100 text-indigo-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = useMemo(() => {
    let list = orders;
    
    // Status filter
    if (appliedStatusId !== '') {
      list = list.filter(o => (o.statusId ?? -1) === appliedStatusId);
    }
    
    // Date filters
    if (appliedDateFrom) {
      const fromTs = new Date(appliedDateFrom).getTime();
      list = list.filter(o => (parseDbDate(o.createdAt)?.getTime() ?? 0) >= fromTs);
    }
    if (appliedDateTo) {
      const toTs = new Date(appliedDateTo).getTime();
      list = list.filter(o => (parseDbDate(o.createdAt)?.getTime() ?? 0) <= toTs);
    }
    
    // Price filters
    if (appliedMinTotal) {
      const min = Number(appliedMinTotal);
      if (!Number.isNaN(min)) list = list.filter(o => o.totalPrice >= min);
    }
    if (appliedMaxTotal) {
      const max = Number(appliedMaxTotal);
      if (!Number.isNaN(max)) list = list.filter(o => o.totalPrice <= max);
    }
    
    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o => {
        const idMatch = String(o.id).includes(q);
        const commentMatch = (o.comment || '').toLowerCase().includes(q);
        return idMatch || commentMatch;
      });
    }
    
    return list;
  }, [orders, appliedStatusId, appliedDateFrom, appliedDateTo, appliedMinTotal, appliedMaxTotal, search]);

  const sorted = useMemo(() => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    return [...filteredOrders].sort((a, b) => {
      if (sortBy === 'date') {
        const ad = parseDbDate(a.createdAt)?.getTime() ?? 0;
        const bd = parseDbDate(b.createdAt)?.getTime() ?? 0;
        return (ad - bd) * dir;
      }
      if (sortBy === 'total') {
        return (a.totalPrice - b.totalPrice) * dir;
      }
      if (sortBy === 'status') {
        const nameA = statusNameById(a.statusId, a.status).toLowerCase();
        const nameB = statusNameById(b.statusId, b.status).toLowerCase();
        return nameA.localeCompare(nameB) * dir;
      }
      return 0;
    });
  }, [filteredOrders, sortBy, sortOrder, statusNameById]);

  const applyFilters = () => {
    setAppliedStatusId(modalStatusId);
    setAppliedDateFrom(modalDateFrom);
    setAppliedDateTo(modalDateTo);
    setAppliedMinTotal(modalMinTotal);
    setAppliedMaxTotal(modalMaxTotal);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setModalStatusId('');
    setModalDateFrom('');
    setModalDateTo('');
    setModalMinTotal('');
    setModalMaxTotal('');
    setAppliedStatusId('');
    setAppliedDateFrom('');
    setAppliedDateTo('');
    setAppliedMinTotal('');
    setAppliedMaxTotal('');
  };

  const clearAllFilters = () => {
    setSearch('');
    resetFilters();
  };

  const hasActiveFilters = search || appliedStatusId !== '' || appliedDateFrom || appliedDateTo || appliedMinTotal || appliedMaxTotal;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <Button onClick={refreshOrders} className="mt-2">
            {t('common.retry') || (isRu ? 'Повторить' : 'Retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
        <div className="flex items-center gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder={t('orders.search') || (isRu ? 'Поиск заказа' : 'Search order')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 text-sm px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'total' | 'status')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">{t('orders.sortByDate') || (isRu ? 'По дате' : 'Date')}</option>
            <option value="total">{t('orders.sortByPrice') || (isRu ? 'По цене' : 'Total')}</option>
            <option value="status">{t('orders.sortByStatus') || (isRu ? 'По статусу' : 'Status')}</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOrder === 'asc' 
              ? (isRu ? 'А → Я' : 'A → Z')
              : (isRu ? 'Я → А' : 'Z → A')
            }
          </button>

          {/* Filters Button */}
          <Button size="sm" variant="secondary" onClick={() => {
            setModalStatusId(appliedStatusId);
            setModalDateFrom(appliedDateFrom);
            setModalDateTo(appliedDateTo);
            setModalMinTotal(appliedMinTotal);
            setModalMaxTotal(appliedMaxTotal);
            setShowFilters(true);
          }}>
            {t('orders.filters') || (isRu ? 'Фильтры' : 'Filters')}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button size="sm" variant="secondary" onClick={clearAllFilters}>
              {t('orders.resetFilters') || (isRu ? 'Сбросить' : 'Clear')}
            </Button>
          )}

          {/* Create Order Button */}
          <Button size="sm" onClick={() => navigate('/create-order')}>
            {t('orders.create')}
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">{t('orders.empty')}</p>
          <Button onClick={() => navigate('/create-order')}>
            {t('orders.createFirst')}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order) => {
            const statusName = statusNameById(order.statusId, order.status);
            return (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-medium text-blue-600">
                      {t('orders.orderNumber', { number: order.id })}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.statusId)}`}>
                      {statusName}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('orders.created')}: {formatLocalDateTime(order.createdAt, i18n.language)}
                  </div>
                  {order.totalPrice > 0 && (
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {t('orders.price')}: {order.totalPrice.toFixed(2)} BYN
                    </div>
                  )}
                  {order.comment && (
                    <div className="text-sm text-gray-600 mt-1 truncate">
                      {order.comment}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/orders/${order.id}`)}>
                    {t('orders.viewDetails')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowFilters(false)} />
          <div className="bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t('orders.filters') || (isRu ? 'Фильтры' : 'Filters')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('orders.filterByStatus') || (isRu ? 'Статус' : 'Status')}
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={modalStatusId === '' ? '' : String(modalStatusId)}
                    onChange={(e) => setModalStatusId(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">{t('orders.allStatuses') || (isRu ? 'Все статусы' : 'All Statuses')}</option>
                    {orderStatuses.map(status => (
                      <option key={status.id} value={status.id}>{status.description}</option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('orders.filterByDateFrom') || (isRu ? 'Дата от' : 'Date From')}
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={modalDateFrom}
                    onChange={(e) => setModalDateFrom(e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('orders.filterByDateTo') || (isRu ? 'Дата до' : 'Date To')}
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={modalDateTo}
                    onChange={(e) => setModalDateTo(e.target.value)}
                  />
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('orders.filterByPriceMin') || (isRu ? 'Цена от' : 'Price From')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={modalMinTotal}
                    onChange={(e) => setModalMinTotal(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('orders.filterByPriceMax') || (isRu ? 'Цена до' : 'Price To')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={modalMaxTotal}
                    onChange={(e) => setModalMaxTotal(e.target.value)}
                    placeholder="999999.99"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="primary" onClick={applyFilters}>
                  {t('common.apply') || (isRu ? 'Применить' : 'Apply')}
                </Button>
                <Button variant="secondary" onClick={() => setShowFilters(false)}>
                  {t('common.cancel') || (isRu ? 'Отмена' : 'Cancel')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
