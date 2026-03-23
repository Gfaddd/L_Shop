import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthModal } from '../auth-modal';
import { usersApi } from '../../api/users.api';
import { basketApi } from '../../api/basket.api';
import type { User } from '../../types/user';
import './index.css';

export const Header: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const user = usersApi.getCurrentUser();
    setCurrentUser(user);
    if (user?.id) {
      loadCartCount(user.id);
    }

    const handleStorageChange = () => {
      const currentUser = usersApi.getCurrentUser();
      setCurrentUser(currentUser);
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

  const handleProfileClick = (): void => {
    if (!currentUser) {
      setIsAuthOpen(true);
    } else {
      navigate('/profile');
    }
  };

  const handleLogout = (): void => {
    usersApi.logout();
    setCurrentUser(null);
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams);
      if (searchValue.trim()) {
        currentParams.set('search', searchValue.trim());
      } else {
        currentParams.delete('search');
      }
      currentParams.delete('category');
      currentParams.delete('minPrice');
      currentParams.delete('maxPrice');
      currentParams.delete('inStock');
      setSearchParams(currentParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, setSearchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo" onClick={() => navigate('/')}>
          <span>L-Shop</span>
        </div>
        
        <form className="header__search" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Поиск товаров..." 
            className="header__search-input"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </form>
        
        <div className="header__actions">
          {currentUser ? (
            <>
              <button className="header__btn" onClick={handleProfileClick}>
                <span>Аккаунт</span>
              </button>
              <button className="header__btn header__btn_cart" onClick={handleCartClick}>
                <span>Корзина</span>
                {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
              </button>
              <button className="header__btn header__btn_logout" onClick={handleLogout}>
                <span>Выйти</span>
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
