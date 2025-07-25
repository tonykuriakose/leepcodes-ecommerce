import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, logout, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();


router.post('/register', validationRules.userRegister, handleValidationErrors, register);
router.post('/login', validationRules.userLogin, handleValidationErrors, login);
// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);
router.put('/change-password', 
  authenticateToken, 
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ], 
  handleValidationErrors, 
  changePassword
);

export default router;