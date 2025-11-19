import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Добро пожаловать в KawunPrint
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Профессиональная 3D-печать для ваших проектов. Высокое качество, быстрые сроки, доступные цены.
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/orders">
                <Button>Мои заказы</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button>Начать работу</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Войти</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
            <div className="text-gray-600">Лет на рынке</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Выполненных заказов</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-gray-600">Точки приёма</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Наши услуги
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="text-2xl mb-4">🖨️</div>
            <h3 className="text-xl font-semibold mb-2">3D-печать</h3>
            <p className="text-gray-600">
              FDM и SLA печать из различных материалов: PLA, ABS, PETG, нейлон, фотополимерные смолы.
            </p>
          </div>
          <div className="p-6">
            <div className="text-2xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Постобработка</h3>
            <p className="text-gray-600">
              Шлифовка, покраска, склейка деталей. Доводим изделия до идеального состояния.
            </p>
          </div>
          <div className="p-6">
            <div className="text-2xl mb-4">📐</div>
            <h3 className="text-xl font-semibold mb-2">3D-моделирование</h3>
            <p className="text-gray-600">
              Создаём 3D-модели по вашим эскизам или чертежам. Помогаем подготовить файлы к печати.
            </p>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-lg my-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Наши точки приёма
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Минск - Центр</h3>
            <p className="text-gray-600 text-sm mb-1">г. Минск, пр. Независимости, 47</p>
            <p className="text-gray-500 text-sm">Пн-Пт: 9:00-18:00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Минск - Каменная Горка</h3>
            <p className="text-gray-600 text-sm mb-1">г. Минск, ул. Притыцкого, 156</p>
            <p className="text-gray-500 text-sm">Пн-Сб: 10:00-19:00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Гомель</h3>
            <p className="text-gray-600 text-sm mb-1">г. Гомель, ул. Советская, 23</p>
            <p className="text-gray-500 text-sm">Пн-Пт: 10:00-18:00</p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Почему выбирают нас
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">✓</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Современное оборудование</h3>
              <p className="text-gray-600">
                Используем принтеры последнего поколения для высокой точности печати
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">✓</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Опытная команда</h3>
              <p className="text-gray-600">
                Наши специалисты помогут с выбором материалов и технологии печати
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">✓</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Быстрые сроки</h3>
              <p className="text-gray-600">
                Большинство заказов выполняем за 1-3 дня в зависимости от сложности
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">✓</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Прозрачные цены</h3>
              <p className="text-gray-600">
                Цены формируются автоматически на основе объёма и выбранного материала
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-xl mb-8 opacity-90">
              Зарегистрируйтесь и создайте свой первый заказ уже сегодня
            </p>
            <Link to="/register">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
                Зарегистрироваться
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KawunPrint</h3>
              <p className="text-gray-400">
                Профессиональная 3D-печать с 2019 года
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <p className="text-gray-400 text-sm mb-2">Email: kawunprint@gmail.com</p>
              <p className="text-gray-400 text-sm">Телефон: +375 (29) 123-45-67</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Режим работы</h4>
              <p className="text-gray-400 text-sm mb-2">Пн-Пт: 9:00 - 18:00</p>
              <p className="text-gray-400 text-sm">Сб: 10:00 - 16:00</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 KawunPrint. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
