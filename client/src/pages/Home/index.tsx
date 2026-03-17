import { Header } from '../../components/header';
import { ProductCard } from '../../components/product-card';
import type { Product } from '../../types/product';
import './index.css';

const mockProducts: Product[] = [
  { id: '1', name: 'Надувной матрас "Wave"', description: 'Двухместный надувной матрас с подголовниками', price: 2990, category: 'Матрасы', inStock: true },
  { id: '2', name: 'Круг надувной "Sea"', description: 'Диаметр 100 см, яркий дизайн', price: 890, category: 'Круги', inStock: true },
  { id: '3', name: 'Бассейн надувной 305 см', description: 'Семейный бассейн с лестницей', price: 8990, category: 'Бассейны', inStock: true },
  { id: '4', name: 'Водный пистолет "Aqua Blast"', description: 'С дальностью стрельбы до 8 метров', price: 1490, category: 'Оружие водное', inStock: false },
  { id: '5', name: 'Надувная лодка "Dolphin"', description: 'Для 2 человек, с веслами', price: 4990, category: 'Лодки', inStock: true },
  { id: '6', name: 'Очки для плавания', description: 'Антизапотевающие, герметичные', price: 590, category: 'Аксессуары', inStock: true },
  { id: '7', name: 'Ласты детские', description: 'Размер S, яркие цвета', price: 390, category: 'Аксессуары', inStock: true },
  { id: '8', name: 'Надувной плот "River"', description: 'Для 4 человек, с моторным креплением', price: 12990, category: 'Плоты', inStock: false },
];

export const Home: React.FC = () => {
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
            <span>Найдено: {mockProducts.length} товаров</span>
          </div>
          
          <div className="home__products-grid">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
