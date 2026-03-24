import { Request, Response } from 'express';
import { User, Order, OrderItem } from '../types';
import * as usersService from '../services/users.service';
import * as productsService from '../services/products.service';

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
    const userData = req.body as Omit<User, 'id' | 'createdAt' | 'orderHistory'>;
    
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
    delete updates.orderHistory;
    
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

export const addOrder = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { items, totalAmount } = req.body as { items: OrderItem[]; totalAmount: number };
    
    const user = usersService.getUserById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => {
      const product = productsService.getProductById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product?.price || 0
      };
    });

    const order = usersService.addOrderToHistory(id, {
      items: orderItems,
      totalAmount,
      status: 'completed'
    });

    if (!order) {
      res.status(500).json({
        success: false,
        error: 'Не удалось создать заказ'
      });
      return;
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось создать заказ'
    });
  }
};

export const getOrderHistory = (req: Request, res: Response): void => {
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

    const ordersWithProducts = user.orderHistory.map((order) => {
      const itemsWithProducts = order.items.map((item) => {
        const product = productsService.getProductById(item.productId);
        return {
          ...item,
          product: product ? {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            inStock: product.inStock,
            image: product.image
          } : undefined
        };
      });
      return {
        ...order,
        items: itemsWithProducts
      };
    });

    res.json({
      success: true,
      data: ordersWithProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить историю заказов'
    });
  }
};
