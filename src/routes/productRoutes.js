import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  searchProducts, 
  getLowStockProducts 
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { permissions } from '../middleware/rbac.js';
import { validationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes (no authentication needed)
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', validationRules.validateId, handleValidationErrors, getProductById);

// Protected routes - Admin & Superadmin can create/read/update
router.post('/', 
  authenticateToken, 
  permissions.canManageProducts, 
  validationRules.productCreate, 
  handleValidationErrors, 
  createProduct
);

router.put('/:id', 
  authenticateToken, 
  permissions.canManageProducts, 
  validationRules.productUpdate, 
  handleValidationErrors, 
  updateProduct
);

// Protected route - Only Superadmin can delete
router.delete('/:id', 
  authenticateToken, 
  permissions.canDeleteProduct, 
  validationRules.validateId, 
  handleValidationErrors, 
  deleteProduct
);

// Admin features
router.get('/admin/low-stock', 
  authenticateToken, 
  permissions.canManageProducts, 
  getLowStockProducts
);

export default router;