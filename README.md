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

PORT=5000
DATABASE_URL=postgres://your_postgres_user:your_password@localhost:5432/your_database
JWT_SECRET=mySecret


### 4. Run migrations


npm run typeorm migration:run

### 5. Start the server

npm run dev


The backend will be running at `http://localhost:5000`.

## 📂 Folder Structure

.
├── controllers
├── middleware
├── models
├── routes
├── utils
├── config
└── index.js
```

---

## 📄 API Documentation

* API documentation is available in the `API_DOC.md` file.


## 🧑‍🤝 Roles & Permissions

| Role       | Permissions                                          |
| ---------- | ---------------------------------------------------- |
| superadmin | Create, Read, Update, Delete products, Create admins |
| admin      | Create, Read, Update products only                   |