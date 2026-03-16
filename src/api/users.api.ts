import type { User } from '../type/user';
import { db } from './db';

export const usersApi = {
  async getAll(): Promise<User[]> {
    return db.getLocal<User>('users.json');
  },

  async getById(id: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  },

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = await this.getAll();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await db.saveLocal('users.json', users);
    return newUser;
  },

  async findByLogin(login: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(user => user.login === login);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find(user => user.email === email);
  },
};