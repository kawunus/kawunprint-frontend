import React, { useEffect, useState } from 'react';
import { usersApi } from '../api/users';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

export const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await usersApi.getMe();
      setUser(userData);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (!currentPassword) {
      setError('Введите текущий пароль для подтверждения изменений');
      return;
    }

    if (showChangePassword) {
      if (!newPassword) {
        setError('Введите новый пароль');
        return;
      }
      if (newPassword.length < 6) {
        setError('Пароль должен быть не менее 6 символов');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
    }

    try {
      setSaving(true);
      const updateData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        currentPassword,
        newPassword: showChangePassword && newPassword ? newPassword : undefined,
      };

      const updatedUser = await usersApi.updateMe(updateData);
      setUser(updatedUser);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Не удалось обновить профиль';
      setError(typeof errorMsg === 'string' ? errorMsg : 'Не удалось обновить профиль');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error || 'Профиль не найден'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
        <p className="text-gray-600 mt-1">Управление информацией аккаунта</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Имя *"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <Input
              label="Фамилия *"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <Input
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Телефон *"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Безопасность</h2>
            {!showChangePassword && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowChangePassword(true)}
              >
                Сменить пароль
              </Button>
            )}
          </div>

          {showChangePassword && (
            <div className="space-y-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Input
                label="Новый пароль *"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль"
                autoComplete="new-password"
              />

              <Input
                label="Подтвердите пароль *"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                autoComplete="new-password"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowChangePassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-full"
              >
                Отмена
              </Button>
            </div>
          )}

          <Input
            label="Текущий пароль *"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Введите текущий пароль"
            required
            autoComplete="current-password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Требуется для подтверждения любых изменений
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">Профиль успешно обновлён!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={loadUserData}
            disabled={saving}
          >
            Сбросить
          </Button>
        </div>
      </form>
    </div>
  );
};
