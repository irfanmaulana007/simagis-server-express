/**
 * AccountNumber Controller
 * Handles account number management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { AccountNumberService } from '~/services/accountNumberService';
import {
  AccountNumberListQuery,
  CreateAccountNumberRequest,
  UpdateAccountNumberRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class AccountNumberController {
  /**
   * Create a new account number
   * POST /api/account-numbers
   */
  static createAccountNumber = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const accountNumberData: CreateAccountNumberRequest = req.body;

      const newAccountNumber = await AccountNumberService.createAccountNumber(accountNumberData);

      res.status(201).json({
        success: true,
        message: 'Account number created successfully',
        data: newAccountNumber,
      });
    }
  );

  /**
   * Get all account numbers (paginated)
   * GET /api/account-numbers
   */
  static getAccountNumbers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: AccountNumberListQuery = req.query as AccountNumberListQuery;

      const result = await AccountNumberService.getAccountNumbers(query);

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
   * Get account number by ID
   * GET /api/account-numbers/:id
   */
  static getAccountNumberById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const accountNumber = await AccountNumberService.getAccountNumberById(id);

      if (!accountNumber) {
        throw new NotFoundError('Account number not found');
      }

      res.status(200).json(ApiResponse.success(accountNumber, null));
    }
  );

  /**
   * Get account number by account number
   * GET /api/account-numbers/number/:accountNumber
   */
  static getAccountNumberByNumber = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const accountNumber = req.params.accountNumber;

      const record = await AccountNumberService.getAccountNumberByNumber(accountNumber);

      if (!record) {
        throw new NotFoundError('Account number not found');
      }

      res.status(200).json(ApiResponse.success(record, null));
    }
  );

  /**
   * Get account numbers by owner code
   * GET /api/account-numbers/owner/:ownerCode
   */
  static getAccountNumbersByOwnerCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const ownerCode = req.params.ownerCode;

      const accountNumbers = await AccountNumberService.getAccountNumbersByOwnerCode(ownerCode);

      res.status(200).json(ApiResponse.success(accountNumbers, null));
    }
  );

  /**
   * Get account numbers by bank code
   * GET /api/account-numbers/bank/:bankCode
   */
  static getAccountNumbersByBankCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const bankCode = req.params.bankCode;

      const accountNumbers = await AccountNumberService.getAccountNumbersByBankCode(bankCode);

      res.status(200).json(ApiResponse.success(accountNumbers, null));
    }
  );

  /**
   * Get account numbers by module
   * GET /api/account-numbers/module/:module
   */
  static getAccountNumbersByModule = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const module = req.params.module;

      const accountNumbers = await AccountNumberService.getAccountNumbersByModule(module);

      res.status(200).json(ApiResponse.success(accountNumbers, null));
    }
  );

  /**
   * Update account number
   * PUT /api/account-numbers/:id
   */
  static updateAccountNumber = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const accountNumberData: UpdateAccountNumberRequest = req.body;

      const updatedAccountNumber = await AccountNumberService.updateAccountNumber(
        id,
        accountNumberData
      );

      res.status(200).json({
        success: true,
        message: 'Account number updated successfully',
        data: updatedAccountNumber,
      });
    }
  );

  /**
   * Delete account number
   * DELETE /api/account-numbers/:id
   */
  static deleteAccountNumber = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await AccountNumberService.deleteAccountNumber(id);

      res.status(200).json({
        success: true,
        message: 'Account number deleted successfully',
      });
    }
  );

  /**
   * Get account number statistics
   * GET /api/account-numbers/stats
   */
  static getAccountNumberStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await AccountNumberService.getAccountNumberStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
