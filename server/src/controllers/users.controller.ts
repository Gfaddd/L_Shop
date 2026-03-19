import { Request, Response } from 'express';
import { User } from '../types';
import * as usersService from '../services/users.service';

export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const users = usersService.getAllUsers();
    
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    
    res.json({
      success: true,
      data: usersWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить пользователей'
    });
  }
};

export const getUserById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const user = usersService.getUserById(id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить пользователя'
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body as Omit<User, 'id' | 'createdAt'>;
    
    const existingUser = usersService.getUserByEmail(userData.email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'Email уже существует'
      });
      return;
    }
    
    const user = await usersService.createUser(userData);
    
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось создать пользователя'
    });
  }
};

export const updateUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    delete updates.password;
    
    const user = usersService.updateUser(id, updates);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось обновить пользователя'
    });
  }
};

export const deleteUser = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = usersService.deleteUser(id);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Пользователь успешно удален'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось удалить пользователя'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email/телефон и пароль обязательны'
      });
      return;
    }
    
    const user = await usersService.authenticateUser(email, password);
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось войти'
    });
  }
};
