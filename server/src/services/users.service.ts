import { User } from '../types';
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from '../utils/helpers';

const USERS_FILE = 'users.json';

export const getAllUsers = (): User[] => {
  return readJsonFile<User>(USERS_FILE);
};

export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getAllUsers();
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: getCurrentTimestamp()
  };
  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return null;
  }

  users[index] = { ...users[index], ...updates };
  writeJsonFile(USERS_FILE, users);
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false;
  }

  writeJsonFile(USERS_FILE, filteredUsers);
  return true;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};
