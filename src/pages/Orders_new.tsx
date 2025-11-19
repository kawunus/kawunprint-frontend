import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';
import { getStatusName } from '../utils/statusMapping';

export const Orders: React.FC = () => {
  const { orders, loading, error } = useOrders();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Search and filters
  const [search, setSearch] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let list = [...orders];

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o => {
        const idMatch = String(o.id).includes(q);
        const commentMatch = (o.comment || '').toLowerCase().includes(q);
        return idMatch || commentMatch;
      });
    }

    // Status filter
    if (statusFilter !== '') {
      list = list.filter(o => o.statusId === statusFilter);
    }

    // Date filters
    if (dateFrom) {
      const fromDate = new Date(dateFrom).getTime();
      list = list.filter(o => new Date(o.createdAt).getTime() >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo).getTime();
      list = list.filter(o => new Date(o.createdAt).getTime() <= toDate);
    }

    // Price filters
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) list = list.filter(o => o.totalPrice >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) list = list.filter(o => o.totalPrice <= max);
    }

    // Sorting
    const dir = sortOrder === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (sortBy === 'date') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      }
      if (sortBy === 'price') {
        return (a.totalPrice - b.totalPrice) * dir;
      }
      if (sortBy === 'status') {
        return ((a.statusId || 0) - (b.statusId || 0)) * dir;
      }
      return 0;
    });

    return list;
  }, [orders, search, statusFilter, dateFrom, dateTo, minPrice, maxPrice, sortBy, sortOrder]);

  const hasActiveFilters = search || statusFilter !== '' || dateFrom || dateTo || minPrice || maxPrice;

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setMinPrice('');
    setMaxPrice('');
  };

  const uniqueStatuses = useMemo(() => {
    const statusIds = new Set(orders.map(o => o.statusId).filter(id => id != null));
    return Array.from(statusIds).sort((a, b) => a - b);
  }, [orders]);

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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('orders.title')}</h1>
        <Button onClick={() => navigate('/create-order')}>
          {t('orders.create')}
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder={t('orders.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'status')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">{t('orders.sortByDate')}</option>
              <option value="price">{t('orders.sortByPrice')}</option>
              <option value="status">{t('orders.sortByStatus')}</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            {t('orders.filters')} {hasActiveFilters && '●'}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              {t('orders.resetFilters')}
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('orders.filterByStatus')}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('orders.allStatuses')}</option>
                  {uniqueStatuses.map(statusId => (
                    <option key={statusId} value={statusId}>
                      {getStatusName(statusId, i18n.language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('orders.filterByDateFrom')}
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('orders.filterByDateTo')}
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('orders.filterByPriceMin')}
                </label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('orders.filterByPriceMax')}
                </label>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="99999"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      {filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">{t('orders.empty')}</p>
          <Button onClick={() => navigate('/create-order')}>
            {t('orders.createFirst')}
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAndSortedOrders.map((order) => (
              <li key={order.id}>
                <div 
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {t('orders.orderNumber', { number: order.id })}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.statusId === 2
                              ? 'bg-green-100 text-green-800'
                              : order.statusId === 3
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getStatusName(order.statusId || 0, i18n.language)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {order.comment || t('orders.noComment')}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {t('orders.created')}: {new Date(order.createdAt).toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')}
                          </p>
                        </div>
                      </div>
                      {order.totalPrice > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">
                            {t('orders.price')}: {order.totalPrice.toLocaleString(i18n.language === 'ru' ? 'ru-RU' : 'en-US')} ₽
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
