/**
 * TypeScript Type Definitions and Interfaces
 * Central location for all application types
 */

import {
  MenuEnum,
  ModuleEnum,
  PaymentMethodEnum,
  PaymentTypeEnum,
  PriceTypeEnum,
  RefundMethodEnum,
  RoleEnum,
  StatusEnum,
  SubMenuEnum,
} from '@prisma/client';

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
  email: string | null;
  name: string;
  username: string;
  phone: string | null;
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

// CekGiro-related types
export interface CekGiroResponse {
  id: number;
  type: string;
  code: string;
  accountNumber: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  CekGiroDetail?: unknown[];
  CekGiroOwner?: unknown[];
}

export interface CreateCekGiroRequest {
  type: string;
  code: string;
  accountNumber: string;
  date: string | Date;
}

export interface UpdateCekGiroRequest {
  type?: string;
  code?: string;
  accountNumber?: string;
  date?: string | Date;
}

export interface CekGiroListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  type?: string;
  sortBy?: 'code' | 'type' | 'accountNumber' | 'date' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// CekGiroOwner-related types
export interface CekGiroOwnerResponse {
  id: number;
  cekGiroCode: string;
  userCode: string;
  createdAt: Date;
  updatedAt: Date;
  cekGiro?: {
    id: number;
    code: string;
    type: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateCekGiroOwnerRequest {
  cekGiroCode: string;
  userCode: string;
}

export interface UpdateCekGiroOwnerRequest {
  cekGiroCode?: string;
  userCode?: string;
}

export interface CekGiroOwnerListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  cekGiroCode?: string;
  userCode?: string;
  sortBy?: 'cekGiroCode' | 'userCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ExpenseCategory-related types
export interface ExpenseCategoryResponse {
  id: number;
  code: string;
  branchCode: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateExpenseCategoryRequest {
  code: string;
  branchCode: string;
  name: string;
}

export interface UpdateExpenseCategoryRequest {
  code?: string;
  branchCode?: string;
  name?: string;
}

export interface ExpenseCategoryListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  sortBy?: 'code' | 'name' | 'branchCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Member-related types
export interface MemberResponse {
  id: number;
  code: string;
  branchCode: string;
  name: string;
  location: string;
  email: string | null;
  debt: number;
  debtLimit: number;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateMemberRequest {
  code: string;
  branchCode: string;
  name: string;
  location: string;
  email?: string;
  debt: number;
  debtLimit: number;
}

export interface UpdateMemberRequest {
  code?: string;
  branchCode?: string;
  name?: string;
  location?: string;
  email?: string;
  debt?: number;
  debtLimit?: number;
}

export interface MemberListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  sortBy?: 'code' | 'name' | 'branchCode' | 'debt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ProductCategory-related types
export interface ProductCategoryResponse {
  id: number;
  code: string;
  branchCode: string;
  name: string;
  depreciationYear1: number | null;
  depreciationYear2: number | null;
  depreciationYear3: number | null;
  depreciationYear4: number | null;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateProductCategoryRequest {
  code: string;
  branchCode: string;
  name: string;
  depreciationYear1?: number;
  depreciationYear2?: number;
  depreciationYear3?: number;
  depreciationYear4?: number;
}

export interface UpdateProductCategoryRequest {
  code?: string;
  branchCode?: string;
  name?: string;
  depreciationYear1?: number;
  depreciationYear2?: number;
  depreciationYear3?: number;
  depreciationYear4?: number;
}

export interface ProductCategoryListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  sortBy?: 'code' | 'name' | 'branchCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Supplier-related types
export interface SupplierResponse {
  id: number;
  code: string;
  branchCode: string;
  name: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateSupplierRequest {
  code: string;
  branchCode: string;
  name: string;
  address: string;
}

export interface UpdateSupplierRequest {
  code?: string;
  branchCode?: string;
  name?: string;
  address?: string;
}

export interface SupplierListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  sortBy?: 'code' | 'name' | 'branchCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// UserBranchDetail-related types
export interface UserBranchDetailResponse {
  id: number;
  branchCode: string;
  userCode: string;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateUserBranchDetailRequest {
  branchCode: string;
  userCode: string;
}

export interface UpdateUserBranchDetailRequest {
  branchCode?: string;
  userCode?: string;
}

export interface UserBranchDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  userCode?: string;
  sortBy?: 'branchCode' | 'userCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// UserRefreshToken-related types
export interface UserRefreshTokenResponse {
  id: string;
  hashedToken: string;
  userId: number;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    code: string;
    name: string;
    email: string | null;
  };
}

export interface CreateUserRefreshTokenRequest {
  hashedToken: string;
  userId: number;
}

export interface UpdateUserRefreshTokenRequest {
  hashedToken?: string;
  revoked?: boolean;
}

export interface UserRefreshTokenListQuery {
  page?: number | string;
  limit?: number | string;
  userId?: number;
  revoked?: boolean;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// AccountNumber-related types
export interface AccountNumberResponse {
  id: number;
  module: ModuleEnum;
  bankCode: string;
  ownerCode: string;
  accountName: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
  bank?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateAccountNumberRequest {
  module: ModuleEnum;
  bankCode: string;
  ownerCode: string;
  accountName: string;
  accountNumber: string;
}

export interface UpdateAccountNumberRequest {
  module?: ModuleEnum;
  bankCode?: string;
  ownerCode?: string;
  accountName?: string;
  accountNumber?: string;
}

export interface AccountNumberListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  module?: ModuleEnum;
  ownerCode?: string;
  bankCode?: string;
  sortBy?: 'accountNumber' | 'accountName' | 'ownerCode' | 'bankCode' | 'module' | 'createdAt';
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

// CekGiroDetail-related types (Level 3)
export interface CekGiroDetailResponse {
  id: number;
  code: string;
  cekGiroCode: string;
  accountNumber: string | null;
  accountName: string;
  amount: number;
  receiverName: string;
  receiverPhone: string | null;
  disbursementDate: Date;
  handoverDate: Date;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  cekGiro?: {
    id: number;
    code: string;
    type: string;
  };
}

export interface CreateCekGiroDetailRequest {
  code: string;
  cekGiroCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  receiverName: string;
  receiverPhone?: string;
  disbursementDate: string | Date;
  handoverDate: string | Date;
  note?: string;
}

export interface UpdateCekGiroDetailRequest {
  code?: string;
  cekGiroCode?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: number;
  receiverName?: string;
  receiverPhone?: string;
  disbursementDate?: string | Date;
  handoverDate?: string | Date;
  note?: string;
}

export interface CekGiroDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  cekGiroCode?: string;
  sortBy?: 'code' | 'cekGiroCode' | 'amount' | 'disbursementDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Product-related types (Level 3)
export interface ProductResponse {
  id: number;
  code: string;
  branchCode: string;
  productCategoryCode: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  productCategory?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateProductRequest {
  code: string;
  branchCode: string;
  productCategoryCode: string;
  name: string;
}

export interface UpdateProductRequest {
  code?: string;
  branchCode?: string;
  productCategoryCode?: string;
  name?: string;
}

export interface ProductListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  productCategoryCode?: string;
  sortBy?: 'code' | 'name' | 'branchCode' | 'productCategoryCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// SupplierDiscount-related types (Level 3)
export interface SupplierDiscountResponse {
  id: number;
  code: string;
  supplierCode: string;
  name: string;
  amount: number | null;
  percentage: number | null;
  validDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  supplier?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateSupplierDiscountRequest {
  code: string;
  supplierCode: string;
  name: string;
  amount?: number;
  percentage?: number;
  validDate?: string | Date;
}

export interface UpdateSupplierDiscountRequest {
  code?: string;
  supplierCode?: string;
  name?: string;
  amount?: number;
  percentage?: number;
  validDate?: string | Date;
}

export interface SupplierDiscountListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  supplierCode?: string;
  sortBy?: 'code' | 'name' | 'supplierCode' | 'amount' | 'percentage' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// CashRegister-related types (Level 3)
export interface CashRegisterResponse {
  id: number;
  code: string;
  branchCode: string;
  userCode: string;
  date: Date;
  amount: number;
  p100000: number | null;
  p50000: number | null;
  p20000: number | null;
  p10000: number | null;
  p5000: number | null;
  p2000: number | null;
  p1000: number | null;
  p500: number | null;
  p200: number | null;
  p100: number | null;
  p50: number | null;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateCashRegisterRequest {
  code: string;
  branchCode: string;
  userCode: string;
  date: string | Date;
  amount: number;
  p100000?: number;
  p50000?: number;
  p20000?: number;
  p10000?: number;
  p5000?: number;
  p2000?: number;
  p1000?: number;
  p500?: number;
  p200?: number;
  p100?: number;
  p50?: number;
}

export interface UpdateCashRegisterRequest {
  code?: string;
  branchCode?: string;
  userCode?: string;
  date?: string | Date;
  amount?: number;
  p100000?: number;
  p50000?: number;
  p20000?: number;
  p10000?: number;
  p5000?: number;
  p2000?: number;
  p1000?: number;
  p500?: number;
  p200?: number;
  p100?: number;
  p50?: number;
}

export interface CashRegisterListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  userCode?: string;
  sortBy?: 'code' | 'branchCode' | 'userCode' | 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Closing-related types (Level 3)
export interface ClosingResponse {
  id: number;
  code: string;
  branchCode: string;
  userCode: string;
  date: Date;
  amount: number;
  debit: number | null;
  p100000: number | null;
  p50000: number | null;
  p20000: number | null;
  p10000: number | null;
  p5000: number | null;
  p2000: number | null;
  p1000: number | null;
  p500: number | null;
  p200: number | null;
  p100: number | null;
  p50: number | null;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateClosingRequest {
  code: string;
  branchCode: string;
  userCode: string;
  date: string | Date;
  amount: number;
  debit?: number;
  p100000?: number;
  p50000?: number;
  p20000?: number;
  p10000?: number;
  p5000?: number;
  p2000?: number;
  p1000?: number;
  p500?: number;
  p200?: number;
  p100?: number;
  p50?: number;
}

export interface UpdateClosingRequest {
  code?: string;
  branchCode?: string;
  userCode?: string;
  date?: string | Date;
  amount?: number;
  debit?: number;
  p100000?: number;
  p50000?: number;
  p20000?: number;
  p10000?: number;
  p5000?: number;
  p2000?: number;
  p1000?: number;
  p500?: number;
  p200?: number;
  p100?: number;
  p50?: number;
}

export interface ClosingListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  userCode?: string;
  sortBy?: 'code' | 'branchCode' | 'userCode' | 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Deposit-related types (Level 3)
export interface DepositResponse {
  id: number;
  code: string;
  status: StatusEnum;
  branchCode: string;
  userCode: string;
  date: Date;
  amount: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateDepositRequest {
  code: string;
  status: StatusEnum;
  branchCode: string;
  userCode: string;
  date: string | Date;
  amount: number;
  note?: string;
}

export interface UpdateDepositRequest {
  code?: string;
  status?: StatusEnum;
  branchCode?: string;
  userCode?: string;
  date?: string | Date;
  amount?: number;
  note?: string;
}

export interface DepositListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  userCode?: string;
  status?: StatusEnum;
  sortBy?: 'code' | 'branchCode' | 'userCode' | 'date' | 'amount' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Expense-related types (Level 3)
export interface ExpenseResponse {
  id: number;
  code: string;
  branchCode: string;
  expenseCategoryCode: string;
  userCode: string;
  date: Date;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  expenseCategory?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateExpenseRequest {
  code: string;
  branchCode: string;
  expenseCategoryCode: string;
  userCode: string;
  date: string | Date;
  amount: number;
  description: string;
}

export interface UpdateExpenseRequest {
  code?: string;
  branchCode?: string;
  expenseCategoryCode?: string;
  userCode?: string;
  date?: string | Date;
  amount?: number;
  description?: string;
}

export interface ExpenseListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  expenseCategoryCode?: string;
  userCode?: string;
  sortBy?: 'code' | 'branchCode' | 'expenseCategoryCode' | 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ProductDetail-related types (Level 4)
export interface ProductDetailResponse {
  id: number;
  status: StatusEnum;
  code: string;
  productCode: string;
  colorCode: string;
  supplierCode: string;
  article: string | null;
  size: string;
  purchasePrice: number;
  salesPrice: number;
  wholesalePrice: number | null;
  stock: number;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: number;
    code: string;
    name: string;
  };
  color?: {
    id: number;
    code: string;
    name: string;
  };
  supplier?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateProductDetailRequest {
  status: StatusEnum;
  code: string;
  productCode: string;
  colorCode: string;
  supplierCode: string;
  article?: string;
  size: string;
  purchasePrice: number;
  salesPrice: number;
  wholesalePrice: number;
  stock: number;
  purchaseDate: string | Date;
}

export interface UpdateProductDetailRequest {
  status?: StatusEnum;
  code?: string;
  productCode?: string;
  colorCode?: string;
  supplierCode?: string;
  article?: string;
  size?: string;
  purchasePrice?: number;
  salesPrice?: number;
  wholesalePrice?: number;
  stock?: number;
  purchaseDate?: string | Date;
}

export interface ProductDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  productCode?: string;
  colorCode?: string;
  supplierCode?: string;
  status?: StatusEnum;
  sortBy?: 'code' | 'productCode' | 'colorCode' | 'supplierCode' | 'stock' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Promo-related types (Level 4)
export interface PromoResponse {
  id: number;
  status: StatusEnum;
  code: string;
  branchCode: string;
  name: string;
  termsAndCondition: string | null;
  amount: number | null;
  percentage: number | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreatePromoRequest {
  status: StatusEnum;
  code: string;
  branchCode: string;
  name: string;
  termsAndCondition?: string;
  amount?: number;
  percentage?: number;
  startDate: string | Date;
  endDate: string | Date;
}

export interface UpdatePromoRequest {
  status?: StatusEnum;
  code?: string;
  branchCode?: string;
  name?: string;
  termsAndCondition?: string;
  amount?: number;
  percentage?: number;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface PromoListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  status?: StatusEnum;
  sortBy?: 'code' | 'name' | 'branchCode' | 'startDate' | 'endDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// StockOpname-related types (Level 4)
export interface StockOpnameResponse {
  id: number;
  code: string;
  status: StatusEnum;
  branchCode: string;
  year: number;
  month: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateStockOpnameRequest {
  code: string;
  status: StatusEnum;
  branchCode: string;
  year: number;
  month: number;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateStockOpnameRequest {
  code?: string;
  status?: StatusEnum;
  branchCode?: string;
  year?: number;
  month?: number;
  updatedBy?: string;
}

export interface StockOpnameListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  status?: StatusEnum;
  year?: number;
  month?: number;
  sortBy?: 'code' | 'branchCode' | 'year' | 'month' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// StockOpnameDetail-related types (Level 5)
export interface StockOpnameDetailResponse {
  id: number;
  stockOpnameCode: string;
  productDetailCode: string;
  stockSystem: number;
  stockActual: number | null;
  createdAt: Date;
  updatedAt: Date;
  stockOpname?: {
    id: number;
    code: string;
    status: StatusEnum;
  };
  productDetail?: {
    id: number;
    code: string;
    stock: number;
  };
}

export interface CreateStockOpnameDetailRequest {
  stockOpnameCode: string;
  productDetailCode: string;
  stockSystem: number;
  stockActual?: number;
}

export interface UpdateStockOpnameDetailRequest {
  stockOpnameCode?: string;
  productDetailCode?: string;
  stockSystem?: number;
  stockActual?: number;
}

export interface StockOpnameDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  stockOpnameCode?: string;
  productDetailCode?: string;
  sortBy?: 'stockOpnameCode' | 'productDetailCode' | 'stockSystem' | 'stockActual' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Order-related types (Level 5)
export interface OrderResponse {
  id: number;
  code: string;
  branchCode: string;
  memberCode: string | null;
  userCode: string;
  promoCode: string | null;
  totalPrice: number;
  paymentType: PaymentTypeEnum;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  member?: {
    id: number;
    code: string;
    name: string;
  } | null;
  user?: {
    id: number;
    code: string;
    name: string;
  };
  promo?: {
    id: number;
    code: string;
    name: string;
  } | null;
}

export interface CreateOrderRequest {
  code: string;
  branchCode: string;
  memberCode?: string;
  userCode: string;
  promoCode?: string;
  totalPrice: number;
  paymentType: PaymentTypeEnum;
}

export interface UpdateOrderRequest {
  code?: string;
  branchCode?: string;
  memberCode?: string;
  userCode?: string;
  promoCode?: string;
  totalPrice?: number;
  paymentType?: PaymentTypeEnum;
}

export interface OrderListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  memberCode?: string;
  userCode?: string;
  paymentType?: PaymentTypeEnum;
  sortBy?: 'code' | 'branchCode' | 'memberCode' | 'totalPrice' | 'paymentType' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Restock-related types (Level 5)
export interface RestockResponse {
  id: number;
  code: string;
  status: StatusEnum;
  branchCode: string;
  userCode: string;
  supplierCode: string;
  supplierDiscountCode: string | null;
  purchaseDate: Date;
  receivedDate: Date | null;
  note: string | null;
  paymentStatus: StatusEnum;
  createdAt: Date;
  updatedAt: Date;
  branch?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
  supplier?: {
    id: number;
    code: string;
    name: string;
  };
  supplierDiscount?: {
    id: number;
    code: string;
    name: string;
  } | null;
}

export interface CreateRestockRequest {
  code: string;
  status: StatusEnum;
  branchCode: string;
  userCode: string;
  supplierCode: string;
  supplierDiscountCode?: string;
  purchaseDate: string | Date;
  receivedDate?: string | Date;
  note?: string;
  paymentStatus: StatusEnum;
}

export interface UpdateRestockRequest {
  code?: string;
  status?: StatusEnum;
  branchCode?: string;
  userCode?: string;
  supplierCode?: string;
  supplierDiscountCode?: string;
  purchaseDate?: string | Date;
  receivedDate?: string | Date;
  note?: string;
  paymentStatus?: StatusEnum;
}

export interface RestockListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  branchCode?: string;
  userCode?: string;
  supplierCode?: string;
  status?: StatusEnum;
  paymentStatus?: StatusEnum;
  sortBy?: 'code' | 'branchCode' | 'supplierCode' | 'purchaseDate' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// OrderDetail-related types (Level 6)
export interface OrderDetailResponse {
  id: number;
  code: string;
  orderCode: string;
  userCode: string | null;
  productDetailCode: string;
  priceType: PriceTypeEnum;
  quantity: number;
  discountAmount: number | null;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  order?: {
    id: number;
    code: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  } | null;
  productDetail?: {
    id: number;
    code: string;
  };
}

export interface CreateOrderDetailRequest {
  code: string;
  orderCode: string;
  userCode?: string;
  productDetailCode: string;
  priceType: PriceTypeEnum;
  quantity: number;
  discountAmount?: number;
  totalPrice: number;
}

export interface UpdateOrderDetailRequest {
  code?: string;
  orderCode?: string;
  userCode?: string;
  productDetailCode?: string;
  priceType?: PriceTypeEnum;
  quantity?: number;
  discountAmount?: number;
  totalPrice?: number;
}

export interface OrderDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  orderCode?: string;
  productDetailCode?: string;
  sortBy?: 'code' | 'orderCode' | 'productDetailCode' | 'quantity' | 'totalPrice' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// OrderDiscount-related types (Level 6)
export interface OrderDiscountResponse {
  id: number;
  code: string;
  orderCode: string;
  userCode: string;
  invoiceDiscountAmount: number | null;
  productDiscountAmount: number | null;
  promoDiscountAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
  order?: {
    id: number;
    code: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateOrderDiscountRequest {
  code: string;
  orderCode: string;
  userCode: string;
  invoiceDiscountAmount?: number;
  productDiscountAmount?: number;
  promoDiscountAmount?: number;
}

export interface UpdateOrderDiscountRequest {
  code?: string;
  orderCode?: string;
  userCode?: string;
  invoiceDiscountAmount?: number;
  productDiscountAmount?: number;
  promoDiscountAmount?: number;
}

export interface OrderDiscountListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  orderCode?: string;
  userCode?: string;
  sortBy?: 'code' | 'orderCode' | 'userCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Payment-related types (Level 6)
export interface PaymentResponse {
  id: number;
  code: string;
  orderCode: string;
  paymentMethod: PaymentMethodEnum;
  customerAmount: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  order?: {
    id: number;
    code: string;
  };
}

export interface CreatePaymentRequest {
  code: string;
  orderCode: string;
  paymentMethod: PaymentMethodEnum;
  customerAmount: number;
  amount: number;
}

export interface UpdatePaymentRequest {
  code?: string;
  orderCode?: string;
  paymentMethod?: PaymentMethodEnum;
  customerAmount?: number;
  amount?: number;
}

export interface PaymentListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  orderCode?: string;
  paymentMethod?: PaymentMethodEnum;
  sortBy?: 'code' | 'orderCode' | 'paymentMethod' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// PaymentBilling-related types (Level 6)
export interface PaymentBillingResponse {
  id: number;
  code: string;
  memberCode: string;
  userCode: string;
  paymentMethod: PaymentMethodEnum;
  amount: number;
  discount: number | null;
  createdAt: Date;
  updatedAt: Date;
  member?: {
    id: number;
    code: string;
    name: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreatePaymentBillingRequest {
  code: string;
  memberCode: string;
  userCode: string;
  paymentMethod: PaymentMethodEnum;
  amount: number;
  discount?: number;
}

export interface UpdatePaymentBillingRequest {
  code?: string;
  memberCode?: string;
  userCode?: string;
  paymentMethod?: PaymentMethodEnum;
  amount?: number;
  discount?: number;
}

export interface PaymentBillingListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  memberCode?: string;
  userCode?: string;
  paymentMethod?: PaymentMethodEnum;
  sortBy?: 'code' | 'memberCode' | 'userCode' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Refund-related types (Level 6)
export interface RefundResponse {
  id: number;
  code: string;
  orderCode: string;
  userCode: string;
  createdAt: Date;
  updatedAt: Date;
  order?: {
    id: number;
    code: string;
  };
  user?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CreateRefundRequest {
  code: string;
  orderCode: string;
  userCode: string;
}

export interface UpdateRefundRequest {
  code?: string;
  orderCode?: string;
  userCode?: string;
}

export interface RefundListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  orderCode?: string;
  userCode?: string;
  sortBy?: 'code' | 'orderCode' | 'userCode' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// RestockDetail-related types (Level 6)
export interface RestockDetailResponse {
  id: number;
  code: string;
  restockCode: string;
  productDetailCode: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  restock?: {
    id: number;
    code: string;
  };
  productDetail?: {
    id: number;
    code: string;
  };
}

export interface CreateRestockDetailRequest {
  code: string;
  restockCode: string;
  productDetailCode: string;
  quantity: number;
}

export interface UpdateRestockDetailRequest {
  code?: string;
  restockCode?: string;
  productDetailCode?: string;
  quantity?: number;
}

export interface RestockDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  restockCode?: string;
  productDetailCode?: string;
  sortBy?: 'code' | 'restockCode' | 'productDetailCode' | 'quantity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// RestockPayment-related types (Level 6)
export interface RestockPaymentResponse {
  id: number;
  code: string;
  restockCode: string;
  paymentMethod: PaymentMethodEnum;
  amount: number;
  discount: number | null;
  cekGiroDetailCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  restock?: {
    id: number;
    code: string;
  };
  cekGiroDetail?: {
    id: number;
    code: string;
  } | null;
}

export interface CreateRestockPaymentRequest {
  code: string;
  restockCode: string;
  paymentMethod: PaymentMethodEnum;
  amount: number;
  discount?: number;
  cekGiroDetailCode?: string;
}

export interface UpdateRestockPaymentRequest {
  code?: string;
  restockCode?: string;
  paymentMethod?: PaymentMethodEnum;
  amount?: number;
  discount?: number;
  cekGiroDetailCode?: string;
}

export interface RestockPaymentListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  restockCode?: string;
  paymentMethod?: PaymentMethodEnum;
  sortBy?: 'code' | 'restockCode' | 'paymentMethod' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// RefundDetail-related types (Level 7)
export interface RefundDetailResponse {
  id: number;
  code: string;
  refundCode: string;
  refundMethod: RefundMethodEnum;
  orderDetailCode: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  refund?: {
    id: number;
    code: string;
  };
  orderDetail?: {
    id: number;
    code: string;
  };
}

export interface CreateRefundDetailRequest {
  code: string;
  refundCode: string;
  refundMethod: RefundMethodEnum;
  orderDetailCode: string;
  quantity: number;
}

export interface UpdateRefundDetailRequest {
  code?: string;
  refundCode?: string;
  refundMethod?: RefundMethodEnum;
  orderDetailCode?: string;
  quantity?: number;
}

export interface RefundDetailListQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  refundCode?: string;
  orderDetailCode?: string;
  refundMethod?: RefundMethodEnum;
  sortBy?: 'code' | 'refundCode' | 'orderDetailCode' | 'refundMethod' | 'quantity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
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
