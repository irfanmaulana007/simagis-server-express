/**
 * Validation Schemas and Utilities
 * Uses Zod for type-safe validation
 */

import { MenuEnum, ModuleEnum, RoleEnum, SubMenuEnum } from '@prisma/client';
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

// CekGiroFailStatus management schemas
export const cekGiroFailStatusSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(7, 'Code must be at most 7 characters'),
      name: commonSchemas.name,
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro fail status ID').transform(Number),
    }),
    body: z.object({
      code: z
        .string()
        .min(1, 'Code is required')
        .max(7, 'Code must be at most 7 characters')
        .optional(),
      name: commonSchemas.name.optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro fail status ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1, 'Code is required').max(7, 'Code must be at most 7 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro fail status ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
    }),
  }),
};

// Phone management schemas
export const phoneSchemas = {
  create: z.object({
    body: z.object({
      module: z.nativeEnum(ModuleEnum),
      ownerCode: z.string().min(1, 'Owner code is required'),
      phone: z.string().min(1, 'Phone is required').max(50, 'Phone must be at most 50 characters'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid phone ID').transform(Number),
    }),
    body: z.object({
      module: z.nativeEnum(ModuleEnum).optional(),
      ownerCode: z.string().min(1, 'Owner code is required').optional(),
      phone: z
        .string()
        .min(1, 'Phone is required')
        .max(50, 'Phone must be at most 50 characters')
        .optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid phone ID').transform(Number),
    }),
  }),

  getByPhone: z.object({
    params: z.object({
      phone: z.string().min(1, 'Phone is required').max(50, 'Phone must be at most 50 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid phone ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      module: z.nativeEnum(ModuleEnum).optional(),
      ownerCode: z.string().optional(),
    }),
  }),
};

// ExpenseCategory management schemas
export const expenseCategorySchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters'),
      branchCode: commonSchemas.branchCode,
      name: commonSchemas.name,
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid expense category ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters').optional(),
      branchCode: commonSchemas.branchCode.optional(),
      name: commonSchemas.name.optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid expense category ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid expense category ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
    }),
  }),
};

// Member management schemas
export const memberSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
      branchCode: commonSchemas.branchCode,
      name: commonSchemas.name,
      location: z.string().min(1, 'Location is required').max(255, 'Location must be at most 255 characters'),
      email: z.string().email('Invalid email format').max(50, 'Email must be at most 50 characters').optional(),
      debt: z.number().min(0, 'Debt must be at least 0'),
      debtLimit: z.number().min(0, 'Debt limit must be at least 0'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid member ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters').optional(),
      branchCode: commonSchemas.branchCode.optional(),
      name: commonSchemas.name.optional(),
      location: z.string().min(1, 'Location is required').max(255, 'Location must be at most 255 characters').optional(),
      email: z.string().email('Invalid email format').max(50, 'Email must be at most 50 characters').optional(),
      debt: z.number().min(0, 'Debt must be at least 0').optional(),
      debtLimit: z.number().min(0, 'Debt limit must be at least 0').optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid member ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid member ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
    }),
  }),
};

// ProductCategory management schemas
export const productCategorySchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
      branchCode: commonSchemas.branchCode,
      name: commonSchemas.name,
      depreciationYear1: z.number().min(0).optional(),
      depreciationYear2: z.number().min(0).optional(),
      depreciationYear3: z.number().min(0).optional(),
      depreciationYear4: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid product category ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters').optional(),
      branchCode: commonSchemas.branchCode.optional(),
      name: commonSchemas.name.optional(),
      depreciationYear1: z.number().min(0).optional(),
      depreciationYear2: z.number().min(0).optional(),
      depreciationYear3: z.number().min(0).optional(),
      depreciationYear4: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid product category ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid product category ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
    }),
  }),
};

// Supplier management schemas
export const supplierSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
      branchCode: commonSchemas.branchCode,
      name: commonSchemas.name,
      address: z.string().min(1, 'Address is required').max(255, 'Address must be at most 255 characters'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid supplier ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters').optional(),
      branchCode: commonSchemas.branchCode.optional(),
      name: commonSchemas.name.optional(),
      address: z.string().min(1, 'Address is required').max(255, 'Address must be at most 255 characters').optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid supplier ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid supplier ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
    }),
  }),
};

