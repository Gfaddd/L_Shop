import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { basketApi } from '../../api/basket.api';
import type { Basket } from '../../api/basket.api';
import { usersApi } from '../../api/users.api';
import type { User } from '../../types/user';
import './index.css';

export const BasketPage: React.FC = () => {
  const navigate = useNavigate();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);

  useEffect(() => {
    const user = usersApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      loadBasket(currentUser.id);
    }
  }, [currentUser]);

  const loadBasket = async (userId: string) => {
    try {
      setLoading(true);
      const response = await basketApi.getByUserId(userId);
      setBasket(response.data);
    } catch (err) {
      setError('Не удалось загрузить корзину');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await basketApi.updateItem(currentUser.id, productId, quantity);
      setBasket(response.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError('Не удалось обновить количество');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await basketApi.removeItem(currentUser.id, productId);
      setBasket(response.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError('Не удалось удалить товар');
    }
  };

  const handleClearBasket = async () => {
    if (!currentUser?.id) return;
    
    try {
      await basketApi.clearBasket(currentUser.id);
      setBasket({ ...basket!, items: [] });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError('Не удалось очистить корзину');
    }
  };

  const getTotalPrice = () => {
    if (!basket?.items) return 0;
    return basket.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    if (!basket?.items) return 0;
    return basket.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (!currentUser) {
    return (
      <div className="basket-page">
        <div className="basket-page__empty">
          <h2>Корзина пуста</h2>
          <p>Войдите в аккаунт, чтобы увидеть свою корзину</p>
          <button className="basket-page__go-shopping" onClick={() => navigate('/')}>
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="basket-page">
        <div className="basket-page__loading">Загрузка корзины...</div>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <h1 className="basket-page__title">Корзина</h1>
      
      {error && <div className="basket-page__error">{error}</div>}
      
      {!basket || basket.items.length === 0 ? (
        <div className="basket-page__empty">
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину</p>
          <button className="basket-page__go-shopping" onClick={() => navigate('/')}>
            Перейти к покупкам
          </button>
        </div>
      ) : (
        <>
          <div className="basket-page__items">
            {basket.items.map((item) => (
              <div key={item.productId} className="basket-item">
                <div className="basket-item__image">
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.name} />
                  ) : (
                    <div className="basket-item__placeholder">📦</div>
                  )}
                </div>
                
                <div className="basket-item__info">
                  <h3 className="basket-item__name">{item.product?.name}</h3>
                  <p className="basket-item__category">{item.product?.category}</p>
                  <p className="basket-item__price">{item.product?.price} ₽</p>
                </div>
                
                <div className="basket-item__quantity">
                  <button 
                    className="basket-item__btn"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="basket-item__count">{item.quantity}</span>
                  <button 
                    className="basket-item__btn"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="basket-item__total">
                  {(item.product?.price || 0) * item.quantity} ₽
                </div>
                
                <button 
                  className="basket-item__remove"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="basket-page__summary">
            <div className="basket-page__summary-row">
              <span>Товаров:</span>
              <span>{getTotalItems()}</span>
            </div>
            <div className="basket-page__summary-row total">
              <span>Итого:</span>
              <span>{getTotalPrice()} ₽</span>
            </div>
            <button className="basket-page__checkout">
              Оформить заказ
            </button>
            <button className="basket-page__clear" onClick={handleClearBasket}>
              Очистить корзину
            </button>
          </div>
        </>
      )}
    </div>
  );
};
