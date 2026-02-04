/**
 * StockOpname Controller
 * Handles stock opname management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { StockOpnameService } from '~/services/stockOpnameService';
import { CreateStockOpnameRequest, StockOpnameListQuery, UpdateStockOpnameRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class StockOpnameController {
  static createStockOpname = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stockOpnameData: CreateStockOpnameRequest = req.body;
      const newStockOpname = await StockOpnameService.createStockOpname(stockOpnameData);
      res.status(201).json({
        success: true,
        message: 'Stock opname created successfully',
        data: newStockOpname,
      });
    }
  );

  static getStockOpnames = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: StockOpnameListQuery = req.query as StockOpnameListQuery;
      const result = await StockOpnameService.getStockOpnames(query);
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

  static getStockOpnameById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const stockOpname = await StockOpnameService.getStockOpnameById(id);
      if (!stockOpname) throw new NotFoundError('Stock opname not found');
      res.status(200).json(ApiResponse.success(stockOpname, null));
    }
  );

  static getStockOpnameByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;
      const stockOpname = await StockOpnameService.getStockOpnameByCode(code);
      if (!stockOpname) throw new NotFoundError('Stock opname not found');
      res.status(200).json(ApiResponse.success(stockOpname, null));
    }
  );

  static getStockOpnamesByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;
      const stockOpnames = await StockOpnameService.getStockOpnamesByBranchCode(branchCode);
      res.status(200).json(ApiResponse.success(stockOpnames, null));
    }
  );

  static updateStockOpname = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const stockOpnameData: UpdateStockOpnameRequest = req.body;
      const updatedStockOpname = await StockOpnameService.updateStockOpname(id, stockOpnameData);
      res.status(200).json({
        success: true,
        message: 'Stock opname updated successfully',
        data: updatedStockOpname,
      });
    }
  );

  static deleteStockOpname = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      await StockOpnameService.deleteStockOpname(id);
      res.status(200).json({
        success: true,
        message: 'Stock opname deleted successfully',
      });
    }
  );

  static getStockOpnameStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await StockOpnameService.getStockOpnameStats();
      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
