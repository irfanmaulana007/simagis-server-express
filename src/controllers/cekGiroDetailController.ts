/**
 * CekGiroDetail Controller
 * Handles cek giro detail management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { CekGiroDetailService } from '~/services/cekGiroDetailService';
import {
  CekGiroDetailListQuery,
  CreateCekGiroDetailRequest,
  UpdateCekGiroDetailRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class CekGiroDetailController {
  /**
   * Create a new cek giro detail
   * POST /api/cek-giro-details
   */
  static createCekGiroDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const detailData: CreateCekGiroDetailRequest = req.body;

      const newDetail = await CekGiroDetailService.createCekGiroDetail(detailData);

      res.status(201).json({
        success: true,
        message: 'Cek giro detail created successfully',
        data: newDetail,
      });
    }
  );

  /**
   * Get all cek giro details (paginated)
   * GET /api/cek-giro-details
   */
  static getCekGiroDetails = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: CekGiroDetailListQuery = req.query as CekGiroDetailListQuery;

      const result = await CekGiroDetailService.getCekGiroDetails(query);

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
   * Get cek giro detail by ID
   * GET /api/cek-giro-details/:id
   */
  static getCekGiroDetailById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const detail = await CekGiroDetailService.getCekGiroDetailById(id);

      if (!detail) {
        throw new NotFoundError('Cek giro detail not found');
      }

      res.status(200).json(ApiResponse.success(detail, null));
    }
  );

  /**
   * Get cek giro detail by code
   * GET /api/cek-giro-details/code/:code
   */
  static getCekGiroDetailByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const detail = await CekGiroDetailService.getCekGiroDetailByCode(code);

      if (!detail) {
        throw new NotFoundError('Cek giro detail not found');
      }

      res.status(200).json(ApiResponse.success(detail, null));
    }
  );

  /**
   * Get cek giro details by cek giro code
   * GET /api/cek-giro-details/cek-giro/:cekGiroCode
   */
  static getCekGiroDetailsByCekGiroCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const cekGiroCode = req.params.cekGiroCode;

      const details = await CekGiroDetailService.getCekGiroDetailsByCekGiroCode(cekGiroCode);

      res.status(200).json(ApiResponse.success(details, null));
    }
  );

  /**
   * Update cek giro detail
   * PUT /api/cek-giro-details/:id
   */
  static updateCekGiroDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const detailData: UpdateCekGiroDetailRequest = req.body;

      const updatedDetail = await CekGiroDetailService.updateCekGiroDetail(id, detailData);

      res.status(200).json({
        success: true,
        message: 'Cek giro detail updated successfully',
        data: updatedDetail,
      });
    }
  );

  /**
   * Delete cek giro detail
   * DELETE /api/cek-giro-details/:id
   */
  static deleteCekGiroDetail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await CekGiroDetailService.deleteCekGiroDetail(id);

      res.status(200).json({
        success: true,
        message: 'Cek giro detail deleted successfully',
      });
    }
  );

  /**
   * Get cek giro detail statistics
   * GET /api/cek-giro-details/stats
   */
  static getCekGiroDetailStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await CekGiroDetailService.getCekGiroDetailStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
