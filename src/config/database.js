import { DataSource } from 'typeorm';
import User from '../entities/User.js';
import Product from '../entities/Product.js';
import Cart from '../entities/Cart.js';
import CartItem from '../entities/CartItem.js';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'product_cart_db',
  synchronize: false, 
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Product, Cart, CartItem],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});


export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
    return AppDataSource;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};