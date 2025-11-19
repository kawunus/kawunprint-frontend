import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const CreateOrder: React.FC = () => {
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Пожалуйста, добавьте описание заказа');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createOrder({
        comment,
        files,
      });
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Ошибка создания заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Создать заказ</h1>
        <p className="mt-2 text-sm text-gray-600">
          Заполните информацию о вашем заказе. Администратор свяжется с вами для уточнения деталей.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <Input
            label="Описание заказа"
            multiline
            rows={6}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Опишите, что вы хотите напечатать. Укажите размеры, количество, материал, цвет и другие пожелания..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Файлы для печати (необязательно)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Загрузить файлы</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".stl,.obj,.3mf,.step,.stp"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">или перетащите сюда</p>
                </div>
                <p className="text-xs text-gray-500">
                  STL, OBJ, 3MF, STEP до 50MB каждый
                </p>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Выбранные файлы ({files.length}):
                </h4>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/orders')}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              Создать заказ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
