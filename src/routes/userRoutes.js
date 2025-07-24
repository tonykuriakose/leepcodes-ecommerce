import express from 'express';
import { body } from 'express-validator';
import { 
  getAllUsers, 
  getUserById, 
  createAdmin, 
  updateUserRole, 
  deleteUser, 
  updateProfile, 
  getUserStats, 
  searchUsers 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { permissions, requireRole } from '../middleware/rbac.js';
import { validationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// User profile routes (any authenticated user)
router.put('/profile', 
  [
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email')
  ], 
  handleValidationErrors, 
  updateProfile
);

// Superadmin only routes
router.get('/', requireRole(['superadmin']), getAllUsers);
router.get('/search', requireRole(['superadmin']), searchUsers);
router.get('/stats', requireRole(['superadmin']), getUserStats);
router.get('/:id', requireRole(['superadmin']), validationRules.validateId, handleValidationErrors, getUserById);

router.post('/create-admin', 
  requireRole(['superadmin']), 
  permissions.canCreateAdmin,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ], 
  handleValidationErrors, 
  createAdmin
);

router.put('/:id/role', 
  requireRole(['superadmin']), 
  [
    body('role').isIn(['superadmin', 'admin']).withMessage('Role must be superadmin or admin')
  ], 
  handleValidationErrors, 
  updateUserRole
);

router.delete('/:id', 
  requireRole(['superadmin']), 
  validationRules.validateId, 
  handleValidationErrors, 
  deleteUser
);

export default router;