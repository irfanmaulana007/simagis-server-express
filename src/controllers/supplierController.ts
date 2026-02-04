/**
 * Supplier Controller
 * Handles supplier management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { SupplierService } from '~/services/supplierService';
import { SupplierListQuery, CreateSupplierRequest, UpdateSupplierRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class SupplierController {
  /**
   * Create a new supplier
   * POST /api/suppliers
   */
  static createSupplier = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const supplierData: CreateSupplierRequest = req.body;

    const newSupplier = await SupplierService.createSupplier(supplierData);

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: newSupplier,
    });
  });

  /**
   * Get all suppliers (paginated)
   * GET /api/suppliers
   */
  static getSuppliers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: SupplierListQuery = req.query as SupplierListQuery;

    const result = await SupplierService.getSuppliers(query);

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
   * Get supplier by ID
   * GET /api/suppliers/:id
   */
  static getSupplierById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const supplier = await SupplierService.getSupplierById(id);

      if (!supplier) {
        throw new NotFoundError('Supplier not found');
      }

      res.status(200).json(ApiResponse.success(supplier, null));
    }
  );

  /**
   * Get supplier by code
   * GET /api/suppliers/code/:code
   */
  static getSupplierByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const supplier = await SupplierService.getSupplierByCode(code);

      if (!supplier) {
        throw new NotFoundError('Supplier not found');
      }

      res.status(200).json(ApiResponse.success(supplier, null));
    }
  );

  /**
   * Get suppliers by branch code
   * GET /api/suppliers/branch/:branchCode
   */
  static getSuppliersByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const suppliers = await SupplierService.getSuppliersByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(suppliers, null));
    }
  );

  /**
   * Update supplier
   * PUT /api/suppliers/:id
   */
  static updateSupplier = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const supplierData: UpdateSupplierRequest = req.body;

    const updatedSupplier = await SupplierService.updateSupplier(id, supplierData);

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    });
  });

  /**
   * Delete supplier
   * DELETE /api/suppliers/:id
   */
  static deleteSupplier = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await SupplierService.deleteSupplier(id);

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  });

  /**
   * Get supplier statistics
   * GET /api/suppliers/stats
   */
  static getSupplierStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await SupplierService.getSupplierStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
