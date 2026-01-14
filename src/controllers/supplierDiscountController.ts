/**
 * SupplierDiscount Controller
 * Handles supplier discount management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { SupplierDiscountService } from '~/services/supplierDiscountService';
import {
  CreateSupplierDiscountRequest,
  SupplierDiscountListQuery,
  UpdateSupplierDiscountRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class SupplierDiscountController {
  /**
   * Create a new supplier discount
   * POST /api/supplier-discounts
   */
  static createSupplierDiscount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const discountData: CreateSupplierDiscountRequest = req.body;

      const newDiscount = await SupplierDiscountService.createSupplierDiscount(discountData);

      res.status(201).json({
        success: true,
        message: 'Supplier discount created successfully',
        data: newDiscount,
      });
    }
  );

  /**
   * Get all supplier discounts (paginated)
   * GET /api/supplier-discounts
   */
  static getSupplierDiscounts = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: SupplierDiscountListQuery = req.query as SupplierDiscountListQuery;

      const result = await SupplierDiscountService.getSupplierDiscounts(query);

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
   * Get supplier discount by ID
   * GET /api/supplier-discounts/:id
   */
  static getSupplierDiscountById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const discount = await SupplierDiscountService.getSupplierDiscountById(id);

      if (!discount) {
        throw new NotFoundError('Supplier discount not found');
      }

      res.status(200).json(ApiResponse.success(discount, null));
    }
  );

  /**
   * Get supplier discount by code
   * GET /api/supplier-discounts/code/:code
   */
  static getSupplierDiscountByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const discount = await SupplierDiscountService.getSupplierDiscountByCode(code);

      if (!discount) {
        throw new NotFoundError('Supplier discount not found');
      }

      res.status(200).json(ApiResponse.success(discount, null));
    }
  );

  /**
   * Get supplier discounts by supplier code
   * GET /api/supplier-discounts/supplier/:supplierCode
   */
  static getSupplierDiscountsBySupplierCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const supplierCode = req.params.supplierCode;

      const discounts =
        await SupplierDiscountService.getSupplierDiscountsBySupplierCode(supplierCode);

      res.status(200).json(ApiResponse.success(discounts, null));
    }
  );

  /**
   * Update supplier discount
   * PUT /api/supplier-discounts/:id
   */
  static updateSupplierDiscount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const discountData: UpdateSupplierDiscountRequest = req.body;

      const updatedDiscount = await SupplierDiscountService.updateSupplierDiscount(
        id,
        discountData
      );

      res.status(200).json({
        success: true,
        message: 'Supplier discount updated successfully',
        data: updatedDiscount,
      });
    }
  );

  /**
   * Delete supplier discount
   * DELETE /api/supplier-discounts/:id
   */
  static deleteSupplierDiscount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await SupplierDiscountService.deleteSupplierDiscount(id);

      res.status(200).json({
        success: true,
        message: 'Supplier discount deleted successfully',
      });
    }
  );

  /**
   * Get supplier discount statistics
   * GET /api/supplier-discounts/stats
   */
  static getSupplierDiscountStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await SupplierDiscountService.getSupplierDiscountStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
