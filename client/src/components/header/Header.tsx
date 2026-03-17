import './index.css';

export const Header: React.FC = () => {
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
          <button className="header__btn">
            <span>Аккаунт</span>
          </button>
          <button className="header__btn">
            <span>Корзина</span>
          </button>
        </div>
      </div>
    </header>
  );
};
