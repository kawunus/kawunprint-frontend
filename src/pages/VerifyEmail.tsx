import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const VerifyEmail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      setError(t('verify.noEmail'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await authApi.verifyEmail(userEmail, code);
      localStorage.setItem('authToken', token);
      
      setSuccess(t('verify.success'));
      
      // Отправляем событие для обновления состояния
      window.dispatchEvent(new Event('authChange'));
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t('verify.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      setError(t('verify.noEmail'));
      return;
    }

    setResending(true);
    setError('');
    setSuccess('');

    try {
      await authApi.sendVerificationCode(userEmail);
      setSuccess(t('verify.codeSent'));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t('verify.resendError'));
    } finally {
      setResending(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('verify.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('verify.subtitle')} <strong>{userEmail}</strong>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <Input
            label={t('verify.code')}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder={t('verify.codePlaceholder')}
            autoComplete="off"
          />

          <div className="space-y-3">
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {t('verify.submit')}
            </Button>

            <Button
              type="button"
              onClick={handleResend}
              loading={resending}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              {t('verify.resend')}
            </Button>

            <Button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {t('verify.logout')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
