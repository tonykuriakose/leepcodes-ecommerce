import { AppDataSource } from '../config/database.js';
import Product from '../entities/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await productRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;
    const productRepository = AppDataSource.getRepository(Product);

    // Check if product exists
    const existingProduct = await productRepository.findOne({ where: { name } });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this name already exists' });
    }

    const product = productRepository.create({
      name,
      description,
      price,
      stock,
      image_url
    });

    const savedProduct = await productRepository.save(product);
    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check name uniqueness if updating name
    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await productRepository.findOne({ where: { name: updateData.name } });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product name already exists' });
      }
    }

    await productRepository.update(parseInt(id), updateData);
    const updatedProduct = await productRepository.findOne({ where: { id: parseInt(id) } });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRepository.delete(parseInt(id));
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const productRepository = AppDataSource.getRepository(Product);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let queryBuilder = productRepository.createQueryBuilder('product');

    if (q) {
      queryBuilder = queryBuilder.where(
        'product.name ILIKE :search OR product.description ILIKE :search',
        { search: `%${q}%` }
      );
    }

    if (minPrice) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice: parseFloat(minPrice) });
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: parseFloat(maxPrice) });
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(parseInt(limit))
      .orderBy('product.created_at', 'DESC')
      .getManyAndCount();

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository.createQueryBuilder('product')
      .where('product.stock <= :threshold', { threshold: parseInt(threshold) })
      .orderBy('product.stock', 'ASC')
      .getMany();

    res.json({ products, threshold: parseInt(threshold) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};