// UserBranchDetail management schemas
export const userBranchDetailSchemas = {
  create: z.object({
    body: z.object({
      branchCode: commonSchemas.branchCode,
      userCode: z.string().min(1, 'User code is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user branch detail ID').transform(Number),
    }),
    body: z.object({
      branchCode: commonSchemas.branchCode.optional(),
      userCode: z.string().min(1, 'User code is required').optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user branch detail ID').transform(Number),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user branch detail ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// UserRefreshToken management schemas
export const userRefreshTokenSchemas = {
  getById: z.object({
    params: z.object({
      id: z.string().uuid('Invalid user refresh token ID'),
    }),
  }),

  revoke: z.object({
    params: z.object({
      id: z.string().uuid('Invalid user refresh token ID'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().uuid('Invalid user refresh token ID'),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      userId: z.string().regex(/^\d+$/, 'Invalid user ID').transform(Number).optional(),
      revoked: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    }),
  }),
};

// CekGiro management schemas
export const cekGiroSchemas = {
  create: z.object({
    body: z.object({
      type: z.string().min(1, 'Type is required').max(50, 'Type must be at most 50 characters'),
      code: z.string().min(1, 'Code is required').max(20, 'Code must be at most 20 characters'),
      accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be at most 50 characters'),
      date: z.string().min(1, 'Date is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro ID').transform(Number),
    }),
    body: z.object({
      type: z.string().min(1, 'Type is required').max(50, 'Type must be at most 50 characters').optional(),
      code: z.string().min(1, 'Code is required').max(20, 'Code must be at most 20 characters').optional(),
      accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be at most 50 characters').optional(),
      date: z.string().min(1, 'Date is required').optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1, 'Code is required').max(20, 'Code must be at most 20 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      type: z.string().optional(),
    }),
  }),
};

// CekGiroOwner management schemas
export const cekGiroOwnerSchemas = {
  create: z.object({
    body: z.object({
      cekGiroCode: z.string().min(1, 'Cek giro code is required'),
      userCode: z.string().min(1, 'User code is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro owner ID').transform(Number),
    }),
    body: z.object({
      cekGiroCode: z.string().min(1, 'Cek giro code is required').optional(),
      userCode: z.string().min(1, 'User code is required').optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro owner ID').transform(Number),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid cek giro owner ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      cekGiroCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// AccountNumber management schemas
export const accountNumberSchemas = {
  create: z.object({
    body: z.object({
      module: z.nativeEnum(ModuleEnum),
      bankCode: commonSchemas.bankCode,
      ownerCode: z.string().min(1, 'Owner code is required'),
      accountName: z.string().min(1, 'Account name is required').max(50, 'Account name must be at most 50 characters'),
      accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be at most 50 characters'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid account number ID').transform(Number),
    }),
    body: z.object({
      module: z.nativeEnum(ModuleEnum).optional(),
      bankCode: commonSchemas.bankCode.optional(),
      ownerCode: z.string().min(1, 'Owner code is required').optional(),
      accountName: z.string().min(1, 'Account name is required').max(50, 'Account name must be at most 50 characters').optional(),
      accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be at most 50 characters').optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid account number ID').transform(Number),
    }),
  }),

  getByAccountNumber: z.object({
    params: z.object({
      accountNumber: z.string().min(1, 'Account number is required').max(50, 'Account number must be at most 50 characters'),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid account number ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      module: z.nativeEnum(ModuleEnum).optional(),
      ownerCode: z.string().optional(),
      bankCode: z.string().optional(),
    }),
  }),
};

// UserPermission management schemas
export const userPermissionSchemas = {
  create: z.object({
    body: z.object({
      role: z.nativeEnum(RoleEnum),
      menu: z.nativeEnum(MenuEnum),
      subMenu: z.nativeEnum(SubMenuEnum),
      view: z.boolean(),
      create: z.boolean(),
      update: z.boolean(),
      delete: z.boolean(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user permission ID').transform(Number),
    }),
    body: z.object({
      role: z.nativeEnum(RoleEnum).optional(),
      menu: z.nativeEnum(MenuEnum).optional(),
      subMenu: z.nativeEnum(SubMenuEnum).optional(),
      view: z.boolean().optional(),
      create: z.boolean().optional(),
      update: z.boolean().optional(),
      delete: z.boolean().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user permission ID').transform(Number),
    }),
  }),

  getByRole: z.object({
    params: z.object({
      role: z.nativeEnum(RoleEnum),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid user permission ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      role: z.nativeEnum(RoleEnum).optional(),
      menu: z.nativeEnum(MenuEnum).optional(),
      subMenu: z.nativeEnum(SubMenuEnum).optional(),
    }),
  }),
};

// CekGiroDetail management schemas (Level 3)
export const cekGiroDetailSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(20, 'Code must be at most 20 characters'),
      cekGiroCode: z.string().min(1, 'Cek giro code is required'),
      accountNumber: z.string().min(1, 'Account number is required').max(50),
      accountName: z.string().min(1, 'Account name is required').max(50),
      amount: z.number().min(0, 'Amount must be at least 0'),
      receiverName: z.string().min(1, 'Receiver name is required').max(50),
      receiverPhone: z.string().max(50).optional(),
      disbursementDate: z.string().min(1, 'Disbursement date is required'),
      handoverDate: z.string().min(1, 'Handover date is required'),
      note: z.string().max(255).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(20).optional(),
      cekGiroCode: z.string().min(1).optional(),
      accountNumber: z.string().min(1).max(50).optional(),
      accountName: z.string().min(1).max(50).optional(),
      amount: z.number().min(0).optional(),
      receiverName: z.string().min(1).max(50).optional(),
      receiverPhone: z.string().max(50).optional(),
      disbursementDate: z.string().min(1).optional(),
      handoverDate: z.string().min(1).optional(),
      note: z.string().max(255).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(20),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      cekGiroCode: z.string().optional(),
    }),
  }),

  getByCekGiroCode: z.object({
    params: z.object({
      cekGiroCode: z.string().min(1, 'Cek giro code is required'),
    }),
  }),
};

// Product management schemas (Level 3)
export const productSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16, 'Code must be at most 16 characters'),
      branchCode: commonSchemas.branchCode,
      productCategoryCode: z.string().min(1, 'Product category code is required'),
      name: commonSchemas.name,
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      productCategoryCode: z.string().min(1).optional(),
      name: commonSchemas.name.optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      productCategoryCode: z.string().optional(),
    }),
  }),
};

