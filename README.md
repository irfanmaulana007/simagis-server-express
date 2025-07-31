# POS & Warehouse API

A RESTful API service built with Node.js, Express.js, TypeScript, and Prisma for Point of Sale (POS) and Warehouse management systems.

## 🚀 Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **User Management**: Complete CRUD operations for user management
- **Role-based Access Control**: Fine-grained permissions based on user roles
- **Type Safety**: Full TypeScript implementation
- **Database Management**: Prisma ORM with PostgreSQL
- **Error Handling**: Centralized error handling with consistent API responses
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Validation**: Zod-based request validation

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd pos-warehouse-api

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pos_warehouse_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

### 4. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Build and start production
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "username": "johndoe",
  "phone": "+1234567890",
  "role": "KASIR",
  "code": "USR001",
  "address": "123 Main St"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### User Management Endpoints

#### Get All Users (Admin only)
```http
GET /api/users?page=1&limit=10&role=KASIR&search=john
Authorization: Bearer your-access-token
```

#### Get User by ID
```http
GET /api/users/1
Authorization: Bearer your-access-token
```

#### Create User (Admin only)
```http
POST /api/users
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "Jane Smith",
  "username": "janesmith",
  "phone": "+1987654321",
  "role": "STAFF_KANTOR",
  "code": "USR002"
}
```

#### Update User
```http
PUT /api/users/1
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1111111111"
}
```

#### Delete User (Admin only)
```http
DELETE /api/users/1
Authorization: Bearer your-access-token
```

#### Get Current User Profile
```http
GET /api/users/profile
Authorization: Bearer your-access-token
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1111111111",
  "address": "456 New St"
}
```

## 🔐 User Roles

- `SUPER_ADMIN`: Full system access
- `OWNER`: Business owner with high-level access
- `PIMPINAN`: Leadership role with management access
- `HEAD_KANTOR`: Office head with staff management
- `KASIR`: Cashier with POS access
- `SALES`: Sales staff with limited access
- `STAFF_KANTOR`: Office staff
- `STAFF_INVENTORY`: Inventory management staff
- `STAFF_WAREHOUSE`: Warehouse operations staff
- `ANGGOTA`: Basic member role

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "metadata": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:reset       # Reset database
npm run prisma:studio      # Open Prisma Studio

# Linting
npm run lint              # Check for linting errors
npm run lint:fix          # Fix linting errors

# Code Formatting
npm run format            # Format code with Prettier
npm run format:check      # Check if code is formatted
npm run format:all        # Format all files in project

# Testing
npm test                  # Run tests
npm run test:watch        # Run tests in watch mode
```

## 🏗️ Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── authController.ts
│   └── userController.ts
├── middleware/           # Express middleware
│   ├── auth.ts          # Authentication middleware
│   └── errorHandler.ts  # Global error handler
├── routes/              # Route definitions
│   ├── auth.ts
│   └── users.ts
├── services/            # Business logic
│   ├── authService.ts
│   └── userService.ts
├── utils/               # Utility functions
│   ├── asyncHandler.ts
│   ├── customErrors.ts
│   ├── jwt.ts
│   ├── password.ts
│   ├── response.ts
│   └── validation.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── config/              # Configuration files
│   └── database.ts
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

## 🐛 Error Handling

The API uses centralized error handling with consistent error codes:

- `VALIDATION_ERROR` (400): Invalid input data
- `AUTHENTICATION_ERROR` (401): Invalid credentials or token
- `AUTHORIZATION_ERROR` (403): Insufficient permissions
- `NOT_FOUND_ERROR` (404): Resource not found
- `CONFLICT_ERROR` (409): Resource already exists
- `TOO_MANY_REQUESTS_ERROR` (429): Rate limit exceeded
- `INTERNAL_SERVER_ERROR` (500): Server error

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input sanitization
- SQL injection prevention (Prisma ORM)

## 📈 Health Check

Check if the API is running:

```http
GET /health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600,
    "environment": "development",
    "version": "1.0.0"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using Node.js, Express.js, TypeScript, and Prisma**
