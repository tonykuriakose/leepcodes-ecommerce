import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  getAllCarts 
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';
import { permissions } from '../middleware/rbac.js';
import { validationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// User cart routes
router.get('/', getCart);
router.post('/add', validationRules.addToCart, handleValidationErrors, addToCart);
router.put('/item/:itemId', validationRules.updateCartItem, handleValidationErrors, updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);

// Admin route - Only superadmin can view all user carts
router.get('/admin/all', permissions.canViewAllCarts, getAllCarts);

export default router;