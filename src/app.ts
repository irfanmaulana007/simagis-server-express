/**
 * Express Application Setup
 * Main application configuration with middleware and routes
 */

import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import middleware
import { errorHandler, notFoundHandler } from '~/middleware/errorHandler';
import { sanitize } from '~/utils/validation';

// Import routes
import accountNumberRoutes from '~/routes/accountNumbers';
import authRoutes from '~/routes/auth';
import bankRoutes from '~/routes/banks';
import branchRoutes from '~/routes/branches';
import cashRegisterRoutes from '~/routes/cashRegisters';
import cekGiroFailStatusRoutes from '~/routes/cekGiroFailStatus';
import cekGiroDetailRoutes from '~/routes/cekGiroDetails';
import cekGiroOwnerRoutes from '~/routes/cekGiroOwners';
import cekGiroRoutes from '~/routes/cekGiros';
import closingRoutes from '~/routes/closings';
import colorRoutes from '~/routes/colors';
import depositRoutes from '~/routes/deposits';
import expenseCategoryRoutes from '~/routes/expenseCategories';
import expenseRoutes from '~/routes/expenses';
import memberRoutes from '~/routes/members';
import phoneRoutes from '~/routes/phones';
import productCategoryRoutes from '~/routes/productCategories';
import productDetailRoutes from '~/routes/productDetails';
import productRoutes from '~/routes/products';
import promoRoutes from '~/routes/promos';
import reimbursementTypeRoutes from '~/routes/reimbursementTypes';
import stockOpnameRoutes from '~/routes/stockOpnames';
import supplierDiscountRoutes from '~/routes/supplierDiscounts';
import supplierRoutes from '~/routes/suppliers';
import userBranchDetailRoutes from '~/routes/userBranchDetails';
import userPermissionRoutes from '~/routes/userPermissions';
import userRefreshTokenRoutes from '~/routes/userRefreshTokens';
import userRoutes from '~/routes/users';

// Import utilities
import { ApiResponse } from '~/utils/response';

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, check against allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: ApiResponse.error(
    'TOO_MANY_REQUESTS',
    'Too many requests from this IP, please try again later.'
  ),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitize);

// Health check endpoints
app.get(['/health', '/health-check'], (req, res) => {
  res.status(200).json(
    ApiResponse.success({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    })
  );
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json(
    ApiResponse.success({
      name: 'POS & Warehouse API',
      version: '1.0.0',
      description: 'RESTful API service for POS & Warehouse management system',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        health: '/health',
      },
      documentation: 'See README.md for API documentation',
    })
  );
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/account-numbers', accountNumberRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/cash-registers', cashRegisterRoutes);
app.use('/api/cek-giro-fail-status', cekGiroFailStatusRoutes);
app.use('/api/cek-giro-details', cekGiroDetailRoutes);
app.use('/api/cek-giro-owners', cekGiroOwnerRoutes);
app.use('/api/cek-giros', cekGiroRoutes);
app.use('/api/closings', closingRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/product-details', productDetailRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/reimbursement-types', reimbursementTypeRoutes);
app.use('/api/stock-opnames', stockOpnameRoutes);
app.use('/api/supplier-discounts', supplierDiscountRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/user-branch-details', userBranchDetailRoutes);
app.use('/api/user-permissions', userPermissionRoutes);
app.use('/api/user-refresh-tokens', userRefreshTokenRoutes);

// 404 handler for undefined routes
app.all('*', notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;
