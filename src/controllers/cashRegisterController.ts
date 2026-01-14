/**
 * CashRegister Controller
 * Handles cash register management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { CashRegisterService } from '~/services/cashRegisterService';
import {
  CashRegisterListQuery,
  CreateCashRegisterRequest,
  UpdateCashRegisterRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class CashRegisterController {
  /**
   * Create a new cash register
   * POST /api/cash-registers
   */
  static createCashRegister = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const cashRegisterData: CreateCashRegisterRequest = req.body;

      const newCashRegister = await CashRegisterService.createCashRegister(cashRegisterData);

      res.status(201).json({
        success: true,
        message: 'Cash register created successfully',
        data: newCashRegister,
      });
    }
  );

  /**
   * Get all cash registers (paginated)
   * GET /api/cash-registers
   */
  static getCashRegisters = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: CashRegisterListQuery = req.query as CashRegisterListQuery;

      const result = await CashRegisterService.getCashRegisters(query);

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
   * Get cash register by ID
   * GET /api/cash-registers/:id
   */
  static getCashRegisterById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const cashRegister = await CashRegisterService.getCashRegisterById(id);

      if (!cashRegister) {
        throw new NotFoundError('Cash register not found');
      }

      res.status(200).json(ApiResponse.success(cashRegister, null));
    }
  );

  /**
   * Get cash register by code
   * GET /api/cash-registers/code/:code
   */
  static getCashRegisterByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const cashRegister = await CashRegisterService.getCashRegisterByCode(code);

      if (!cashRegister) {
        throw new NotFoundError('Cash register not found');
      }

      res.status(200).json(ApiResponse.success(cashRegister, null));
    }
  );

  /**
   * Get cash registers by branch code
   * GET /api/cash-registers/branch/:branchCode
   */
  static getCashRegistersByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const cashRegisters = await CashRegisterService.getCashRegistersByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(cashRegisters, null));
    }
  );

  /**
   * Get cash registers by user code
   * GET /api/cash-registers/user/:userCode
   */
  static getCashRegistersByUserCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userCode = req.params.userCode;

      const cashRegisters = await CashRegisterService.getCashRegistersByUserCode(userCode);

      res.status(200).json(ApiResponse.success(cashRegisters, null));
    }
  );

  /**
   * Update cash register
   * PUT /api/cash-registers/:id
   */
  static updateCashRegister = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const cashRegisterData: UpdateCashRegisterRequest = req.body;

      const updatedCashRegister = await CashRegisterService.updateCashRegister(
        id,
        cashRegisterData
      );

      res.status(200).json({
        success: true,
        message: 'Cash register updated successfully',
        data: updatedCashRegister,
      });
    }
  );

  /**
   * Delete cash register
   * DELETE /api/cash-registers/:id
   */
  static deleteCashRegister = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await CashRegisterService.deleteCashRegister(id);

      res.status(200).json({
        success: true,
        message: 'Cash register deleted successfully',
      });
    }
  );

  /**
   * Get cash register statistics
   * GET /api/cash-registers/stats
   */
  static getCashRegisterStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await CashRegisterService.getCashRegisterStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