// SupplierDiscount management schemas (Level 3)
export const supplierDiscountSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      supplierCode: z.string().min(1, 'Supplier code is required'),
      name: commonSchemas.name,
      amount: z.number().min(0).optional(),
      percentage: z.number().min(0).max(100).optional(),
      validDate: z.string().optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      supplierCode: z.string().min(1).optional(),
      name: commonSchemas.name.optional(),
      amount: z.number().min(0).optional(),
      percentage: z.number().min(0).max(100).optional(),
      validDate: z.string().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      supplierCode: z.string().optional(),
    }),
  }),
};

// CashRegister management schemas (Level 3)
export const cashRegisterSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      branchCode: commonSchemas.branchCode,
      userCode: z.string().min(1, 'User code is required'),
      date: z.string().min(1, 'Date is required'),
      amount: z.number().min(0, 'Amount must be at least 0'),
      p100000: z.number().min(0).optional(),
      p50000: z.number().min(0).optional(),
      p20000: z.number().min(0).optional(),
      p10000: z.number().min(0).optional(),
      p5000: z.number().min(0).optional(),
      p2000: z.number().min(0).optional(),
      p1000: z.number().min(0).optional(),
      p500: z.number().min(0).optional(),
      p200: z.number().min(0).optional(),
      p100: z.number().min(0).optional(),
      p50: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      userCode: z.string().min(1).optional(),
      date: z.string().min(1).optional(),
      amount: z.number().min(0).optional(),
      p100000: z.number().min(0).optional(),
      p50000: z.number().min(0).optional(),
      p20000: z.number().min(0).optional(),
      p10000: z.number().min(0).optional(),
      p5000: z.number().min(0).optional(),
      p2000: z.number().min(0).optional(),
      p1000: z.number().min(0).optional(),
      p500: z.number().min(0).optional(),
      p200: z.number().min(0).optional(),
      p100: z.number().min(0).optional(),
      p50: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// Closing management schemas (Level 3)
