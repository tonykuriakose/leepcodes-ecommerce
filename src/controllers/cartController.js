import { AppDataSource } from '../config/database.js';
import Cart from '../entities/Cart.js';
import CartItem from '../entities/CartItem.js';
import Product from '../entities/Product.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cartRepository = AppDataSource.getRepository(Cart);
    const cartItemRepository = AppDataSource.getRepository(CartItem);

    let cart = await cartRepository.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = cartRepository.create({ user_id: req.user.id });
      cart = await cartRepository.save(cart);
    }

    const cartItems = await cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.product', 'product')
      .where('cartItem.cart_id = :cartId', { cartId: cart.id })
      .getMany();

    const totalAmount = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      cart: {
        id: cart.id,
        items: cartItems.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url
          },
          quantity: item.quantity,
          subtotal: parseFloat(item.product.price) * item.quantity
        })),
        totalItems: cartItems.length,
        totalAmount: totalAmount.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const cartRepository = AppDataSource.getRepository(Cart);
    const cartItemRepository = AppDataSource.getRepository(CartItem);
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({ where: { id: product_id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await cartRepository.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = cartRepository.create({ user_id: req.user.id });
      cart = await cartRepository.save(cart);
    }

    const existingItem = await cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: product_id }
    });

    let cartItem;
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock for total quantity' });
      }
      
      await cartItemRepository.update(existingItem.id, { quantity: newQuantity });
      cartItem = await cartItemRepository.findOne({ where: { id: existingItem.id } });
    } else {
      cartItem = cartItemRepository.create({
        cart_id: cart.id,
        product_id: product_id,
        quantity: quantity
      });
      cartItem = await cartItemRepository.save(cartItem);
    }

    res.status(201).json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cartItemRepository = AppDataSource.getRepository(CartItem);
    const cartItem = await cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoin('cartItem.cart', 'cart')
      .leftJoinAndSelect('cartItem.product', 'product')
      .where('cartItem.id = :itemId', { itemId: parseInt(itemId) })
      .andWhere('cart.user_id = :userId', { userId: req.user.id })
      .getOne();

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await cartItemRepository.update(parseInt(itemId), { quantity });
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove cart item
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cartItemRepository = AppDataSource.getRepository(CartItem);
    const cartItem = await cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoin('cartItem.cart', 'cart')
      .where('cartItem.id = :itemId', { itemId: parseInt(itemId) })
      .andWhere('cart.user_id = :userId', { userId: req.user.id })
      .getOne();

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItemRepository.delete(parseInt(itemId));
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cartRepository = AppDataSource.getRepository(Cart);
    const cartItemRepository = AppDataSource.getRepository(CartItem);

    const cart = await cartRepository.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cartItemRepository.delete({ cart_id: cart.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all carts
export const getAllCarts = async (req, res) => {
  try {
    const cartRepository = AppDataSource.getRepository(Cart);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [carts, total] = await cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.cartItems', 'cartItems')
      .leftJoinAndSelect('cartItems.product', 'product')
      .skip(skip)
      .take(limit)
      .orderBy('cart.updated_at', 'DESC')
      .getManyAndCount();

    const cartsData = carts.map(cart => ({
      id: cart.id,
      user: {
        id: cart.user.id,
        email: cart.user.email
      },
      itemCount: cart.cartItems.length,
      totalAmount: cart.cartItems.reduce((total, item) => {
        return total + (parseFloat(item.product.price) * item.quantity);
      }, 0).toFixed(2)
    }));

    res.json({
      carts: cartsData,
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