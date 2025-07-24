import { body, param, validationResult } from 'express-validator';


export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};


export const validationRules = {
  userRegister: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .isIn(['superadmin', 'admin'])
      .withMessage('Role must be either superadmin or admin')
  ],

  userLogin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],


  productCreate: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Product name is required and must be less than 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL')
  ],

  productUpdate: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Product ID must be a positive integer'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Product name must be less than 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL')
  ],

  
  addToCart: [
    body('product_id')
      .isInt({ min: 1 })
      .withMessage('Product ID must be a positive integer'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer')
  ],

  updateCartItem: [
    param('itemId')
      .isInt({ min: 1 })
      .withMessage('Cart item ID must be a positive integer'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer')
  ],

  
  validateId: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer')
  ]
};