import { Request, Response } from 'express';
import { Product, ProductQueryParams } from '../types';
import * as productsService from '../services/products.service';

export const getAllProducts = (req: Request, res: Response): void => {
  try {
    const params: ProductQueryParams = {
      category: req.query.category as string | string[],
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      inStock: req.query.inStock ? req.query.inStock === 'true' : undefined,
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10
    };

    const { products, total } = productsService.getProductsWithFilters(params);
    
    res.json({
      success: true,
      data: products,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить товары'
    });
  }
};

export const getProductById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const product = productsService.getProductById(id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
      return;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить товар'
    });
  }
};

export const createProduct = (req: Request, res: Response): void => {
  try {
    const productData = req.body as Omit<Product, 'id'>;
    const product = productsService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось создать товар'
    });
  }
};

export const updateProduct = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = productsService.updateProduct(id, updates);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
      return;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось обновить товар'
    });
  }
};

export const deleteProduct = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = productsService.deleteProduct(id);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Товар успешно удален'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось удалить товар'
    });
  }
};

export const getCategories = (req: Request, res: Response): void => {
  try {
    const categories = productsService.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Не удалось получить категории'
    });
  }
};
