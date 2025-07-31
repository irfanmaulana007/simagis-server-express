/**
 * Bank Controller
 * Handles bank management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { BankService } from '~/services/bankService';
import { BankListQuery, CreateBankRequest, UpdateBankRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class BankController {
  /**
   * Create a new bank
   * POST /api/banks
   */
  static createBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bankData: CreateBankRequest = req.body;

    const newBank = await BankService.createBank(bankData);

    res.status(201).json(ApiResponse.created(newBank, 'Bank created successfully'));
  });

  /**
   * Get all banks (paginated)
   * GET /api/banks
   */
  static getBanks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const query: BankListQuery = req.query as BankListQuery;

    const result = await BankService.getBanks(query);

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
   * Get bank by ID
   * GET /api/banks/:id
   */
  static getBankById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    const bank = await BankService.getBankById(id);

    if (!bank) {
      throw new NotFoundError('Bank not found');
    }

    res.status(200).json(ApiResponse.success(bank, null));
  });

  /**
   * Get bank by code
   * GET /api/banks/code/:code
   */
  static getBankByCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const code = req.params.code;

    const bank = await BankService.getBankByCode(code);

    if (!bank) {
      throw new NotFoundError('Bank not found');
    }

    res.status(200).json(ApiResponse.success(bank, null));
  });

  /**
   * Update bank
   * PUT /api/banks/:id
   */
  static updateBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const bankData: UpdateBankRequest = req.body;

    const updatedBank = await BankService.updateBank(id, bankData);

    res.status(200).json(ApiResponse.updated(updatedBank, 'Bank updated successfully'));
  });

  /**
   * Delete bank
   * DELETE /api/banks/:id
   */
  static deleteBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    await BankService.deleteBank(id);

    res.status(200).json(ApiResponse.deleted('Bank deleted successfully'));
  });

  /**
   * Get bank statistics
   * GET /api/banks/stats
   */
  static getBankStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await BankService.getBankStats();

    res.status(200).json(ApiResponse.success(stats, null));
  });

  /**
   * Search banks
   * GET /api/banks/search
   */
  static searchBanks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { q: search, page = 1, limit = 10 } = req.query;

    const query: BankListQuery = {
      search: search as string,
      page: page as string,
      limit: limit as string,
    };

    const result = await BankService.getBanks(query);

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
}