export const closingSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      branchCode: commonSchemas.branchCode,
      userCode: z.string().min(1, 'User code is required'),
      date: z.string().min(1, 'Date is required'),
      amount: z.number().min(0, 'Amount must be at least 0'),
      debit: z.number().min(0).optional(),
      p100000: z.number().min(0).optional(),
      p50000: z.number().min(0).optional(),
      p20000: z.number().min(0).optional(),
      p10000: z.number().min(0).optional(),
      p5000: z.number().min(0).optional(),
      p2000: z.number().min(0).optional(),
      p1000: z.number().min(0).optional(),
      p500: z.number().min(0).optional(),
      p200: z.number().min(0).optional(),
      p100: z.number().min(0).optional(),
      p50: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      userCode: z.string().min(1).optional(),
      date: z.string().min(1).optional(),
      amount: z.number().min(0).optional(),
      debit: z.number().min(0).optional(),
      p100000: z.number().min(0).optional(),
      p50000: z.number().min(0).optional(),
      p20000: z.number().min(0).optional(),
      p10000: z.number().min(0).optional(),
      p5000: z.number().min(0).optional(),
      p2000: z.number().min(0).optional(),
      p1000: z.number().min(0).optional(),
      p500: z.number().min(0).optional(),
      p200: z.number().min(0).optional(),
      p100: z.number().min(0).optional(),
      p50: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// Deposit management schemas (Level 3)
export const depositSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      status: z.string().min(1, 'Status is required'),
      branchCode: commonSchemas.branchCode,
      userCode: z.string().min(1, 'User code is required'),
      date: z.string().min(1, 'Date is required'),
      amount: z.number().min(0, 'Amount must be at least 0'),
      note: z.string().optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      status: z.string().min(1).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      userCode: z.string().min(1).optional(),
      date: z.string().min(1).optional(),
      amount: z.number().min(0).optional(),
      note: z.string().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      userCode: z.string().optional(),
      status: z.string().optional(),
    }),
  }),
};

// Expense management schemas (Level 3)
export const expenseSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      branchCode: commonSchemas.branchCode,
      expenseCategoryCode: z.string().min(1, 'Expense category code is required'),
      userCode: z.string().min(1, 'User code is required'),
      date: z.string().min(1, 'Date is required'),
      amount: z.number().min(0, 'Amount must be at least 0'),
      description: z.string().min(1, 'Description is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      expenseCategoryCode: z.string().min(1).optional(),
      userCode: z.string().min(1).optional(),
      date: z.string().min(1).optional(),
      amount: z.number().min(0).optional(),
      description: z.string().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      expenseCategoryCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// ProductDetail management schemas (Level 4)
export const productDetailSchemas = {
  create: z.object({
    body: z.object({
      status: z.string().min(1, 'Status is required'),
      code: z.string().min(1, 'Code is required').max(16),
      productCode: z.string().min(1, 'Product code is required'),
      colorCode: z.string().min(1, 'Color code is required'),
      supplierCode: z.string().min(1, 'Supplier code is required'),
      article: z.string().max(50).optional(),
      size: z.string().min(1, 'Size is required').max(50),
      purchasePrice: z.number().min(0),
      salesPrice: z.number().min(0),
      wholesalePrice: z.number().min(0),
      stock: z.number().min(0),
      purchaseDate: z.string().min(1, 'Purchase date is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      status: z.string().min(1).optional(),
      code: z.string().min(1).max(16).optional(),
      productCode: z.string().min(1).optional(),
      colorCode: z.string().min(1).optional(),
      supplierCode: z.string().min(1).optional(),
      article: z.string().max(50).optional(),
      size: z.string().min(1).max(50).optional(),
      purchasePrice: z.number().min(0).optional(),
      salesPrice: z.number().min(0).optional(),
      wholesalePrice: z.number().min(0).optional(),
      stock: z.number().min(0).optional(),
      purchaseDate: z.string().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      productCode: z.string().optional(),
      colorCode: z.string().optional(),
      supplierCode: z.string().optional(),
      status: z.string().optional(),
    }),
  }),
};

// Promo management schemas (Level 4)
export const promoSchemas = {
  create: z.object({
    body: z.object({
      status: z.string().min(1, 'Status is required'),
      code: z.string().min(1, 'Code is required').max(16),
      branchCode: commonSchemas.branchCode,
      name: commonSchemas.name,
      termsAndCondition: z.string().max(255).optional(),
      amount: z.number().min(0).optional(),
      percentage: z.number().min(0).max(100).optional(),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      status: z.string().min(1).optional(),
      code: z.string().min(1).max(16).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      name: commonSchemas.name.optional(),
      termsAndCondition: z.string().max(255).optional(),
      amount: z.number().min(0).optional(),
      percentage: z.number().min(0).max(100).optional(),
      startDate: z.string().min(1).optional(),
      endDate: z.string().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      status: z.string().optional(),
    }),
  }),
};

// StockOpname management schemas (Level 4)
export const stockOpnameSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(10),
      status: z.string().min(1, 'Status is required'),
      branchCode: commonSchemas.branchCode,
      year: z.number().min(2000).max(2100),
      month: z.number().min(1).max(12),
      createdBy: z.string().min(1, 'Created by is required').max(50),
      updatedBy: z.string().min(1, 'Updated by is required').max(50),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(10).optional(),
      status: z.string().min(1).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      year: z.number().min(2000).max(2100).optional(),
      month: z.number().min(1).max(12).optional(),
      updatedBy: z.string().min(1).max(50).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(10),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      status: z.string().optional(),
      year: z.string().regex(/^\d+$/).transform(Number).optional(),
      month: z.string().regex(/^\d+$/).transform(Number).optional(),
    }),
  }),
};

