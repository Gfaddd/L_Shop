import type { Order } from '../type/order';
import { db } from './db';

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    return db.getLocal<Order>('orders.json');
  },

  async create(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const orders = await this.getAll();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    await db.saveLocal('orders.json', orders);
    return newOrder;
  },

  async getById(id: string): Promise<Order | undefined> {
    const orders = await this.getAll();
    return orders.find(order => order.id === id);
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const orders = await this.getAll();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      await db.saveLocal('orders.json', orders);
    }
  },
};