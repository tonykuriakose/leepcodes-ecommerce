# Leepcodes E-commerce Backend

## 🚀 Features

- JWT-based Authentication
- Role-based Access Control (superadmin, admin)
- Product Module with full/partial CRUD
- Cart Module (user-specific)
- Admin User Management (only by superadmin)
- Secure password handling with bcrypt
- Organized MVC project structure


## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- bcrypt
- JWT

## 🔧 Setup Instructions

### 1. Clone the repository

git clone https://github.com/tonykuriakose/leepcodes-ecommerce
cd leepcodes-ecommerce

### 2. Install dependencies


npm install


### 3. Configure environment variables

Create a `.env` file in the root directory and add the following:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=9061
DB_NAME=product_cart_db
JWT_SECRET=mySecret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000


### 4. Run migrations

npm run typeorm migration:run

### 5. Start the server

npm run dev

The backend will be running at `http://localhost:5000`.


## API Documentation

* API documentation is available in the `API_DOC.md` file.


##  Roles & Permissions

| Role       | Permissions                                          |
| ---------- | ---------------------------------------------------- |
| superadmin | Create, Read, Update, Delete products, Create admins |
| admin      | Create, Read, Update products only                   |