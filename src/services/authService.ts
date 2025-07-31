/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import { PrismaClient } from '@prisma/client';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  UserResponse,
} from '~/types';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '~/utils/customErrors';
import { JwtPayload, JwtUtils } from '~/utils/jwt';
import { PasswordUtils } from '~/utils/password';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: RegisterRequest): Promise<UserResponse> {
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
   * Login user and return tokens
   */
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        password: true,
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

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await PasswordUtils.verifyPassword(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      code: user.code,
    };

    const tokens = JwtUtils.generateTokenPair(tokenPayload);

    // Store refresh token in database
    const hashedRefreshToken = await PasswordUtils.hashPassword(tokens.refreshToken);
    await prisma.userRefreshToken.create({
      data: {
        hashedToken: hashedRefreshToken,
        userId: user.id,
      },
    });

    // Remove password from user object
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      // Verify refresh token
      const decoded = JwtUtils.verifyToken(refreshData.refreshToken);

      // Check if refresh token exists in database
      const refreshTokenRecord = await prisma.userRefreshToken.findFirst({
        where: {
          userId: decoded.userId,
          revoked: false,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              code: true,
            },
          },
        },
      });

      if (!refreshTokenRecord) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Verify the token hash
      const isTokenValid = await PasswordUtils.verifyPassword(
        refreshData.refreshToken,
        refreshTokenRecord.hashedToken
      );

      if (!isTokenValid) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new tokens
      const tokenPayload: JwtPayload = {
        userId: refreshTokenRecord.user.id,
        email: refreshTokenRecord.user.email,
        role: refreshTokenRecord.user.role,
        code: refreshTokenRecord.user.code,
      };

      const newTokens = JwtUtils.generateTokenPair(tokenPayload);

      // Revoke old refresh token
      await prisma.userRefreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { revoked: true },
      });

      // Store new refresh token
      const hashedNewRefreshToken = await PasswordUtils.hashPassword(newTokens.refreshToken);
      await prisma.userRefreshToken.create({
        data: {
          hashedToken: hashedNewRefreshToken,
          userId: refreshTokenRecord.user.id,
        },
      });

      return newTokens;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user by revoking refresh token
   */
  static async logout(userId: number, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific refresh token
      const refreshTokenRecord = await prisma.userRefreshToken.findFirst({
        where: {
          userId,
          revoked: false,
        },
      });

      if (refreshTokenRecord) {
        const isTokenValid = await PasswordUtils.verifyPassword(
          refreshToken,
          refreshTokenRecord.hashedToken
        );

        if (isTokenValid) {
          await prisma.userRefreshToken.update({
            where: { id: refreshTokenRecord.id },
            data: { revoked: true },
          });
        }
      }
    } else {
      // Revoke all refresh tokens for user
      await prisma.userRefreshToken.updateMany({
        where: {
          userId,
          revoked: false,
        },
        data: { revoked: true },
      });
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: number, passwordData: ChangePasswordRequest): Promise<void> {
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await PasswordUtils.verifyPassword(
      passwordData.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Validate new password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError('New password does not meet requirements', {
        password: passwordValidation.errors.join(', '),
      });
    }

    // Check if new password is different from current
    const isSamePassword = await PasswordUtils.verifyPassword(
      passwordData.newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new ValidationError('New password must be different from current password');
    }

    // Hash new password
    const hashedNewPassword = await PasswordUtils.hashPassword(passwordData.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Revoke all refresh tokens to force re-login
    await prisma.userRefreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  /**
   * Revoke all refresh tokens for a user (useful for forced logout)
   */
  static async revokeAllTokens(userId: number): Promise<void> {
    await prisma.userRefreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  /**
   * Clean up expired refresh tokens (utility method for cleanup jobs)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    const expiredTokens = await prisma.userRefreshToken.findMany({
      where: {
        revoked: false,
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
      },
    });

    if (expiredTokens.length > 0) {
      await prisma.userRefreshToken.updateMany({
        where: {
          id: {
            in: expiredTokens.map(token => token.id),
          },
        },
        data: { revoked: true },
      });
    }

    return expiredTokens.length;
  }
}
