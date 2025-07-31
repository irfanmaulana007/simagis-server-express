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
import authRoutes from '~/routes/auth';
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

// Health check endpoint
app.get('/health', (req, res) => {
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

// 404 handler for undefined routes
app.all('*', notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

export default app;
