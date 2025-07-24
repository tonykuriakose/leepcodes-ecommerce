import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Product Cart API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    availableEndpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

export default router;