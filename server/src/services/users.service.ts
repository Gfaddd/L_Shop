import bcrypt from 'bcryptjs';
import { User } from '../types';
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from '../utils/helpers';

const USERS_FILE = 'users.json';
const SALT_ROUNDS = 10;

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

export const getUserByPhone = (phone: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.phone === phone);
};

export const getUserByEmailOrPhone = (login: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => 
    u.email.toLowerCase() === login.toLowerCase() || 
    u.phone === login
  );
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const users = getAllUsers();
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  
  const newUser: User = {
    ...user,
    password: hashedPassword,
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

export const authenticateUser = async (login: string, password: string): Promise<User | null> => {
  const user = getUserByEmailOrPhone(login);
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    return user;
  }
  
  return null;
};
