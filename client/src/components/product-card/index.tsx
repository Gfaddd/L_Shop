import type { Product } from '../../types/product';
import './index.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
      </div>
    </div>
  );
};
