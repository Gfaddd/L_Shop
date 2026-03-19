import { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import * as usersController from '../controllers/users.controller';
import * as basketController from '../controllers/basket.controller';

const router = Router();

router.get('/api/products', productsController.getAllProducts);
router.get('/api/products/categories', productsController.getCategories);
router.get('/api/products/:id', productsController.getProductById);
router.post('/api/products', productsController.createProduct);
router.put('/api/products/:id', productsController.updateProduct);
router.delete('/api/products/:id', productsController.deleteProduct);

router.get('/api/users', usersController.getAllUsers);
router.get('/api/users/:id', usersController.getUserById);
router.post('/api/users', usersController.createUser);
router.post('/api/users/login', usersController.login);
router.put('/api/users/:id', usersController.updateUser);
router.delete('/api/users/:id', usersController.deleteUser);

router.get('/api/basket/:userId', basketController.getBasketByUserId);
router.post('/api/basket/:userId/items', basketController.addItemToBasket);
router.put('/api/basket/:userId/items/:productId', basketController.updateBasketItem);
router.delete('/api/basket/:userId/items/:productId', basketController.removeBasketItem);
router.delete('/api/basket/:userId', basketController.clearBasket);

export default router;
