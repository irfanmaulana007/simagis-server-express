/**
 * UserRefreshToken Controller
 * Handles user refresh token management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { UserRefreshTokenService } from '~/services/userRefreshTokenService';
import { UserRefreshTokenListQuery } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class UserRefreshTokenController {
  /**
   * Get all user refresh tokens (paginated)
   * GET /api/user-refresh-tokens
   */
  static getUserRefreshTokens = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: UserRefreshTokenListQuery = req.query as unknown as UserRefreshTokenListQuery;

      const result = await UserRefreshTokenService.getUserRefreshTokens(query);

      res
        .status(200)
        .json(
          ApiResponse.paginated(
            result.data,
            result.pagination.page,
            result.pagination.limit,
            result.pagination.total
          )
        );
    }
  );

  /**
   * Get user refresh token by ID
   * GET /api/user-refresh-tokens/:id
   */
  static getUserRefreshTokenById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = req.params.id;

      const userRefreshToken = await UserRefreshTokenService.getUserRefreshTokenById(id);

      if (!userRefreshToken) {
        throw new NotFoundError('User refresh token not found');
      }

      res.status(200).json(ApiResponse.success(userRefreshToken, null));
    }
  );

  /**
   * Get user refresh tokens by user ID
   * GET /api/user-refresh-tokens/user/:userId
   */
  static getUserRefreshTokensByUserId = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = parseInt(req.params.userId);

      const userRefreshTokens = await UserRefreshTokenService.getUserRefreshTokensByUserId(userId);

      res.status(200).json(ApiResponse.success(userRefreshTokens, null));
    }
  );

  /**
   * Revoke user refresh token
   * PUT /api/user-refresh-tokens/:id/revoke
   */
  static revokeUserRefreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = req.params.id;

      const revokedToken = await UserRefreshTokenService.revokeUserRefreshToken(id);

      res.status(200).json({
        success: true,
        message: 'User refresh token revoked successfully',
        data: revokedToken,
      });
    }
  );

  /**
   * Revoke all user refresh tokens for a user
   * PUT /api/user-refresh-tokens/user/:userId/revoke-all
   */
  static revokeAllUserRefreshTokens = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = parseInt(req.params.userId);

      const count = await UserRefreshTokenService.revokeAllUserRefreshTokens(userId);

      res.status(200).json({
        success: true,
        message: `${count} user refresh tokens revoked successfully`,
        data: { revokedCount: count },
      });
    }
  );

  /**
   * Delete user refresh token
   * DELETE /api/user-refresh-tokens/:id
   */
  static deleteUserRefreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = req.params.id;

      await UserRefreshTokenService.deleteUserRefreshToken(id);

      res.status(200).json({
        success: true,
        message: 'User refresh token deleted successfully',
      });
    }
  );

  /**
   * Delete all revoked tokens (cleanup)
   * DELETE /api/user-refresh-tokens/cleanup/revoked
   */
  static deleteRevokedTokens = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const count = await UserRefreshTokenService.deleteRevokedTokens();

      res.status(200).json({
        success: true,
        message: `${count} revoked tokens deleted successfully`,
        data: { deletedCount: count },
      });
    }
  );

  /**
   * Delete expired tokens (cleanup)
   * DELETE /api/user-refresh-tokens/cleanup/expired
   */
  static deleteExpiredTokens = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const daysOld = req.query.daysOld ? parseInt(req.query.daysOld as string) : 30;

      const count = await UserRefreshTokenService.deleteExpiredTokens(daysOld);

      res.status(200).json({
        success: true,
        message: `${count} expired tokens deleted successfully`,
        data: { deletedCount: count },
      });
    }
  );

  /**
   * Get user refresh token statistics
   * GET /api/user-refresh-tokens/stats
   */
  static getUserRefreshTokenStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await UserRefreshTokenService.getUserRefreshTokenStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
