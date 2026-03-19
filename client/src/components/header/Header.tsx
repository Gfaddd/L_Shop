import { useState, useEffect } from 'react';
import { AuthModal } from '../auth-modal';
import { usersApi } from '../../api/users.api';
import type { User } from '../../types/user';
import './index.css';

export const Header: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);

  useEffect(() => {
    const user = usersApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleAuthSuccess = (user: Omit<User, 'password'>): void => {
    setCurrentUser(user);
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
              <button className="header__btn header__btn_cart">
                <span>Корзина</span>
                <span className="header__cart-count">0</span>
              </button>
            </>
          ) : (
            <>
              <button className="header__btn" onClick={() => setIsAuthOpen(true)}>
                <span>Аккаунт</span>
              </button>
              <button className="header__btn header__btn_cart">
                <span>Корзина</span>
                <span className="header__cart-count">0</span>
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
