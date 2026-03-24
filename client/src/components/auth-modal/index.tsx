import { useState, type FormEvent } from 'react';
import './index.css';
import { usersApi } from '../../api/users.api';
import type { User } from '../../types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: Omit<User, 'password'>) => void;
}

type LoginMethod = 'phone' | 'email';
type ModalMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<ModalMode>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
      
      setIsLoading(true);
      try {
        const userData = {
          email: login,
          password,
          name,
          phone,
          address
        };
        
        const response = await usersApi.create(userData);
        
        if (response.success && response.data) {
          localStorage.setItem('authToken', 'mock-token');
          localStorage.setItem('user', JSON.stringify(response.data));
          onAuthSuccess?.(response.data);
          onClose();
        } else {
          setError(response.error || 'Ошибка при регистрации');
        }
      } catch (err) {
        setError('Ошибка при регистрации. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const response = await usersApi.login({
          email: login,
          password
        });
        
        if (response.success && response.data) {
          onAuthSuccess?.(response.data);
          onClose();
        } else {
          setError(response.error || 'Ошибка при входе');
        }
      } catch (err) {
        setError('Ошибка при входе. Проверьте email и пароль.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = (): void => {
    setMode(mode === 'login' ? 'register' : 'login');
    setPassword('');
    setConfirmPassword('');
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-modal__close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="auth-modal__title">
          {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === 'login' && (
            <div className="auth-modal__radio-group">
              <label className="auth-modal__radio-label">
                <input
                  type="radio"
                  name="loginMethod"
                  value="email"
                  checked={loginMethod === 'email'}
                  onChange={() => setLoginMethod('email')}
                />
                Электронная почта
              </label>
              <label className="auth-modal__radio-label">
                <input
                  type="radio"
                  name="loginMethod"
                  value="phone"
                  checked={loginMethod === 'phone'}
                  onChange={() => setLoginMethod('phone')}
                />
                Номер телефона
              </label>
            </div>
          )}

          <div className="auth-modal__field">
            <label htmlFor="login">
              {loginMethod === 'email' ? 'Электронная почта' : 'Номер телефона'}
            </label>
            <input
              id="login"
              type={loginMethod === 'email' ? 'email' : 'tel'}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder={loginMethod === 'email' ? 'example@mail.ru' : '+375 (00) 000-00-00'}
              required
            />
          </div>

          <div className="auth-modal__field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="auth-modal__field">
                <label htmlFor="name">Имя</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </div>
              
              <div className="auth-modal__field">
                <label htmlFor="phone">Телефон</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+375 (00) 000-00-00"
                  required
                />
              </div>
              
              <div className="auth-modal__field">
                <label htmlFor="address">Адрес</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ваш адрес"
                  required
                />
              </div>
              
              <div className="auth-modal__field">
                <label htmlFor="confirmPassword">Подтверждение пароля</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="auth-modal__forgot">
              <button type="button" className="auth-modal__forgot-btn">
                Забыли пароль?
              </button>
            </div>
          )}

          {error && (
            <div className="auth-modal__error">
              {error}
            </div>
          )}

          <button type="submit" className="auth-modal__submit" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>

          <button
            type="button"
            className="auth-modal__toggle"
            onClick={toggleMode}
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};
