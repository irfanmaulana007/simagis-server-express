/**
 * Closing Controller
 * Handles closing management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ClosingService } from '~/services/closingService';
import { ClosingListQuery, CreateClosingRequest, UpdateClosingRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ClosingController {
  /**
   * Create a new closing
   * POST /api/closings
   */
  static createClosing = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const closingData: CreateClosingRequest = req.body;

    const newClosing = await ClosingService.createClosing(closingData);

    res.status(201).json({
      success: true,
      message: 'Closing created successfully',
      data: newClosing,
    });
  });

  /**
   * Get all closings (paginated)
   * GET /api/closings
   */
  static getClosings = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: ClosingListQuery = req.query as ClosingListQuery;

    const result = await ClosingService.getClosings(query);

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
   * Get closing by ID
   * GET /api/closings/:id
   */
  static getClosingById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const closing = await ClosingService.getClosingById(id);

    if (!closing) {
      throw new NotFoundError('Closing not found');
    }

    res.status(200).json(ApiResponse.success(closing, null));
  });

  /**
   * Get closing by code
   * GET /api/closings/code/:code
   */
  static getClosingByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const closing = await ClosingService.getClosingByCode(code);

      if (!closing) {
        throw new NotFoundError('Closing not found');
      }

      res.status(200).json(ApiResponse.success(closing, null));
    }
  );

  /**
   * Get closings by branch code
   * GET /api/closings/branch/:branchCode
   */
  static getClosingsByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const closings = await ClosingService.getClosingsByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(closings, null));
    }
  );

  /**
   * Update closing
   * PUT /api/closings/:id
   */
  static updateClosing = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const closingData: UpdateClosingRequest = req.body;

    const updatedClosing = await ClosingService.updateClosing(id, closingData);

    res.status(200).json({
      success: true,
      message: 'Closing updated successfully',
      data: updatedClosing,
    });
  });

  /**
   * Delete closing
   * DELETE /api/closings/:id
   */
  static deleteClosing = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await ClosingService.deleteClosing(id);

    res.status(200).json({
      success: true,
      message: 'Closing deleted successfully',
    });
  });

  /**
   * Get closing statistics
   * GET /api/closings/stats
   */
  static getClosingStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await ClosingService.getClosingStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
