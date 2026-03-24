import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../api/users.api';
import type { UpdateUserRequest } from '../../api/users.api';
import type { User } from '../../types/user';
import type { Order } from '../../types/order';
import './index.css';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isInitialized = useRef(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const loadOrderHistory = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const response = await usersApi.getOrderHistory(userId);
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const user = usersApi.getCurrentUser();
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
    setEditForm({
      name: user.name,
      phone: user.phone,
      address: user.address,
      email: user.email
    });
    loadOrderHistory(user.id);
  }, [navigate, loadOrderHistory]);

  const handleEditClick = () => {
    if (currentUser) {
      setEditForm({
        name: currentUser.name,
        phone: currentUser.phone,
        address: currentUser.address,
        email: currentUser.email
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSaveEdit = async () => {
    if (!currentUser) return;
    
    try {
      setError('');
      const response = await usersApi.update(currentUser.id, editForm);
      if (response.success && response.data) {
        setCurrentUser(response.data);
        setIsEditing(false);
        setSuccessMessage('Профиль успешно обновлен');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.error || 'Не удалось обновить профиль');
      }
    } catch (err) {
      setError('Не удалось обновить профиль');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'В обработке',
      completed: 'Выполнен',
      cancelled: 'Отменен'
    };
    return statusMap[status] || status;
  };

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <aside className="profile-page__sidebar">
          <div className="profile-page__avatar">
            <div className="profile-page__avatar-icon">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <nav className="profile-page__nav">
            <a href="#account" className="profile-page__nav-link profile-page__nav-link_active">
              Аккаунт
            </a>
            <a href="#orders" className="profile-page__nav-link">
              Заказы
            </a>
          </nav>
        </aside>

        <main className="profile-page__content">
          <section id="account" className="profile-page__section">
            <div className="profile-page__section-header">
              <h1 className="profile-page__title">Личный кабинет</h1>
              {!isEditing && (
                <button className="profile-page__btn profile-page__btn_edit" onClick={handleEditClick}>
                  Редактировать
                </button>
              )}
            </div>

            {successMessage && (
              <div className="profile-page__success">{successMessage}</div>
            )}
            {error && (
              <div className="profile-page__error">{error}</div>
            )}

            <div className="profile-page__info-card">
              <h2 className="profile-page__card-title">Информация об аккаунте</h2>
              
              {isEditing ? (
                <div className="profile-page__form">
                  <div className="profile-page__form-group">
                    <label className="profile-page__label">Имя</label>
                    <input
                      type="text"
                      name="name"
                      className="profile-page__input"
                      value={editForm.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="profile-page__form-group">
                    <label className="profile-page__label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="profile-page__input"
                      value={editForm.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="profile-page__form-group">
                    <label className="profile-page__label">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      className="profile-page__input"
                      value={editForm.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="profile-page__form-group">
                    <label className="profile-page__label">Адрес</label>
                    <input
                      type="text"
                      name="address"
                      className="profile-page__input"
                      value={editForm.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="profile-page__form-actions">
                    <button className="profile-page__btn profile-page__btn_save" onClick={handleSaveEdit}>
                      Сохранить
                    </button>
                    <button className="profile-page__btn profile-page__btn_cancel" onClick={handleCancelEdit}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-page__details">
                  <div className="profile-page__detail">
                    <span className="profile-page__detail-label">Имя</span>
                    <span className="profile-page__detail-value">{currentUser.name}</span>
                  </div>
                  <div className="profile-page__detail">
                    <span className="profile-page__detail-label">Email</span>
                    <span className="profile-page__detail-value">{currentUser.email}</span>
                  </div>
                  <div className="profile-page__detail">
                    <span className="profile-page__detail-label">Телефон</span>
                    <span className="profile-page__detail-value">{currentUser.phone}</span>
                  </div>
                  <div className="profile-page__detail">
                    <span className="profile-page__detail-label">Адрес</span>
                    <span className="profile-page__detail-value">{currentUser.address}</span>
                  </div>
                  <div className="profile-page__detail">
                    <span className="profile-page__detail-label">Дата регистрации</span>
                    <span className="profile-page__detail-value">{formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section id="orders" className="profile-page__section">
            <h2 className="profile-page__subtitle">История заказов</h2>
            
            {loading ? (
              <div className="profile-page__loading">Загрузка заказов...</div>
            ) : orders.length === 0 ? (
              <div className="profile-page__empty">
                <p>У вас пока нет заказов</p>
                <button className="profile-page__btn profile-page__btn_primary" onClick={() => navigate('/')}>
                  Перейти к покупкам
                </button>
              </div>
            ) : (
              <div className="profile-page__orders">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card__header">
                      <div className="order-card__info">
                        <span className="order-card__id">Заказ #{order.id}</span>
                        <span className="order-card__date">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className={`order-card__status order-card__status_${order.status}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <div className="order-card__items">
                      {order.items.map((item, index) => (
                        <div key={`${item.productId}-${index}`} className="order-item">
                          <div className="order-item__info">
                            <span className="order-item__name">
                              {item.product?.name || `Товар #${item.productId}`}
                            </span>
                            <span className="order-item__quantity">× {item.quantity}</span>
                          </div>
                          <span className="order-item__price">
                            {item.price * item.quantity} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-card__footer">
                      <span className="order-card__total">Итого: {order.totalAmount} ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
