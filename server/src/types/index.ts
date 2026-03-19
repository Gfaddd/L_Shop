export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface Basket {
  id: string;
  userId: string;
  items: BasketItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
