import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/product-card';
import { productsApi, type ProductQueryParams } from '../../api/products.api';
import type { Product } from '../../types/product';
import './index.css';

const CATEGORIES = ['Матрасы', 'Круги', 'Бассейны', 'Оружие водное', 'Лодки', 'Плоты', 'Аксессуары'];

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams] = useSearchParams();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [onlyInStock, setOnlyInStock] = useState(false);

  const searchFromUrl = searchParams.get('search') || '';

  useEffect(() => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setOnlyInStock(false);
  }, [searchFromUrl]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: ProductQueryParams = {};
      
      if (searchFromUrl) {
        params.search = searchFromUrl;
      }
      
      if (selectedCategories.length > 0) {
        params.category = selectedCategories;
      }
      
      if (priceRange.min) {
        params.minPrice = Number(priceRange.min);
      }
      if (priceRange.max) {
        params.maxPrice = Number(priceRange.max);
      }
      
      if (onlyInStock) {
        params.inStock = true;
      }
      
      const response = await productsApi.getAll(params);
      setProducts(response.data);
      setTotalCount(response.total);
    } catch (err) {
      setError('Не удалось загрузить товары');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchFromUrl, selectedCategories, priceRange, onlyInStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, searchParams]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setOnlyInStock(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    if (value && Number(value) < 0) return;
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="home">
      <main className="home__main">
        <aside className="home__sidebar">
          <div className="home__filters">
            <h2 className="home__filters-title">Фильтры</h2>
            
            <div className="home__filter-group">
                <h3>Категории</h3>
                {CATEGORIES.map(category => (
                  <label key={category}>
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
            </div>
            
            <div className="home__filter-group">
              <h3>Цена</h3>
              <div className="home__price-inputs">
                <input 
                  type="number" 
                  placeholder="От"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="До"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                />
              </div>
            </div>
            
            <div className="home__filter-group">
              <h3>Наличие</h3>
              <label>
                <input 
                  type="checkbox" 
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                Только в наличии
              </label>
            </div>
            
            <button 
              className="home__reset-btn"
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </button>
          </div>
        </aside>
        
        <section className="home__content">
          <div className="home__products-header">
            <h1>
              {searchFromUrl ? `Результаты поиска: "${searchFromUrl}"` : 'Все товары'}
            </h1>
            <span>Найдено: {totalCount} товаров</span>
          </div>
          
          {loading ? (
            <div className="home__loading">Загрузка...</div>
          ) : error ? (
            <div className="home__error">{error}</div>
          ) : products.length === 0 ? (
            <div className="home__empty">Товары не найдены. Попробуйте изменить параметры поиска.</div>
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
