import { Basket, BasketItem } from '../types';
import { readJsonFile, writeJsonFile, generateId, getCurrentTimestamp } from '../utils/helpers';

const BASKET_FILE = 'basket.json';

export const getAllBaskets = (): Basket[] => {
  return readJsonFile<Basket>(BASKET_FILE);
};

export const getBasketById = (id: string): Basket | undefined => {
  const baskets = getAllBaskets();
  return baskets.find(b => b.id === id);
};

export const getBasketByUserId = (userId: string): Basket | undefined => {
  const baskets = getAllBaskets();
  return baskets.find(b => b.userId === userId);
};

export const createBasket = (userId: string): Basket => {
  const baskets = getAllBaskets();
  const newBasket: Basket = {
    id: generateId(),
    userId,
    items: [],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  baskets.push(newBasket);
  writeJsonFile(BASKET_FILE, baskets);
  return newBasket;
};

export const addItemToBasket = (userId: string, productId: string, quantity: number): Basket => {
  let basket = getBasketByUserId(userId);
  
  if (!basket) {
    basket = createBasket(userId);
  }

  const existingItemIndex = basket.items.findIndex(item => item.productId === productId);
  
  if (existingItemIndex !== -1) {
    basket.items[existingItemIndex].quantity += quantity;
  } else {
    basket.items.push({ productId, quantity });
  }

  basket.updatedAt = getCurrentTimestamp();
  
  const baskets = getAllBaskets();
  const index = baskets.findIndex(b => b.id === basket!.id);
  baskets[index] = basket;
  writeJsonFile(BASKET_FILE, baskets);
  
  return basket;
};

export const updateBasketItem = (userId: string, productId: string, quantity: number): Basket | null => {
  const basket = getBasketByUserId(userId);
  
  if (!basket) {
    return null;
  }

  const itemIndex = basket.items.findIndex(item => item.productId === productId);
  
  if (itemIndex === -1) {
    return null;
  }

  if (quantity <= 0) {
    basket.items.splice(itemIndex, 1);
  } else {
    basket.items[itemIndex].quantity = quantity;
  }

  basket.updatedAt = getCurrentTimestamp();
  
  const baskets = getAllBaskets();
  const index = baskets.findIndex(b => b.id === basket.id);
  baskets[index] = basket;
  writeJsonFile(BASKET_FILE, baskets);
  
  return basket;
};

export const removeBasketItem = (userId: string, productId: string): Basket | null => {
  return updateBasketItem(userId, productId, 0);
};

export const clearBasket = (userId: string): Basket | null => {
  const basket = getBasketByUserId(userId);
  
  if (!basket) {
    return null;
  }

  basket.items = [];
  basket.updatedAt = getCurrentTimestamp();
  
  const baskets = getAllBaskets();
  const index = baskets.findIndex(b => b.id === basket.id);
  baskets[index] = basket;
  writeJsonFile(BASKET_FILE, baskets);
  
  return basket;
};
