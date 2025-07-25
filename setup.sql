
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('superadmin', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts Table
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Insert default superadmin user (password: 'admin123')
INSERT INTO users (email, password, role) VALUES 
('superadmin@company.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewF5GAzrJnXgBgBC', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- Sample products for testing
INSERT INTO products (name, description, price, stock, image_url) VALUES 
('Laptop', 'High-performance laptop for development', 999.99, 10, 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Laptop'),
('Mouse', 'Wireless gaming mouse', 49.99, 50, 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Mouse'),
('Keyboard', 'Mechanical keyboard with RGB', 129.99, 25, 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Keyboard'),
('Monitor', '4K Ultra HD Monitor', 299.99, 15, 'https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Monitor'),
('Headphones', 'Noise-canceling headphones', 199.99, 20, 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Headphones')
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Setup completed successfully!' as status;
SELECT 'Users created: ' || COUNT(*) as info FROM users;
SELECT 'Products created: ' || COUNT(*) as info FROM products;