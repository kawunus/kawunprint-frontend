import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { isAuthenticated, userName, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">KawunPrint</span>
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('header.myOrders')}
                </Link>
                <Link
                  to="/create-order"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('header.createOrder')}
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('header.profile')}
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleLanguage}
              className="bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white"
            >
              {i18n.language?.toUpperCase() || 'RU'}
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {t('header.greeting', { name: userName || t('common.user') })}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                >
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    {t('common.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
