import { useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { ProductCard } from '../../components/product-card';
import { productsApi } from '../../api/products.api';
import type { Product } from '../../types/product';
import './index.css';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getAll();
        setProducts(response.data);
      } catch (err) {
        setError('Не удалось загрузить товары');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
      <Header />
      
      <main className="home__main">
        <aside className="home__sidebar">
          <div className="home__filters">
            <h2 className="home__filters-title">Фильтры</h2>
            
            <div className="home__filter-group">
                <h3>Категории</h3>
                <label><input type="checkbox" /> Матрасы</label>
                <label><input type="checkbox" /> Круги</label>
                <label><input type="checkbox" /> Бассейны</label>
                <label><input type="checkbox" /> Оружие водное</label>
                <label><input type="checkbox" /> Лодки</label>
                <label><input type="checkbox" /> Плоты</label>
                <label><input type="checkbox" /> Аксессуары</label>
            </div>
            
            <div className="home__filter-group">
              <h3>Цена</h3>
              <div className="home__price-inputs">
                <input type="number" placeholder="От" />
                <span>-</span>
                <input type="number" placeholder="До" />
              </div>
            </div>
            
            <div className="home__filter-group">
              <h3>Наличие</h3>
              <label><input type="checkbox" /> В наличии</label>
              <label><input type="checkbox" /> Под заказ</label>
            </div>
          </div>
        </aside>
        
        <section className="home__content">
          <div className="home__products-header">
            <h1>Все товары</h1>
            <span>Найдено: {products.length} товаров</span>
          </div>
          
          {loading ? (
            <div className="home__loading">Загрузка...</div>
          ) : error ? (
            <div className="home__error">{error}</div>
          ) : (
            <div className="home__products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
