/**
 * TypeScript Type Definitions and Interfaces
 * Central location for all application types
 */

import { MenuEnum, ModuleEnum, PriceTypeEnum, RoleEnum, SubMenuEnum } from '@prisma/client';

// User-related types
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  username: string;
  phone: string;
  role: RoleEnum;
  address?: string;
  code: string;
  expenseLimit?: number;
  discountLimit?: number;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  username?: string;
  phone?: string;
  role?: RoleEnum;
  address?: string;
  expenseLimit?: number;
  discountLimit?: number;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  username: string;
  phone: string;
  role: RoleEnum;
  address?: string | null;
  code: string;
  expenseLimit?: number | null;
  discountLimit?: number | null;
  point?: number | null;
  balance?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListQuery {
  page?: number | string;
  limit?: number | string;
  role?: RoleEnum;
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role' | 'username' | 'code';
  sortOrder?: 'asc' | 'desc';
}

export interface UserRoleQuery {
  page?: number | string;
  limit?: number | string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role' | 'username' | 'code';
  sortOrder?: 'asc' | 'desc';
}

// Bank-related types
export interface BankResponse {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBankRequest {
  code: string;
  name: string;
}

export interface UpdateBankRequest {
  code?: string;
  name?: string;
}

export interface BankListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Branch-related types
export interface BranchResponse {
  id: number;
  priceType: PriceTypeEnum;
  code: string;
  name: string;
  phone: string | null;
  address: string;
  img: string | null;
  depreciationYear1: number | null;
  depreciationYear2: number | null;
  depreciationYear3: number | null;
  depreciationYear4: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBranchRequest {
  priceType: PriceTypeEnum;
  code: string;
  name: string;
  phone?: string;
  address: string;
  img?: string;
  depreciationYear1?: number;
  depreciationYear2?: number;
  depreciationYear3?: number;
  depreciationYear4?: number;
}

export interface UpdateBranchRequest {
  priceType?: PriceTypeEnum;
  code?: string;
  name?: string;
  phone?: string;
  address?: string;
  img?: string;
  depreciationYear1?: number;
  depreciationYear2?: number;
  depreciationYear3?: number;
  depreciationYear4?: number;
}

export interface BranchListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  priceType?: PriceTypeEnum;
  sortBy?: 'name' | 'code' | 'createdAt' | 'priceType';
  sortOrder?: 'asc' | 'desc';
}

// Color-related types
export interface ColorResponse {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateColorRequest {
  code: string;
  name: string;
}

export interface UpdateColorRequest {
  code?: string;
  name?: string;
}

export interface ColorListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ReimbursementType-related types
export interface ReimbursementTypeResponse {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReimbursementTypeRequest {
  code: string;
  name: string;
}

export interface UpdateReimbursementTypeRequest {
  code?: string;
  name?: string;
}

export interface ReimbursementTypeListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// CekGiroFailStatus-related types
export interface CekGiroFailStatusResponse {
  id: number;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCekGiroFailStatusRequest {
  code: string;
  name: string;
}

export interface UpdateCekGiroFailStatusRequest {
  code?: string;
  name?: string;
}

export interface CekGiroFailStatusListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Phone-related types
export interface PhoneResponse {
  id: number;
  module: ModuleEnum;
  ownerCode: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePhoneRequest {
  module: ModuleEnum;
  ownerCode: string;
  phone: string;
}

export interface UpdatePhoneRequest {
  module?: ModuleEnum;
  ownerCode?: string;
  phone?: string;
}

export interface PhoneListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  module?: ModuleEnum;
  ownerCode?: string;
  sortBy?: 'phone' | 'ownerCode' | 'module' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// UserPermission-related types
export interface UserPermissionResponse {
  id: number;
  role: RoleEnum;
  menu: MenuEnum;
  subMenu: SubMenuEnum;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CreateUserPermissionRequest {
  role: RoleEnum;
  menu: MenuEnum;
  subMenu: SubMenuEnum;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface UpdateUserPermissionRequest {
  role?: RoleEnum;
  menu?: MenuEnum;
  subMenu?: SubMenuEnum;
  view?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface UserPermissionListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  role?: RoleEnum;
  menu?: MenuEnum;
  subMenu?: SubMenuEnum;
  sortBy?: 'role' | 'menu' | 'subMenu' | 'id';
  sortOrder?: 'asc' | 'desc';
}

// Authentication-related types
export interface LoginRequest {
  email: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegisterRequest extends CreateUserRequest {}

export interface LoginResponse {
  user: UserResponse;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

// API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  metadata?: PaginationMetadata;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  metadata: null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | null;
  };
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request context types
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
  code: string;
  name: string;
}

// Database query types
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  role?: RoleEnum;
  search?: string;
  isActive?: boolean;
}

// Service response types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Validation types
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}

// File upload types (for future use)
export interface FileUploadOptions {
  maxSize: number;
  allowedTypes: string[];
  destination: string;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

// Audit log types (for future use)
export interface AuditLogEntry {
  id: string;
  userId: number;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Cache types (for future use)
export interface CacheOptions {
  ttl: number; // Time to live in seconds
  key: string;
}

// Email types (for future use)
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  data?: Record<string, unknown>;
}

// Notification types (for future use)
export interface NotificationOptions {
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

// Export Prisma types for convenience
export type {
  MenuEnum,
  ModuleEnum,
  PaymentMethodEnum,
  PaymentTypeEnum,
  PriceTypeEnum,
  RefundMethodEnum,
  RoleEnum,
  StatusEnum,
  SubMenuEnum,
  User,
} from '@prisma/client';
