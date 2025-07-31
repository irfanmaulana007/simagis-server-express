/**
 * ReimbursementType Controller
 * Handles reimbursement type management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ReimbursementTypeService } from '~/services/reimbursementTypeService';
import {
  CreateReimbursementTypeRequest,
  ReimbursementTypeListQuery,
  UpdateReimbursementTypeRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ReimbursementTypeController {
  /**
   * Create a new reimbursement type
   * POST /api/reimbursement-types
   */
  static createReimbursementType = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reimbursementTypeData: CreateReimbursementTypeRequest = req.body;

      const newReimbursementType =
        await ReimbursementTypeService.createReimbursementType(reimbursementTypeData);

      res
        .status(201)
        .json(ApiResponse.created(newReimbursementType, 'Reimbursement type created successfully'));
    }
  );

  /**
   * Get all reimbursement types (paginated)
   * GET /api/reimbursement-types
   */
  static getReimbursementTypes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query: ReimbursementTypeListQuery = req.query as ReimbursementTypeListQuery;

      const result = await ReimbursementTypeService.getReimbursementTypes(query);

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
   * Get reimbursement type by ID
   * GET /api/reimbursement-types/:id
   */
  static getReimbursementTypeById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id);

      const reimbursementType = await ReimbursementTypeService.getReimbursementTypeById(id);

      if (!reimbursementType) {
        throw new NotFoundError('Reimbursement type not found');
      }

      res.status(200).json(ApiResponse.success(reimbursementType, null));
    }
  );

  /**
   * Get reimbursement type by code
   * GET /api/reimbursement-types/code/:code
   */
  static getReimbursementTypeByCode = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const code = req.params.code;

      const reimbursementType = await ReimbursementTypeService.getReimbursementTypeByCode(code);

      if (!reimbursementType) {
        throw new NotFoundError('Reimbursement type not found');
      }

      res.status(200).json(ApiResponse.success(reimbursementType, null));
    }
  );

  /**
   * Update reimbursement type
   * PUT /api/reimbursement-types/:id
   */
  static updateReimbursementType = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id);
      const reimbursementTypeData: UpdateReimbursementTypeRequest = req.body;

      const updatedReimbursementType = await ReimbursementTypeService.updateReimbursementType(
        id,
        reimbursementTypeData
      );

      res
        .status(200)
        .json(
          ApiResponse.updated(updatedReimbursementType, 'Reimbursement type updated successfully')
        );
    }
  );

  /**
   * Delete reimbursement type
   * DELETE /api/reimbursement-types/:id
   */
  static deleteReimbursementType = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id);

      await ReimbursementTypeService.deleteReimbursementType(id);

      res.status(200).json(ApiResponse.deleted('Reimbursement type deleted successfully'));
    }
  );

  /**
   * Get reimbursement type statistics
   * GET /api/reimbursement-types/stats
   */
  static getReimbursementTypeStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await ReimbursementTypeService.getReimbursementTypeStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );

  /**
   * Search reimbursement types
   * GET /api/reimbursement-types/search
   */
  static searchReimbursementTypes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { q: search, page = 1, limit = 10 } = req.query;

      const query: ReimbursementTypeListQuery = {
        search: search as string,
        page: page as string,
        limit: limit as string,
      };

      const result = await ReimbursementTypeService.getReimbursementTypes(query);

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
