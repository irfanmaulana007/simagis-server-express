/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

import { PrismaClient, RoleEnum } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '~/utils/asyncHandler';
import { AuthenticationError, AuthorizationError } from '~/utils/customErrors';
import { JwtPayload, JwtUtils } from '~/utils/jwt';

const prisma = new PrismaClient();

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        code: string;
        name: string;
        email: string;
        username: string;
        phone: string;
        address: string | null;
        role: RoleEnum;
        expenseLimit: number | null;
        discountLimit: number | null;
        point: number | null;
        balance: number | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    try {
      // Verify token
      const decoded: JwtPayload = JwtUtils.verifyToken(token);

      // Get user from database to ensure user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          code: true,
          name: true,
          email: true,
          username: true,
          phone: true,
          address: true,
          role: true,
          expenseLimit: true,
          discountLimit: true,
          point: true,
          balance: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Add user data to request object
      req.user = {
        id: user.id,
        code: user.code,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        role: user.role,
        expenseLimit: user.expenseLimit,
        discountLimit: user.discountLimit,
        point: user.point,
        balance: user.balance,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      next();
    } catch (error) {
      // If it's already an authentication error, just pass it along
      if (error instanceof AuthenticationError) {
        throw error;
      }
      // Otherwise, create a generic authentication error
      throw new AuthenticationError('Invalid or expired token');
    }
  }
);

/**
 * Middleware to authorize based on user roles
 */
export const authorize = (...roles: RoleEnum[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(`Access denied. Required roles: ${roles.join(', ')}`);
    }

    next();
  });
};

/**
 * Middleware for optional authentication (doesn't throw error if no token)
 * Useful for endpoints that work differently for authenticated vs anonymous users
 */
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return next(); // No token, continue without user data
    }

    try {
      const decoded: JwtPayload = JwtUtils.verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          code: true,
          name: true,
          email: true,
          username: true,
          phone: true,
          address: true,
          role: true,
          expenseLimit: true,
          discountLimit: true,
          point: true,
          balance: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (user) {
        req.user = {
          id: user.id,
          code: user.code,
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user.phone,
          address: user.address,
          role: user.role,
          expenseLimit: user.expenseLimit,
          discountLimit: user.discountLimit,
          point: user.point,
          balance: user.balance,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    } catch (error) {
      // Ignore token errors in optional auth
      console.warn(
        'Optional auth token error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    next();
  }
);

/**
 * Rate limiting middleware per user
 */
export const rateLimitPerUser = (maxRequests: number, windowMs: number) => {
  const requests = new Map<number, { count: number; resetTime: number }>();

  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Skip rate limiting for unauthenticated requests
    }

    const userId = req.user.id;
    const now = Date.now();
    const userRequests = requests.get(userId);

    if (!userRequests || now > userRequests.resetTime) {
      requests.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userRequests.count >= maxRequests) {
      throw new AuthorizationError('Rate limit exceeded. Please try again later.');
    }

    userRequests.count++;
    next();
  });
};
