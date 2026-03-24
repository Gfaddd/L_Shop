import fs from 'fs';
import path from 'path';

const DATABASE_PATH = path.join(process.cwd(), 'database');

export const readJsonFile = <T>(filename: string): T[] => {
  const filePath = path.join(DATABASE_PATH, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeJsonFile = <T>(filename: string, data: T[]): void => {
  const filePath = path.join(DATABASE_PATH, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
