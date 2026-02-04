/**
 * CekGiroOwner Controller
 * Handles cek giro owner management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { CekGiroOwnerService } from '~/services/cekGiroOwnerService';
import {
  CekGiroOwnerListQuery,
  CreateCekGiroOwnerRequest,
  UpdateCekGiroOwnerRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class CekGiroOwnerController {
  /**
   * Create a new cek giro owner
   * POST /api/cek-giro-owners
   */
  static createCekGiroOwner = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const cekGiroOwnerData: CreateCekGiroOwnerRequest = req.body;

      const newCekGiroOwner = await CekGiroOwnerService.createCekGiroOwner(cekGiroOwnerData);

      res.status(201).json({
        success: true,
        message: 'Cek giro owner created successfully',
        data: newCekGiroOwner,
      });
    }
  );

  /**
   * Get all cek giro owners (paginated)
   * GET /api/cek-giro-owners
   */
  static getCekGiroOwners = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: CekGiroOwnerListQuery = req.query as CekGiroOwnerListQuery;

      const result = await CekGiroOwnerService.getCekGiroOwners(query);

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
   * Get cek giro owner by ID
   * GET /api/cek-giro-owners/:id
   */
  static getCekGiroOwnerById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const cekGiroOwner = await CekGiroOwnerService.getCekGiroOwnerById(id);

      if (!cekGiroOwner) {
        throw new NotFoundError('Cek giro owner not found');
      }

      res.status(200).json(ApiResponse.success(cekGiroOwner, null));
    }
  );

  /**
   * Get cek giro owners by cek giro code
   * GET /api/cek-giro-owners/cek-giro/:cekGiroCode
   */
  static getCekGiroOwnersByCekGiroCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const cekGiroCode = req.params.cekGiroCode;

      const cekGiroOwners = await CekGiroOwnerService.getCekGiroOwnersByCekGiroCode(cekGiroCode);

      res.status(200).json(ApiResponse.success(cekGiroOwners, null));
    }
  );

  /**
   * Get cek giro owners by user code
   * GET /api/cek-giro-owners/user/:userCode
   */
  static getCekGiroOwnersByUserCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userCode = req.params.userCode;

      const cekGiroOwners = await CekGiroOwnerService.getCekGiroOwnersByUserCode(userCode);

      res.status(200).json(ApiResponse.success(cekGiroOwners, null));
    }
  );

  /**
   * Update cek giro owner
   * PUT /api/cek-giro-owners/:id
   */
  static updateCekGiroOwner = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const cekGiroOwnerData: UpdateCekGiroOwnerRequest = req.body;

      const updatedCekGiroOwner = await CekGiroOwnerService.updateCekGiroOwner(
        id,
        cekGiroOwnerData
      );

      res.status(200).json({
        success: true,
        message: 'Cek giro owner updated successfully',
        data: updatedCekGiroOwner,
      });
    }
  );

  /**
   * Delete cek giro owner
   * DELETE /api/cek-giro-owners/:id
   */
  static deleteCekGiroOwner = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await CekGiroOwnerService.deleteCekGiroOwner(id);

      res.status(200).json({
        success: true,
        message: 'Cek giro owner deleted successfully',
      });
    }
  );

  /**
   * Get cek giro owner statistics
   * GET /api/cek-giro-owners/stats
   */
  static getCekGiroOwnerStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await CekGiroOwnerService.getCekGiroOwnerStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