// StockOpnameDetail management schemas (Level 5)
export const stockOpnameDetailSchemas = {
  create: z.object({
    body: z.object({
      stockOpnameCode: z.string().min(1, 'Stock opname code is required'),
      productDetailCode: z.string().min(1, 'Product detail code is required'),
      stockSystem: z.number().min(0),
      stockActual: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      stockOpnameCode: z.string().min(1).optional(),
      productDetailCode: z.string().min(1).optional(),
      stockSystem: z.number().min(0).optional(),
      stockActual: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      stockOpnameCode: z.string().optional(),
      productDetailCode: z.string().optional(),
    }),
  }),
};

// Order management schemas (Level 5)
export const orderSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      branchCode: commonSchemas.branchCode,
      memberCode: z.string().optional(),
      userCode: z.string().min(1, 'User code is required'),
      promoCode: z.string().optional(),
      totalPrice: z.number().min(0),
      paymentType: z.string().min(1, 'Payment type is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      memberCode: z.string().optional(),
      userCode: z.string().min(1).optional(),
      promoCode: z.string().optional(),
      totalPrice: z.number().min(0).optional(),
      paymentType: z.string().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      memberCode: z.string().optional(),
      userCode: z.string().optional(),
      paymentType: z.string().optional(),
    }),
  }),
};

// Restock management schemas (Level 5)
export const restockSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      status: z.string().min(1, 'Status is required'),
      branchCode: commonSchemas.branchCode,
      userCode: z.string().min(1, 'User code is required'),
      supplierCode: z.string().min(1, 'Supplier code is required'),
      supplierDiscountCode: z.string().optional(),
      purchaseDate: z.string().min(1, 'Purchase date is required'),
      receivedDate: z.string().optional(),
      note: z.string().optional(),
      paymentStatus: z.string().min(1, 'Payment status is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      status: z.string().min(1).optional(),
      branchCode: commonSchemas.branchCode.optional(),
      userCode: z.string().min(1).optional(),
      supplierCode: z.string().min(1).optional(),
      supplierDiscountCode: z.string().optional(),
      purchaseDate: z.string().min(1).optional(),
      receivedDate: z.string().optional(),
      note: z.string().optional(),
      paymentStatus: z.string().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      branchCode: z.string().optional(),
      userCode: z.string().optional(),
      supplierCode: z.string().optional(),
      status: z.string().optional(),
      paymentStatus: z.string().optional(),
    }),
  }),
};

// OrderDetail management schemas (Level 6)
export const orderDetailSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      orderCode: z.string().min(1, 'Order code is required'),
      userCode: z.string().optional(),
      productDetailCode: z.string().min(1, 'Product detail code is required'),
      priceType: commonSchemas.priceType,
      quantity: z.number().min(1),
      discountAmount: z.number().min(0).optional(),
      totalPrice: z.number().min(0),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      orderCode: z.string().min(1).optional(),
      userCode: z.string().optional(),
      productDetailCode: z.string().min(1).optional(),
      priceType: commonSchemas.priceType.optional(),
      quantity: z.number().min(1).optional(),
      discountAmount: z.number().min(0).optional(),
      totalPrice: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      orderCode: z.string().optional(),
      productDetailCode: z.string().optional(),
    }),
  }),
};

