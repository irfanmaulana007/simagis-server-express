/**
 * CekGiroFailStatus Controller
 * Handles cek giro fail status management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { CekGiroFailStatusService } from '~/services/cekGiroFailStatusService';
import {
  CekGiroFailStatusListQuery,
  CreateCekGiroFailStatusRequest,
  UpdateCekGiroFailStatusRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class CekGiroFailStatusController {
  /**
   * Create a new cek giro fail status
   * POST /api/cek-giro-fail-statuses
   */
  static createCekGiroFailStatus = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const statusData: CreateCekGiroFailStatusRequest = req.body;

      const newStatus = await CekGiroFailStatusService.createCekGiroFailStatus(statusData);

      res.status(201).json({
        success: true,
        message: 'Cek giro fail status created successfully',
        data: newStatus,
      });
    }
  );

  /**
   * Get all cek giro fail statuses (paginated)
   * GET /api/cek-giro-fail-statuses
   */
  static getCekGiroFailStatuses = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: CekGiroFailStatusListQuery = req.query as CekGiroFailStatusListQuery;

      const result = await CekGiroFailStatusService.getCekGiroFailStatuses(query);

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
   * Get cek giro fail status by ID
   * GET /api/cek-giro-fail-statuses/:id
   */
  static getCekGiroFailStatusById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const status = await CekGiroFailStatusService.getCekGiroFailStatusById(id);

      if (!status) {
        throw new NotFoundError('Cek giro fail status not found');
      }

      res.status(200).json(ApiResponse.success(status, null));
    }
  );

  /**
   * Get cek giro fail status by code
   * GET /api/cek-giro-fail-statuses/code/:code
   */
  static getCekGiroFailStatusByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const status = await CekGiroFailStatusService.getCekGiroFailStatusByCode(code);

      if (!status) {
        throw new NotFoundError('Cek giro fail status not found');
      }

      res.status(200).json(ApiResponse.success(status, null));
    }
  );

  /**
   * Update cek giro fail status
   * PUT /api/cek-giro-fail-statuses/:id
   */
  static updateCekGiroFailStatus = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const statusData: UpdateCekGiroFailStatusRequest = req.body;

      const updatedStatus = await CekGiroFailStatusService.updateCekGiroFailStatus(id, statusData);

      res.status(200).json({
        success: true,
        message: 'Cek giro fail status updated successfully',
        data: updatedStatus,
      });
    }
  );

  /**
   * Delete cek giro fail status
   * DELETE /api/cek-giro-fail-statuses/:id
   */
  static deleteCekGiroFailStatus = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await CekGiroFailStatusService.deleteCekGiroFailStatus(id);

      res.status(200).json({
        success: true,
        message: 'Cek giro fail status deleted successfully',
      });
    }
  );

  /**
   * Get cek giro fail status statistics
   * GET /api/cek-giro-fail-statuses/stats
   */
  static getCekGiroFailStatusStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await CekGiroFailStatusService.getCekGiroFailStatusStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );

  /**
   * Search cek giro fail statuses
   * GET /api/cek-giro-fail-statuses/search
   */
  static searchCekGiroFailStatuses = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { q: search, page = 1, limit = 10 } = req.query;

      const query: CekGiroFailStatusListQuery = {
        search: search as string,
        page: page as string,
        limit: limit as string,
      };

      const result = await CekGiroFailStatusService.getCekGiroFailStatuses(query);

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
}
