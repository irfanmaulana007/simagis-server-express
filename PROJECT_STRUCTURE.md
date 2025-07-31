# Project Structure Documentation

This document provides an overview of the complete project structure created for the POS & Warehouse API.

## 📁 Directory Structure

```
pos-warehouse-api/
├── 📄 Configuration Files
│   ├── package.json                 # Node.js dependencies and scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── .eslintrc.js                # ESLint configuration
│   ├── jest.config.js              # Jest testing configuration
│   ├── .gitignore                  # Git ignore patterns
│   ├── Dockerfile                  # Docker container configuration
│   ├── docker-compose.yml          # Production Docker setup
│   ├── docker-compose.dev.yml      # Development Docker setup
│   └── env.example                 # Environment variables template
│
├── 📂 Source Code (src/)
│   ├── 📂 controllers/             # Request handlers
│   │   ├── authController.ts       # Authentication endpoints
│   │   └── userController.ts       # User management endpoints
│   │
│   ├── 📂 middleware/              # Express middleware
│   │   ├── auth.ts                 # Authentication & authorization
│   │   └── errorHandler.ts        # Global error handling
│   │
│   ├── 📂 routes/                  # Route definitions
│   │   ├── auth.ts                 # Authentication routes
│   │   └── users.ts                # User management routes
│   │
│   ├── 📂 services/                # Business logic
│   │   ├── authService.ts          # Authentication business logic
│   │   └── userService.ts          # User management business logic
│   │
│   ├── 📂 utils/                   # Utility functions
│   │   ├── asyncHandler.ts         # Async error wrapper
│   │   ├── customErrors.ts         # Custom error classes
│   │   ├── jwt.ts                  # JWT token utilities
│   │   ├── password.ts             # Password hashing utilities
│   │   ├── response.ts             # API response utilities
│   │   └── validation.ts           # Request validation schemas
│   │
│   ├── 📂 types/                   # TypeScript definitions
│   │   └── index.ts                # Type definitions and interfaces
│   │
│   ├── 📂 config/                  # Configuration
│   │   └── database.ts             # Database connection setup
│   │
│   ├── app.ts                      # Express application setup
│   └── server.ts                   # Server entry point
│
├── 📂 Database (prisma/)
│   └── schema.prisma               # Database schema definition
│
├── 📂 Tests (tests/)
│   ├── setup.ts                    # Test configuration
│   └── utils/
│       └── password.test.ts        # Example test file
│
├── 📂 Scripts (scripts/)
│   └── setup.sh                    # Development setup script
│
└── 📄 Documentation
    ├── README.md                   # Main documentation
    └── PROJECT_STRUCTURE.md        # This file
```

## 🔧 Key Components

### Authentication System
- **JWT-based Authentication**: Access tokens and refresh tokens
- **Password Security**: bcrypt hashing with salt rounds
- **Role-based Access Control**: Fine-grained permissions
- **Token Management**: Refresh, revoke, and validation

### User Management
- **CRUD Operations**: Complete user lifecycle management
- **Profile Management**: User self-service capabilities
- **Role Management**: Multiple user roles with permissions
- **Search & Filtering**: Advanced user lookup capabilities

### Security Features
- **Error Handling**: Centralized error management
- **Input Validation**: Zod schema validation
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Cross-origin request handling
- **Helmet Security**: HTTP security headers

### Database Integration
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Production-ready database
- **Migrations**: Database version control
- **Connection Management**: Proper connection handling

## 🚀 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/refresh      # Token refresh
POST   /api/auth/logout       # User logout
POST   /api/auth/change-password # Password change
GET    /api/auth/me           # Current user profile
POST   /api/auth/revoke-all   # Revoke all tokens
GET    /api/auth/validate     # Token validation
```

### User Management Endpoints
```
GET    /api/users             # List users (paginated)
POST   /api/users             # Create user
GET    /api/users/:id         # Get user by ID
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
GET    /api/users/profile     # Get current user profile
PUT    /api/users/profile     # Update current user profile
GET    /api/users/role/:role  # Get users by role
GET    /api/users/stats       # User statistics
GET    /api/users/search      # Search users
```

### Utility Endpoints
```
GET    /health                # Health check
GET    /api                   # API information
```

## 🎯 User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `SUPER_ADMIN` | System administrator | Full access |
| `OWNER` | Business owner | High-level management |
| `PIMPINAN` | Leadership role | Management access |
| `HEAD_KANTOR` | Office head | Staff management |
| `KASIR` | Cashier | POS operations |
| `SALES` | Sales staff | Limited sales access |
| `STAFF_KANTOR` | Office staff | Administrative tasks |
| `STAFF_INVENTORY` | Inventory staff | Inventory management |
| `STAFF_WAREHOUSE` | Warehouse staff | Warehouse operations |
| `ANGGOTA` | Basic member | Limited access |

## 🔐 Security Implementation

### Authentication Flow
1. User registers/logs in with credentials
2. Server validates credentials and generates JWT tokens
3. Client receives access token (short-lived) and refresh token (long-lived)
4. Client includes access token in Authorization header for protected routes
5. When access token expires, client uses refresh token to get new tokens

### Authorization Levels
- **Public**: No authentication required
- **Authenticated**: Valid access token required
- **Role-based**: Specific roles required
- **Ownership**: User can only access their own resources
- **Admin**: Administrative privileges required

### Error Handling
- **Consistent Format**: All errors follow the same JSON structure
- **Error Codes**: Standardized error codes for client handling
- **Security**: No sensitive information exposed in error messages
- **Logging**: Comprehensive error logging for debugging

## 🐳 Docker Configuration

### Development Environment
- **PostgreSQL**: Database service on port 5433
- **Redis**: Caching service on port 6380
- **pgAdmin**: Database management on port 5050

### Production Environment
- **API Service**: Node.js application
- **PostgreSQL**: Production database
- **Redis**: Production caching
- **Nginx**: Reverse proxy and load balancer

## 🧪 Testing Setup

### Test Framework
- **Jest**: JavaScript testing framework
- **ts-jest**: TypeScript support for Jest
- **Supertest**: HTTP assertion library (for integration tests)

### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Service Tests**: Business logic testing

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **@prisma/client**: Database client
- **jsonwebtoken**: JWT implementation
- **bcrypt**: Password hashing
- **zod**: Schema validation
- **cors**: Cross-origin support
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting

### Development Dependencies
- **typescript**: TypeScript compiler
- **@types/***: Type definitions
- **jest**: Testing framework
- **eslint**: Code linting
- **prisma**: Database toolkit
- **nodemon**: Development server

## 🚦 Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd pos-warehouse-api
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 📈 Future Enhancements

The current implementation provides a solid foundation for:
- POS transaction management
- Inventory tracking
- Warehouse operations
- Reporting and analytics
- Multi-branch support
- Mobile application support

This architecture is designed to be scalable and maintainable, following industry best practices for API development.