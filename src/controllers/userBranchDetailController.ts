/**
 * UserBranchDetail Controller
 * Handles user branch detail management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { UserBranchDetailService } from '~/services/userBranchDetailService';
import {
  UserBranchDetailListQuery,
  CreateUserBranchDetailRequest,
  UpdateUserBranchDetailRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class UserBranchDetailController {
  /**
   * Create a new user branch detail
   * POST /api/user-branch-details
   */
  static createUserBranchDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userBranchDetailData: CreateUserBranchDetailRequest = req.body;

      const newUserBranchDetail =
        await UserBranchDetailService.createUserBranchDetail(userBranchDetailData);

      res.status(201).json({
        success: true,
        message: 'User branch detail created successfully',
        data: newUserBranchDetail,
      });
    }
  );

  /**
   * Get all user branch details (paginated)
   * GET /api/user-branch-details
   */
  static getUserBranchDetails = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: UserBranchDetailListQuery = req.query as UserBranchDetailListQuery;

      const result = await UserBranchDetailService.getUserBranchDetails(query);

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
   * Get user branch detail by ID
   * GET /api/user-branch-details/:id
   */
  static getUserBranchDetailById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const userBranchDetail = await UserBranchDetailService.getUserBranchDetailById(id);

      if (!userBranchDetail) {
        throw new NotFoundError('User branch detail not found');
      }

      res.status(200).json(ApiResponse.success(userBranchDetail, null));
    }
  );

  /**
   * Get user branch details by branch code
   * GET /api/user-branch-details/branch/:branchCode
   */
  static getUserBranchDetailsByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const userBranchDetails =
        await UserBranchDetailService.getUserBranchDetailsByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(userBranchDetails, null));
    }
  );

  /**
   * Get user branch details by user code
   * GET /api/user-branch-details/user/:userCode
   */
  static getUserBranchDetailsByUserCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userCode = req.params.userCode;

      const userBranchDetails =
        await UserBranchDetailService.getUserBranchDetailsByUserCode(userCode);

      res.status(200).json(ApiResponse.success(userBranchDetails, null));
    }
  );

  /**
   * Update user branch detail
   * PUT /api/user-branch-details/:id
   */
  static updateUserBranchDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const userBranchDetailData: UpdateUserBranchDetailRequest = req.body;

      const updatedUserBranchDetail = await UserBranchDetailService.updateUserBranchDetail(
        id,
        userBranchDetailData
      );

      res.status(200).json({
        success: true,
        message: 'User branch detail updated successfully',
        data: updatedUserBranchDetail,
      });
    }
  );

  /**
   * Delete user branch detail
   * DELETE /api/user-branch-details/:id
   */
  static deleteUserBranchDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await UserBranchDetailService.deleteUserBranchDetail(id);

      res.status(200).json({
        success: true,
        message: 'User branch detail deleted successfully',
      });
    }
  );

  /**
   * Get user branch detail statistics
   * GET /api/user-branch-details/stats
   */
  static getUserBranchDetailStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await UserBranchDetailService.getUserBranchDetailStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
