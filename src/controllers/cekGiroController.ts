/**
 * CekGiro Controller
 * Handles cek giro management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { CekGiroService } from '~/services/cekGiroService';
import { CekGiroListQuery, CreateCekGiroRequest, UpdateCekGiroRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class CekGiroController {
  /**
   * Create a new cek giro
   * POST /api/cek-giros
   */
  static createCekGiro = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const cekGiroData: CreateCekGiroRequest = req.body;

    const newCekGiro = await CekGiroService.createCekGiro(cekGiroData);

    res.status(201).json({
      success: true,
      message: 'Cek giro created successfully',
      data: newCekGiro,
    });
  });

  /**
   * Get all cek giros (paginated)
   * GET /api/cek-giros
   */
  static getCekGiros = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: CekGiroListQuery = req.query as CekGiroListQuery;

    const result = await CekGiroService.getCekGiros(query);

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
   * Get cek giro by ID
   * GET /api/cek-giros/:id
   */
  static getCekGiroById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const cekGiro = await CekGiroService.getCekGiroById(id);

    if (!cekGiro) {
      throw new NotFoundError('Cek giro not found');
    }

    res.status(200).json(ApiResponse.success(cekGiro, null));
  });

  /**
   * Get cek giro by code
   * GET /api/cek-giros/code/:code
   */
  static getCekGiroByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const cekGiro = await CekGiroService.getCekGiroByCode(code);

      if (!cekGiro) {
        throw new NotFoundError('Cek giro not found');
      }

      res.status(200).json(ApiResponse.success(cekGiro, null));
    }
  );

  /**
   * Get cek giros by type
   * GET /api/cek-giros/type/:type
   */
  static getCekGirosByType = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const type = req.params.type;

      const cekGiros = await CekGiroService.getCekGirosByType(type);

      res.status(200).json(ApiResponse.success(cekGiros, null));
    }
  );

  /**
   * Update cek giro
   * PUT /api/cek-giros/:id
   */
  static updateCekGiro = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const cekGiroData: UpdateCekGiroRequest = req.body;

    const updatedCekGiro = await CekGiroService.updateCekGiro(id, cekGiroData);

    res.status(200).json({
      success: true,
      message: 'Cek giro updated successfully',
      data: updatedCekGiro,
    });
  });

  /**
   * Delete cek giro
   * DELETE /api/cek-giros/:id
   */
  static deleteCekGiro = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await CekGiroService.deleteCekGiro(id);

    res.status(200).json({
      success: true,
      message: 'Cek giro deleted successfully',
    });
  });

  /**
   * Get cek giro statistics
   * GET /api/cek-giros/stats
   */
  static getCekGiroStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await CekGiroService.getCekGiroStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
