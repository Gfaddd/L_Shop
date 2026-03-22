import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../auth-modal';
import { usersApi } from '../../api/users.api';
import { basketApi } from '../../api/basket.api';
import type { User } from '../../types/user';
import './index.css';

export const Header: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = usersApi.getCurrentUser();
    setCurrentUser(user);
    if (user?.id) {
      loadCartCount(user.id);
    }

    const handleStorageChange = () => {
      const currentUser = usersApi.getCurrentUser();
      if (currentUser?.id) {
        loadCartCount(currentUser.id);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const loadCartCount = async (userId: string) => {
    try {
      const response = await basketApi.getByUserId(userId);
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error('Failed to load cart count');
    }
  };

  const handleAuthSuccess = (user: Omit<User, 'password'>): void => {
    setCurrentUser(user);
    if (user.id) {
      loadCartCount(user.id);
    }
  };

  const handleCartClick = (): void => {
    if (!currentUser) {
      setIsAuthOpen(true);
    } else {
      navigate('/basket');
    }
  };

  const handleLogout = (): void => {
    usersApi.logout();
    setCurrentUser(null);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <span>L-Shop</span>
        </div>
        
        <div className="header__search">
          <input 
            type="text" 
            placeholder="Поиск товаров..." 
            className="header__search-input"
          />
        </div>
        
        <div className="header__actions">
          {currentUser ? (
            <>
              <button className="header__btn" onClick={handleLogout}>
                <span>Выйти ({currentUser.name})</span>
              </button>
              <button className="header__btn header__btn_cart" onClick={handleCartClick}>
                <span>Корзина</span>
                {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
              </button>
            </>
          ) : (
            <>
              <button className="header__btn" onClick={() => setIsAuthOpen(true)}>
                <span>Аккаунт</span>
              </button>
              <button className="header__btn header__btn_cart" onClick={handleCartClick}>
                <span>Корзина</span>
              </button>
            </>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </header>
  );
};
