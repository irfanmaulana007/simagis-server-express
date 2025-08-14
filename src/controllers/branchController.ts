/**
 * Branch Controller
 * Handles branch management HTTP requests
 */

import { PriceTypeEnum } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { BranchService } from '~/services/branchService';
import { BranchListQuery, CreateBranchRequest, UpdateBranchRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class BranchController {
  /**
   * Create a new branch
   * POST /api/branches
   */
  static createBranch = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const branchData: CreateBranchRequest = req.body;

    const newBranch = await BranchService.createBranch(branchData);

    res.status(201).json(ApiResponse.created(newBranch, 'Branch created successfully'));
  });

  /**
   * Get all branches (paginated)
   * GET /api/branches
   */
  static getBranches = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const query: BranchListQuery = req.query as BranchListQuery;

    const result = await BranchService.getBranches(query);

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
   * Get branch by ID
   * GET /api/branches/:id
   */
  static getBranchById = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const id = parseInt(req.params.id);

    const branch = await BranchService.getBranchById(id);

    if (!branch) {
      throw new NotFoundError('Branch not found');
    }

    res.status(200).json(ApiResponse.success(branch, null));
  });

  /**
   * Get branch by code
   * GET /api/branches/code/:code
   */
  static getBranchByCode = asyncHandler(
    async (req: Request, res: Response, __next: NextFunction) => {
      const code = req.params.code;

      const branch = await BranchService.getBranchByCode(code);

      if (!branch) {
        throw new NotFoundError('Branch not found');
      }

      res.status(200).json(ApiResponse.success(branch, null));
    }
  );

  /**
   * Update branch
   * PUT /api/branches/:id
   */
  static updateBranch = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const id = parseInt(req.params.id);
    const branchData: UpdateBranchRequest = req.body;

    const updatedBranch = await BranchService.updateBranch(id, branchData);

    res.status(200).json(ApiResponse.updated(updatedBranch, 'Branch updated successfully'));
  });

  /**
   * Delete branch
   * DELETE /api/branches/:id
   */
  static deleteBranch = asyncHandler(async (req: Request, res: Response, __next: NextFunction) => {
    const id = parseInt(req.params.id);

    await BranchService.deleteBranch(id);

    res.status(200).json(ApiResponse.deleted('Branch deleted successfully'));
  });

  /**
   * Get branches by price type with pagination
   * GET /api/branches/price-type/:priceType
   */
  static getBranchesByPriceType = asyncHandler(
    async (req: Request, res: Response, __next: NextFunction) => {
      const priceType = req.params.priceType as PriceTypeEnum;
      const query: BranchListQuery = req.query as BranchListQuery;

      const result = await BranchService.getBranchesByPriceType(priceType, query);

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
   * Get branch statistics
   * GET /api/branches/stats
   */
  static getBranchStats = asyncHandler(
    async (req: Request, res: Response, __next: NextFunction) => {
      const stats = await BranchService.getBranchStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );


}
