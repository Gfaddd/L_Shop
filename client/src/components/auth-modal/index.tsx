import { useState, type FormEvent } from 'react';
import './index.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginMethod = 'phone' | 'email';
type ModalMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<ModalMode>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      console.log('Register:', { loginMethod, login, password });
    } else {
      console.log('Login:', { loginMethod, login, password });
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
          )}

          {mode === 'login' && (
            <div className="auth-modal__forgot">
              <button type="button" className="auth-modal__forgot-btn">
                Забыли пароль?
              </button>
            </div>
          )}

          <button type="submit" className="auth-modal__submit">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
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
