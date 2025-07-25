import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts, getLowStockProducts } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { permissions } from '../middleware/rbac.js';
import { validationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();


router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', validationRules.validateId, handleValidationErrors, getProductById);


router.post('/', authenticateToken, permissions.canManageProducts, validationRules.productCreate, handleValidationErrors, createProduct);
router.put('/:id', authenticateToken, permissions.canManageProducts, validationRules.productUpdate, handleValidationErrors, updateProduct);
router.delete('/:id', authenticateToken, permissions.canDeleteProduct, validationRules.validateId, handleValidationErrors, deleteProduct);
router.get('/admin/low-stock', authenticateToken, permissions.canManageProducts, getLowStockProducts);

export default router;