// OrderDiscount management schemas (Level 6)
export const orderDiscountSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      orderCode: z.string().min(1, 'Order code is required'),
      userCode: z.string().min(1, 'User code is required'),
      invoiceDiscountAmount: z.number().min(0).optional(),
      productDiscountAmount: z.number().min(0).optional(),
      promoDiscountAmount: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      orderCode: z.string().min(1).optional(),
      userCode: z.string().min(1).optional(),
      invoiceDiscountAmount: z.number().min(0).optional(),
      productDiscountAmount: z.number().min(0).optional(),
      promoDiscountAmount: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      orderCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// Payment management schemas (Level 6)
export const paymentSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      orderCode: z.string().min(1, 'Order code is required'),
      paymentMethod: z.string().min(1, 'Payment method is required'),
      customerAmount: z.number().min(0),
      amount: z.number().min(0),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      orderCode: z.string().min(1).optional(),
      paymentMethod: z.string().min(1).optional(),
      customerAmount: z.number().min(0).optional(),
      amount: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      orderCode: z.string().optional(),
      paymentMethod: z.string().optional(),
    }),
  }),
};

// PaymentBilling management schemas (Level 6)
export const paymentBillingSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      memberCode: z.string().min(1, 'Member code is required'),
      userCode: z.string().min(1, 'User code is required'),
      paymentMethod: z.string().min(1, 'Payment method is required'),
      amount: z.number().min(0),
      discount: z.number().min(0).optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      memberCode: z.string().min(1).optional(),
      userCode: z.string().min(1).optional(),
      paymentMethod: z.string().min(1).optional(),
      amount: z.number().min(0).optional(),
      discount: z.number().min(0).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      memberCode: z.string().optional(),
      userCode: z.string().optional(),
      paymentMethod: z.string().optional(),
    }),
  }),
};

// Refund management schemas (Level 6)
export const refundSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      orderCode: z.string().min(1, 'Order code is required'),
      userCode: z.string().min(1, 'User code is required'),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      orderCode: z.string().min(1).optional(),
      userCode: z.string().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      orderCode: z.string().optional(),
      userCode: z.string().optional(),
    }),
  }),
};

// RestockDetail management schemas (Level 6)
export const restockDetailSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      restockCode: z.string().min(1, 'Restock code is required'),
      productDetailCode: z.string().min(1, 'Product detail code is required'),
      quantity: z.number().min(1),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      restockCode: z.string().min(1).optional(),
      productDetailCode: z.string().min(1).optional(),
      quantity: z.number().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      restockCode: z.string().optional(),
      productDetailCode: z.string().optional(),
    }),
  }),
};

// RestockPayment management schemas (Level 6)
export const restockPaymentSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      restockCode: z.string().min(1, 'Restock code is required'),
      paymentMethod: z.string().min(1, 'Payment method is required'),
      amount: z.number().min(0),
      discount: z.number().min(0).optional(),
      cekGiroDetailCode: z.string().optional(),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      restockCode: z.string().min(1).optional(),
      paymentMethod: z.string().min(1).optional(),
      amount: z.number().min(0).optional(),
      discount: z.number().min(0).optional(),
      cekGiroDetailCode: z.string().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      restockCode: z.string().optional(),
      paymentMethod: z.string().optional(),
    }),
  }),
};

// RefundDetail management schemas (Level 7)
export const refundDetailSchemas = {
  create: z.object({
    body: z.object({
      code: z.string().min(1, 'Code is required').max(16),
      refundCode: z.string().min(1, 'Refund code is required'),
      refundMethod: z.string().min(1, 'Refund method is required'),
      orderDetailCode: z.string().min(1, 'Order detail code is required'),
      quantity: z.number().min(1),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
    body: z.object({
      code: z.string().min(1).max(16).optional(),
      refundCode: z.string().min(1).optional(),
      refundMethod: z.string().min(1).optional(),
      orderDetailCode: z.string().min(1).optional(),
      quantity: z.number().min(1).optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  getByCode: z.object({
    params: z.object({
      code: z.string().min(1).max(16),
    }),
  }),

  delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid ID').transform(Number),
    }),
  }),

  list: z.object({
    query: commonSchemas.pagination.extend({
      search: z.string().optional(),
      refundCode: z.string().optional(),
      orderDetailCode: z.string().optional(),
      refundMethod: z.string().optional(),
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
