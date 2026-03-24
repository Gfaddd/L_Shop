import { useState } from 'react';
import type { Product } from '../../types/product';
import { basketApi } from '../../api/basket.api';
import { usersApi } from '../../api/users.api';
import './index.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    const user = usersApi.getCurrentUser();
    if (!user) {
      alert('Войдите в аккаунт, чтобы добавить товар в корзину');
      return;
    }

    try {
      setAdding(true);
      await basketApi.addItem(user.id, product.id, 1);
      alert('Товар добавлен в корзину');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      alert('Не удалось добавить товар в корзину');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card__image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">📦</div>
        )}
      </div>
      <div className="product-card__content">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{product.price} ₽</span>
          <span className={`product-card__stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>
        <button 
          className="product-card__add-btn" 
          onClick={handleAddToCart}
          disabled={!product.inStock || adding}
        >
          {adding ? 'Добавляю...' : 'В корзину'}
        </button>
      </div>
    </div>
  );
};
