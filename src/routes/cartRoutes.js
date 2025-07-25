import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, getAllCarts } from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';
import { permissions } from '../middleware/rbac.js';
import { validationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);


router.get('/', getCart);
router.post('/add', validationRules.addToCart, handleValidationErrors, addToCart);
router.put('/item/:itemId', validationRules.updateCartItem, handleValidationErrors, updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);
router.get('/admin/all', permissions.canViewAllCarts, getAllCarts);

export default router;