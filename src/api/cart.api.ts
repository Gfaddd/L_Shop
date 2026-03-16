import type { Cart, CartItem } from '../type/cart';
import { db } from './db';

export const cartApi = {
  async get(userId: string): Promise<Cart | null> {
    const stored = localStorage.getItem(`db_cart_${userId}`);
    if (stored) return JSON.parse(stored);
    return null;
  },

  async save(userId: string, items: CartItem[]): Promise<void> {
    const cart: Cart = {
      userId,
      items,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`db_cart_${userId}`, JSON.stringify(cart));
  },

  async addItem(userId: string, productId: string, quantity: number = 1): Promise<void> {
    const cart = await this.get(userId);
    const items = cart?.items || [];

    const existing = items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }

    await this.save(userId, items);
  },

  async removeItem(userId: string, productId: string): Promise<void> {
    const cart = await this.get(userId);
    if (!cart) return;

    const items = cart.items.filter(item => item.productId !== productId);
    await this.save(userId, items);
  },

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    const cart = await this.get(userId);
    if (!cart) return;

    const item = cart.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      await this.save(userId, cart.items);
    }
  },

  async clear(userId: string): Promise<void> {
    localStorage.removeItem(`db_cart_${userId}`);
  },
};