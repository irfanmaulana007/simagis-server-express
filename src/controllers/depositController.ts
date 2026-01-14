/**
 * Deposit Controller
 * Handles deposit management HTTP requests
 */

import { StatusEnum } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { DepositService } from '~/services/depositService';
import { CreateDepositRequest, DepositListQuery, UpdateDepositRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class DepositController {
  /**
   * Create a new deposit
   * POST /api/deposits
   */
  static createDeposit = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const depositData: CreateDepositRequest = req.body;

    const newDeposit = await DepositService.createDeposit(depositData);

    res.status(201).json({
      success: true,
      message: 'Deposit created successfully',
      data: newDeposit,
    });
  });

  /**
   * Get all deposits (paginated)
   * GET /api/deposits
   */
  static getDeposits = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: DepositListQuery = req.query as DepositListQuery;

    const result = await DepositService.getDeposits(query);

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
  });

  /**
   * Get deposit by ID
   * GET /api/deposits/:id
   */
  static getDepositById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const deposit = await DepositService.getDepositById(id);

    if (!deposit) {
      throw new NotFoundError('Deposit not found');
    }

    res.status(200).json(ApiResponse.success(deposit, null));
  });

  /**
   * Get deposit by code
   * GET /api/deposits/code/:code
   */
  static getDepositByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const deposit = await DepositService.getDepositByCode(code);

      if (!deposit) {
        throw new NotFoundError('Deposit not found');
      }

      res.status(200).json(ApiResponse.success(deposit, null));
    }
  );

  /**
   * Get deposits by branch code
   * GET /api/deposits/branch/:branchCode
   */
  static getDepositsByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const deposits = await DepositService.getDepositsByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(deposits, null));
    }
  );

  /**
   * Get deposits by status
   * GET /api/deposits/status/:status
   */
  static getDepositsByStatus = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const status = req.params.status as StatusEnum;

      const deposits = await DepositService.getDepositsByStatus(status);

      res.status(200).json(ApiResponse.success(deposits, null));
    }
  );

  /**
   * Update deposit
   * PUT /api/deposits/:id
   */
  static updateDeposit = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const depositData: UpdateDepositRequest = req.body;

    const updatedDeposit = await DepositService.updateDeposit(id, depositData);

    res.status(200).json({
      success: true,
      message: 'Deposit updated successfully',
      data: updatedDeposit,
    });
  });

  /**
   * Delete deposit
   * DELETE /api/deposits/:id
   */
  static deleteDeposit = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await DepositService.deleteDeposit(id);

    res.status(200).json({
      success: true,
      message: 'Deposit deleted successfully',
    });
  });

  /**
   * Get deposit statistics
   * GET /api/deposits/stats
   */
  static getDepositStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await DepositService.getDepositStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
