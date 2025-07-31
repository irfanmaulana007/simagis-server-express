/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { AuthService } from '~/services/authService';
import { ChangePasswordRequest, LoginRequest, RefreshTokenRequest, RegisterRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { ApiResponse } from '~/utils/response';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: RegisterRequest = req.body;

    const newUser = await AuthService.register(userData);

    res.status(201).json(ApiResponse.created(newUser, 'User registered successfully'));
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const loginData: LoginRequest = req.body;

    const loginResponse = await AuthService.login(loginData);

    res.status(200).json(ApiResponse.success(loginResponse, null));
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshData: RefreshTokenRequest = req.body;

    const tokens = await AuthService.refreshToken(refreshData);

    res.status(200).json(ApiResponse.success(tokens, null));
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const refreshToken = req.body.refreshToken;

    await AuthService.logout(userId, refreshToken);

    res.status(200).json(ApiResponse.success({ message: 'Logged out successfully' }, null));
  });

  /**
   * Change password
   * POST /api/auth/change-password
   */
  static changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const passwordData: ChangePasswordRequest = req.body;

    await AuthService.changePassword(userId, passwordData);

    res.status(200).json(ApiResponse.success({ message: 'Password changed successfully' }, null));
  });

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static getCurrentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    res.status(200).json(ApiResponse.success(user, null));
  });

  /**
   * Revoke all tokens (force logout from all devices)
   * POST /api/auth/revoke-all
   */
  static revokeAllTokens = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    await AuthService.revokeAllTokens(userId);

    res.status(200).json(ApiResponse.success({ message: 'All tokens revoked successfully' }, null));
  });

  /**
   * Validate token (utility endpoint)
   * GET /api/auth/validate
   */
  static validateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // If we reach here, the token is valid (middleware already validated it)
    const user = req.user!;

    res.status(200).json(
      ApiResponse.success(
        {
          valid: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            code: user.code,
            name: user.name,
          },
        },
        null
      )
    );
  });
}
