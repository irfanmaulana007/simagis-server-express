/**
 * Validation Schemas and Utilities
 * Uses Zod for type-safe validation
 */

import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '~/utils/customErrors';

// Common validation schemas
export const commonSchemas = {
  id: z.string().uuid('Invalid ID format'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format'),
  role: z.enum([
    'ANGGOTA',
    'HEAD_KANTOR',
    'KASIR',
    'OWNER',
    'PIMPINAN',
    'SALES',
    'STAFF_KANTOR',
    'STAFF_INVENTORY',
    'STAFF_WAREHOUSE',
    'SUPER_ADMIN',
  ]),
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  bankCode: z.string().length(3, 'Bank code must be exactly 3 characters'),
  branchCode: z.string().length(3, 'Branch code must be exactly 3 characters'),
  colorCode: z.string().length(7, 'Color code must be exactly 7 characters'),
  reimbursementTypeCode: z
    .string()
    .length(7, 'Reimbursement type code must be exactly 7 characters'),
  hexColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color format (e.g., #FF0000)'),
  priceType: z.enum(['ECER', 'GROSIR'], { errorMap: () => ({ message: 'Invalid price type' }) }),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  address: z.string().max(255, 'Address must be at most 255 characters').optional(),
  pagination: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive number')
      .transform(Number)
      .default('1'),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive number')
      .transform(Number)
      .default('10'),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
};

// Authentication schemas
export const authSchemas = {
  register: z.object({
    body: z.object({
      email: commonSchemas.email,
      password: commonSchemas.password,
      name: commonSchemas.name,
      username: commonSchemas.username,
      phone: commonSchemas.phone,
      role: commonSchemas.role,
      address: commonSchemas.address,
      code: commonSchemas.code,
    }),
  }),

  login: z.object({
    body: z.object({
      email: commonSchemas.email,
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
  }),
};

// User management schemas
export const userSchemas = {
  create: z.object({
    body: z.object({
      email: commonSchemas.email,
      password: commonSchemas.password,
      name: commonSchemas.name,
      username: commonSchemas.username,
      phone: commonSchemas.phone,
      role: commonSchemas.role,
      address: commonSchemas.address,
      code: commonSchemas.code,
      expenseLimit: z.number().min(0).optional(),
      discountLimit: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number),
    }),
    body: z.object({
      email: commonSchemas.email.optional(),
      name: commonSchemas.name.optional(),
      username: commonSchemas.username.optional(),
      phone: commonSchemas.phone.optional(),
      role: commonSchemas.role.optional(),
      address: commonSchemas.address,
      expenseLimit: z.number().min(0).optional(),
      discountLimit: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      role: commonSchemas.role.optional(),
      search: z.string().optional(),
    }),
  }),

  updateProfile: z.object({
    body: z.object({
      name: commonSchemas.name.optional(),
      phone: commonSchemas.phone.optional(),
      address: commonSchemas.address,
    }),
  }),

  getByRole: z.object({
    params: z.object({
      role: commonSchemas.role,
    }),
    query: commonSchemas.pagination,
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: commonSchemas.password,
    }),
  }),
};

// Bank management schemas
export const bankSchemas = {
  create: z.object({
    body: z.object({
      code: commonSchemas.bankCode,
      name: commonSchemas.name,
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid bank ID').transform(Number),
    }),
    body: z.object({
      code: commonSchemas.bankCode.optional(),
      name: commonSchemas.name.optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid bank ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: commonSchemas.bankCode,
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid bank ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
    }),
  }),
};

// Branch management schemas
export const branchSchemas = {
  create: z.object({
    body: z.object({
      priceType: commonSchemas.priceType,
      code: commonSchemas.branchCode,
      name: commonSchemas.name,
      phone: z.string().max(50, 'Phone must be at most 50 characters').optional(),
      address: z
        .string()
        .min(1, 'Address is required')
        .max(255, 'Address must be at most 255 characters'),
      img: z.string().optional(),
      depreciationYear1: z.number().min(0).optional(),
      depreciationYear2: z.number().min(0).optional(),
      depreciationYear3: z.number().min(0).optional(),
      depreciationYear4: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid branch ID').transform(Number),
    }),
    body: z.object({
      priceType: commonSchemas.priceType.optional(),
      code: commonSchemas.branchCode.optional(),
      name: commonSchemas.name.optional(),
      phone: z.string().max(50, 'Phone must be at most 50 characters').optional(),
      address: z.string().max(255, 'Address must be at most 255 characters').optional(),
      img: z.string().optional(),
      depreciationYear1: z.number().min(0).optional(),
      depreciationYear2: z.number().min(0).optional(),
      depreciationYear3: z.number().min(0).optional(),
      depreciationYear4: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid branch ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: commonSchemas.branchCode,
    }),
  }),

  getByPriceType: z.object({
    params: z.object({
      priceType: commonSchemas.priceType,
    }),
    query: commonSchemas.pagination,
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid branch ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      priceType: commonSchemas.priceType.optional(),
    }),
  }),
};

// Color management schemas
export const colorSchemas = {
  create: z.object({
    body: z.object({
      code: commonSchemas.hexColor,
      name: commonSchemas.name,
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid color ID').transform(Number),
    }),
    body: z.object({
      code: commonSchemas.hexColor.optional(),
      name: commonSchemas.name.optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid color ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: commonSchemas.colorCode,
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid color ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
    }),
  }),
};

// ReimbursementType management schemas
export const reimbursementTypeSchemas = {
  create: z.object({
    body: z.object({
      code: commonSchemas.reimbursementTypeCode,
      name: commonSchemas.name,
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid reimbursement type ID').transform(Number),
    }),
    body: z.object({
      code: commonSchemas.reimbursementTypeCode.optional(),
      name: commonSchemas.name.optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid reimbursement type ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: commonSchemas.reimbursementTypeCode,
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid reimbursement type ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
    }),
  }),
};

/**
 * Validation middleware factory
 */
export const validate = (
  schema: z.ZodSchema<{ body?: unknown; query?: unknown; params?: unknown }>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request objects with validated data
      if (result.body) req.body = result.body;
      if (result.query) req.query = result.query as typeof req.query;
      if (result.params) req.params = result.params as typeof req.params;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};

        error.errors.forEach(err => {
          const path = err.path.join('.');
          validationErrors[path] = err.message;
        });

        throw new ValidationError('Validation failed', validationErrors);
      }
      next(error);
    }
  };
};

/**
 * Sanitize input to prevent XSS and other attacks
 */
export const sanitizeInput = (input: unknown): unknown => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, unknown> = {};
    const inputRecord = input as Record<string, unknown>;
    for (const key in inputRecord) {
      sanitized[key] = sanitizeInput(inputRecord[key]);
    }
    return sanitized;
  }

  return input;
};

/**
 * Validation middleware for sanitizing input
 */
export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  req.body = sanitizeInput(req.body) as typeof req.body;
  req.query = sanitizeInput(req.query) as typeof req.query;
  req.params = sanitizeInput(req.params) as typeof req.params;
  next();
};
