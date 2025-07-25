import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDatabase();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true 
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.json({
    message: 'Product & Cart Management API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      users: '/api/users'
    }
  });
});

app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    suggestion: 'Check if you meant to access /api/* endpoints'
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;