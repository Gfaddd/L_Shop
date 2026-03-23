import { Product, ProductQueryParams } from '../types';
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from '../utils/helpers';

const PRODUCTS_FILE = 'products.json';

export const getAllProducts = (): Product[] => {
  return readJsonFile<Product>(PRODUCTS_FILE);
};

export const getProductById = (id: string): Product | undefined => {
  const products = getAllProducts();
  return products.find(p => p.id === id);
};

export const getProductsWithFilters = (params: ProductQueryParams): { products: Product[]; total: number } => {
  let products = getAllProducts();

  if (params.category) {
    const categories = Array.isArray(params.category) ? params.category : [params.category];
    products = products.filter(p => 
      categories.some(c => p.category.toLowerCase() === c.toLowerCase())
    );
  }

  if (params.minPrice !== undefined) {
    products = products.filter(p => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    products = products.filter(p => p.price <= params.maxPrice!);
  }

  if (params.inStock !== undefined) {
    products = products.filter(p => p.inStock === params.inStock);
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower)
    );
  }

  const total = products.length;

  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  products = products.slice(startIndex, endIndex);

  return { products, total };
};

export const createProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getAllProducts();
  const newProduct: Product = {
    ...product,
    id: generateId()
  };
  products.push(newProduct);
  writeJsonFile(PRODUCTS_FILE, products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }

  products[index] = { ...products[index], ...updates };
  writeJsonFile(PRODUCTS_FILE, products);
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = getAllProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (filteredProducts.length === products.length) {
    return false;
  }

  writeJsonFile(PRODUCTS_FILE, filteredProducts);
  return true;
};

export const getCategories = (): string[] => {
  const products = getAllProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
};
