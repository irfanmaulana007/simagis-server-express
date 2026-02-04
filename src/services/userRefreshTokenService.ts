/**
 * UserRefreshToken Service
 * Handles user refresh token CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import { UserRefreshTokenListQuery, UserRefreshTokenResponse } from '~/types';
import { NotFoundError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class UserRefreshTokenService {
  /**
   * Get user refresh token by ID
   */
  static async getUserRefreshTokenById(id: string): Promise<UserRefreshTokenResponse | null> {
    const userRefreshToken = await prisma.userRefreshToken.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return userRefreshToken;
  }

  /**
   * Get user refresh tokens by user ID
   */
  static async getUserRefreshTokensByUserId(userId: number): Promise<UserRefreshTokenResponse[]> {
    const userRefreshTokens = await prisma.userRefreshToken.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return userRefreshTokens;
  }

  /**
   * Revoke user refresh token
   */
  static async revokeUserRefreshToken(id: string): Promise<UserRefreshTokenResponse> {
    // Check if token exists
    const existingToken = await prisma.userRefreshToken.findUnique({
      where: { id },
    });

    if (!existingToken) {
      throw new NotFoundError('User refresh token not found');
    }

    const revokedToken = await prisma.userRefreshToken.update({
      where: { id },
      data: { revoked: true },
      include: {
        user: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return revokedToken;
  }

  /**
   * Revoke all user refresh tokens for a user
   */
  static async revokeAllUserRefreshTokens(userId: number): Promise<number> {
    const result = await prisma.userRefreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    return result.count;
  }

  /**
   * Delete user refresh token
   */
  static async deleteUserRefreshToken(id: string): Promise<void> {
    // Check if token exists
    const existingToken = await prisma.userRefreshToken.findUnique({
      where: { id },
    });

    if (!existingToken) {
      throw new NotFoundError('User refresh token not found');
    }

    await prisma.userRefreshToken.delete({ where: { id } });
  }

  /**
   * Delete all revoked tokens (cleanup)
   */
  static async deleteRevokedTokens(): Promise<number> {
    const result = await prisma.userRefreshToken.deleteMany({
      where: { revoked: true },
    });

    return result.count;
  }

  /**
   * Delete expired tokens (cleanup) - tokens older than specified days
   */
  static async deleteExpiredTokens(daysOld: number = 30): Promise<number> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - daysOld);

    const result = await prisma.userRefreshToken.deleteMany({
      where: {
        createdAt: { lt: expirationDate },
      },
    });

    return result.count;
  }

  /**
   * Get paginated user refresh tokens list with filters
   */
  static async getUserRefreshTokens(query: UserRefreshTokenListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { userId, revoked } = query;

    // Build where clause
    const where: Prisma.UserRefreshTokenWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (revoked !== undefined) {
      where.revoked = revoked;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.UserRefreshTokenOrderByWithRelationInput;

    // Get total count
    const total = await prisma.userRefreshToken.count({ where });

    // Get user refresh tokens
    const userRefreshTokens = await prisma.userRefreshToken.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(userRefreshTokens, page, limit, total);
  }

  /**
   * Get user refresh token statistics
   */
  static async getUserRefreshTokenStats() {
    const totalTokens = await prisma.userRefreshToken.count();
    const activeTokens = await prisma.userRefreshToken.count({
      where: { revoked: false },
    });
    const revokedTokens = await prisma.userRefreshToken.count({
      where: { revoked: true },
    });

    // Get count by user
    const tokensByUser = await prisma.userRefreshToken.groupBy({
      by: ['userId'],
      _count: {
        userId: true,
      },
      where: { revoked: false },
    });

    const uniqueActiveUsers = tokensByUser.length;

    return {
      totalTokens,
      activeTokens,
      revokedTokens,
      uniqueActiveUsers,
    };
  }
}
