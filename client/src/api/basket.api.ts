import api from './api';
import type { Product } from '../types/product';

export interface BasketItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Basket {
  id: string;
  userId: string;
  items: BasketItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BasketResponse {
  success: boolean;
  data: Basket;
}

export const basketApi = {
  getByUserId: async (userId: string): Promise<BasketResponse> => {
    const response = await api.get<BasketResponse>(`/api/basket/${userId}`);
    return response.data;
  },

  addItem: async (userId: string, productId: string, quantity: number = 1): Promise<BasketResponse> => {
    const response = await api.post<BasketResponse>(`/api/basket/${userId}/items`, {
      productId,
      quantity
    });
    return response.data;
  },

  updateItem: async (userId: string, productId: string, quantity: number): Promise<BasketResponse> => {
    const response = await api.put<BasketResponse>(`/api/basket/${userId}/items/${productId}`, {
      quantity
    });
    return response.data;
  },

  removeItem: async (userId: string, productId: string): Promise<BasketResponse> => {
    const response = await api.delete<BasketResponse>(`/api/basket/${userId}/items/${productId}`);
    return response.data;
  },

  clearBasket: async (userId: string): Promise<BasketResponse> => {
    const response = await api.delete<BasketResponse>(`/api/basket/${userId}`);
    return response.data;
  }
};

export default basketApi;
