// Role-Based Access Control Middleware

// Check if user has required role
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};


// Specific permission checks
export const permissions = {
  // Only superadmin can delete products
  canDeleteProduct: (req, res, next) => {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can delete products'
      });
    }
    next();
  },

  // Only superadmin can create admin users
  canCreateAdmin: (req, res, next) => {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can create admin users'
      });
    }
    next();
  },

  // Both superadmin and admin can manage products (except delete)
  canManageProducts: (req, res, next) => {
    if (!['superadmin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    next();
  },

  // Only superadmin can view all user carts
  canViewAllCarts: (req, res, next) => {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can view all user carts'
      });
    }
    next();
  }
};