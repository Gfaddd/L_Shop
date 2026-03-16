import type { Product } from '../type/product';
import { db } from './db';

export const productsApi = {
  async getAll(): Promise<Product[]> {
    return db.getLocal<Product>('products.json');
  },

  async getById(id: string): Promise<Product | undefined> {
    return db.getById<Product>('products.json', id);
  },

  async search(query: string): Promise<Product[]> {
    const products = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(lowerQuery) ||
           p.description.toLowerCase().includes(lowerQuery)
    );
  },

  async filterByCategory(category: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.category === category);
  },

  async filterInStock(): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.inStock);
  },

  async sortByPrice(asc: boolean = true): Promise<Product[]> {
    const products = await this.getAll();
    return products.sort((a, b) => asc ? a.price - b.price : b.price - a.price);
  },
};