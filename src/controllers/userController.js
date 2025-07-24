import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database.js';
import User from '../entities/User.js';
import Cart from '../entities/Cart.js';

// Get all users (superadmin only)
export const getAllUsers = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await userRepository.findAndCount({
      select: ['id', 'email', 'role', 'created_at', 'updated_at'],
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });

    res.json({
      users,
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

// Get user by ID (superadmin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      select: ['id', 'email', 'role', 'created_at', 'updated_at']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create admin user (superadmin only)
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    // Check if user exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = userRepository.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });
    const savedUser = await userRepository.save(user);

    // Create cart for admin
    const cartRepository = AppDataSource.getRepository(Cart);
    const cart = cartRepository.create({ user_id: savedUser.id });
    await cartRepository.save(cart);

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role (superadmin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    // Validate role
    if (!['superadmin', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    await userRepository.update(parseInt(id), { role });
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (superadmin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting own account
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Prevent deleting superadmins
    if (user.role === 'superadmin') {
      return res.status(400).json({ message: 'Cannot delete superadmin users' });
    }

    await userRepository.delete(parseInt(id));
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    // Check email uniqueness
    if (email) {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    await userRepository.update(req.user.id, { email });
    
    const updatedUser = await userRepository.findOne({
      where: { id: req.user.id },
      select: ['id', 'email', 'role', 'created_at', 'updated_at']
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user stats (superadmin only)
export const getUserStats = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const stats = await userRepository
      .createQueryBuilder('user')
      .select([
        'COUNT(*) as total_users',
        'COUNT(CASE WHEN role = \'superadmin\' THEN 1 END) as superadmin_count',
        'COUNT(CASE WHEN role = \'admin\' THEN 1 END) as admin_count'
      ])
      .getRawOne();

    const userStats = {
      total_users: parseInt(stats.total_users),
      superadmin_count: parseInt(stats.superadmin_count),
      admin_count: parseInt(stats.admin_count)
    };

    res.json({ stats: userStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search users (superadmin only)
export const searchUsers = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 10 } = req.query;
    const userRepository = AppDataSource.getRepository(User);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let queryBuilder = userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.role', 'user.created_at', 'user.updated_at']);

    if (q) {
      queryBuilder = queryBuilder.where('user.email ILIKE :email', { email: `%${q}%` });
    }

    if (role && ['superadmin', 'admin'].includes(role)) {
      if (q) {
        queryBuilder = queryBuilder.andWhere('user.role = :role', { role });
      } else {
        queryBuilder = queryBuilder.where('user.role = :role', { role });
      }
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(parseInt(limit))
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();

    res.json({
      users,
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