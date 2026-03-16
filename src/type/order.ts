import type { CartItem } from "./cart";
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: string;
  phone: string;
  email: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}