import api from './api';
import type { User } from '../types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}

export interface UserResponse {
  success: boolean;
  data: Omit<User, 'password'>;
}

export interface UsersListResponse {
  success: boolean;
  data: Omit<User, 'password'>[];
}

export const usersApi = {
  getAll: async (): Promise<UsersListResponse> => {
    const response = await api.get<UsersListResponse>('/api/users');
    return response.data;
  },

  getById: async (id: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/api/users/${id}`);
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/users/login', credentials);
    if (response.data.success && response.data.data) {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  create: async (userData: CreateUserRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/api/users', userData);
    return response.data;
  },

  update: async (id: string, updates: Partial<User>): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/api/users/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/users/${id}`);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): Omit<User, 'password'> | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

export default usersApi;
