/**
 * User Service
 * Handles user CRUD operations and business logic
 */

import { Prisma, PrismaClient, RoleEnum } from '@prisma/client';
import {
  CreateUserRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
  UserListQuery,
  UserResponse,
  UserRoleQuery,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';
import { PasswordUtils } from '~/utils/password';

const prisma = new PrismaClient();

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username },
          { phone: userData.phone },
          { code: userData.code },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new ConflictError('User with this email already exists');
      }
      if (existingUser.username === userData.username) {
        throw new ConflictError('Username already taken');
      }
      if (existingUser.phone === userData.phone) {
        throw new ConflictError('Phone number already registered');
      }
      if (existingUser.code === userData.code) {
        throw new ConflictError('User code already exists');
      }
    }

    // Validate password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw new ValidationError('Password does not meet requirements', {
        password: passwordValidation.errors.join(', '),
      });
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hashPassword(userData.password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        username: userData.username,
        phone: userData.phone,
        role: userData.role,
        address: userData.address,
        code: userData.code,
        expenseLimit: userData.expenseLimit || 0,
        discountLimit: userData.discountLimit || 0,
        point: 0,
        balance: 0,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newUser;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Get user by code
   */
  static async getUserByCode(code: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { code },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Update user
   */
  static async updateUser(id: number, userData: UpdateUserRequest): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check for conflicts with unique fields
    if (userData.email || userData.username || userData.phone) {
      const conflictUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } }, // Exclude current user
            {
              OR: [
                userData.email ? { email: userData.email } : {},
                userData.username ? { username: userData.username } : {},
                userData.phone ? { phone: userData.phone } : {},
              ].filter(condition => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (conflictUser) {
        if (conflictUser.email === userData.email) {
          throw new ConflictError('User with this email already exists');
        }
        if (conflictUser.username === userData.username) {
          throw new ConflictError('Username already taken');
        }
        if (conflictUser.phone === userData.phone) {
          throw new ConflictError('Phone number already registered');
        }
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(userData.email && { email: userData.email }),
        ...(userData.name && { name: userData.name }),
        ...(userData.username && { username: userData.username }),
        ...(userData.phone && { phone: userData.phone }),
        ...(userData.role && { role: userData.role }),
        ...(userData.address !== undefined && { address: userData.address }),
        ...(userData.expenseLimit !== undefined && { expenseLimit: userData.expenseLimit }),
        ...(userData.discountLimit !== undefined && { discountLimit: userData.discountLimit }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Delete user (soft delete by setting role to inactive)
   * In a real application, you might want to implement proper soft delete
   */
  static async deleteUser(id: number): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // For now, we'll actually delete the user
    // In production, you might want to implement soft delete
    await prisma.user.delete({ where: { id } });
  }

  /**
   * Get paginated users list with filters
   */
  static async getUsers(query: UserListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { role, search } = query;

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'name',
        'email',
        'username',
        'code',
      ]);
      Object.assign(where, searchFilter);
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.UserOrderByWithRelationInput;

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(users, page, limit, total);
  }

  /**
   * Update user profile (limited fields for user self-update)
   */
  static async updateProfile(id: number, profileData: UpdateProfileRequest): Promise<UserResponse> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check for phone number conflict
    if (profileData.phone) {
      const conflictUser = await prisma.user.findFirst({
        where: {
          AND: [{ id: { not: id } }, { phone: profileData.phone }],
        },
      });

      if (conflictUser) {
        throw new ConflictError('Phone number already registered');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(profileData.name && { name: profileData.name }),
        ...(profileData.phone && { phone: profileData.phone }),
        ...(profileData.address !== undefined && { address: profileData.address }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Get users by role with pagination
   */
  static async getUsersByRole(role: RoleEnum, query: UserRoleQuery = {}) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'name', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;

    // Build where clause
    const where: Prisma.UserWhereInput = { role };

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.UserOrderByWithRelationInput;

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        role: true,
        address: true,
        code: true,
        expenseLimit: true,
        discountLimit: true,
        point: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(users, page, limit, total);
  }

  /**
   * Check if user has permission to perform action on target user
   */
  static async checkUserPermission(
    currentUserId: number,
    targetUserId: number,
    action: 'read' | 'update' | 'delete'
  ): Promise<boolean> {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true },
    });

    if (!currentUser) {
      return false;
    }

    // Super admin can do anything
    if (currentUser.role === 'SUPER_ADMIN') {
      return true;
    }

    // Owner and Pimpinan can manage most users
    if (['OWNER', 'PIMPINAN'].includes(currentUser.role)) {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { role: true },
      });

      if (!targetUser) {
        return false;
      }

      // Can't manage super admin
      if (targetUser.role === 'SUPER_ADMIN') {
        return false;
      }

      return true;
    }

    // Users can only read/update their own profile
    if (action === 'read' || action === 'update') {
      return currentUserId === targetUserId;
    }

    // Users can't delete accounts
    return false;
  }

  /**
   * Get user statistics (for dashboard)
   */
  static async getUserStats() {
    const [totalUsers, adminUsers, staffUsers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { role: { in: ['SUPER_ADMIN', 'OWNER', 'PIMPINAN'] } },
      }),
      prisma.user.count({
        where: { role: { in: ['STAFF_KANTOR', 'STAFF_INVENTORY', 'STAFF_WAREHOUSE'] } },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      totalUsers,
      adminUsers,
      staffUsers,
      recentUsers,
    };
  }
}
