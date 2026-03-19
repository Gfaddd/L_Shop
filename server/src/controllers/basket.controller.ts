import { Request, Response } from 'express';
import * as basketService from '../services/basket.service';
import * as productsService from '../services/products.service';

export const getBasketByUserId = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    let basket = basketService.getBasketByUserId(userId);
    
    if (!basket) {
      basket = basketService.createBasket(userId);
    }

    const enrichedItems = basket.items.map(item => {
      const product = productsService.getProductById(item.productId);
      return {
        ...item,
        product
      };
    });

    res.json({
      success: true,
      data: {
        ...basket,
        items: enrichedItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить корзину'
    });
  }
};

export const addItemToBasket = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      res.status(400).json({
        success: false,
        error: 'ID товара обязателен'
      });
      return;
    }

    const product = productsService.getProductById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
      return;
    }

    const basket = basketService.addItemToBasket(userId, productId, quantity);
    
    const enrichedItems = basket.items.map(item => {
      const prod = productsService.getProductById(item.productId);
      return {
        ...item,
        product: prod
      };
    });

    res.json({
      success: true,
      data: {
        ...basket,
        items: enrichedItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось добавить товар в корзину'
    });
  }
};

export const updateBasketItem = (req: Request, res: Response): void => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      res.status(400).json({
        success: false,
        error: 'Количество обязательно'
      });
      return;
    }

    const basket = basketService.updateBasketItem(userId, productId, quantity);
    
    if (!basket) {
      res.status(404).json({
        success: false,
        error: 'Корзина или товар не найдены'
      });
      return;
    }

    const enrichedItems = basket.items.map(item => {
      const product = productsService.getProductById(item.productId);
      return {
        ...item,
        product
      };
    });

    res.json({
      success: true,
      data: {
        ...basket,
        items: enrichedItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось обновить товар в корзине'
    });
  }
};

export const removeBasketItem = (req: Request, res: Response): void => {
  try {
    const { userId, productId } = req.params;
    const basket = basketService.removeBasketItem(userId, productId);
    
    if (!basket) {
      res.status(404).json({
        success: false,
        error: 'Корзина или товар не найдены'
      });
      return;
    }

    const enrichedItems = basket.items.map(item => {
      const product = productsService.getProductById(item.productId);
      return {
        ...item,
        product
      };
    });

    res.json({
      success: true,
      data: {
        ...basket,
        items: enrichedItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось удалить товар из корзины'
    });
  }
};

export const clearBasket = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    const basket = basketService.clearBasket(userId);
    
    if (!basket) {
      res.status(404).json({
        success: false,
        error: 'Корзина не найдена'
      });
      return;
    }

    res.json({
      success: true,
      data: basket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось очистить корзину'
    });
  }
};
