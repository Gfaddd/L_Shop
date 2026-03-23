import api from './api';
import type { Product } from '../types/product';

export interface ProductQueryParams {
  category?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>('/api/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await api.get<{ success: boolean; data: Product }>(`/api/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>('/api/products/categories');
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>): Promise<{ success: boolean; data: Product }> => {
    const response = await api.post<{ success: boolean; data: Product }>('/api/products', product);
    return response.data;
  },

  update: async (id: string, updates: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
    const response = await api.put<{ success: boolean; data: Product }>(`/api/products/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/products/${id}`);
    return response.data;
  }
};

export default productsApi;
