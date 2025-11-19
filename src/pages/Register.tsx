import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Register: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramAccount, setTelegramAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('errors.passwordsMismatch'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        telegramAccount: telegramAccount || undefined,
      });
      
      const token = localStorage.getItem('authToken');
      if (token) {
        navigate('/', { replace: true });
      } else {
        setError(t('errors.registerFailed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t('errors.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('register.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              {t('register.login')}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('register.firstName')}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder={t('register.firstNamePlaceholder')}
            />
            <Input
              label={t('register.lastName')}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder={t('register.lastNamePlaceholder')}
            />
          </div>

          <Input
            label={t('register.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t('register.emailPlaceholder')}
            autoComplete="email"
          />

          <Input
            label={t('register.phone')}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder={t('register.phonePlaceholder')}
          />

          <Input
            label={t('register.telegram')}
            type="text"
            value={telegramAccount}
            onChange={(e) => setTelegramAccount(e.target.value)}
            placeholder={t('register.telegramPlaceholder')}
          />

          <Input
            label={t('register.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t('register.passwordPlaceholder')}
            autoComplete="new-password"
          />

          <Input
            label={t('register.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder={t('register.passwordPlaceholder')}
            autoComplete="new-password"
          />

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {t('register.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
