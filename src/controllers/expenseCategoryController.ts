/**
 * ExpenseCategory Controller
 * Handles expense category management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ExpenseCategoryService } from '~/services/expenseCategoryService';
import {
  ExpenseCategoryListQuery,
  CreateExpenseCategoryRequest,
  UpdateExpenseCategoryRequest,
} from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ExpenseCategoryController {
  /**
   * Create a new expense category
   * POST /api/expense-categories
   */
  static createExpenseCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const expenseCategoryData: CreateExpenseCategoryRequest = req.body;

      const newExpenseCategory =
        await ExpenseCategoryService.createExpenseCategory(expenseCategoryData);

      res.status(201).json({
        success: true,
        message: 'Expense category created successfully',
        data: newExpenseCategory,
      });
    }
  );

  /**
   * Get all expense categories (paginated)
   * GET /api/expense-categories
   */
  static getExpenseCategories = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const query: ExpenseCategoryListQuery = req.query as ExpenseCategoryListQuery;

      const result = await ExpenseCategoryService.getExpenseCategories(query);

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
   * Get expense category by ID
   * GET /api/expense-categories/:id
   */
  static getExpenseCategoryById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      const expenseCategory = await ExpenseCategoryService.getExpenseCategoryById(id);

      if (!expenseCategory) {
        throw new NotFoundError('Expense category not found');
      }

      res.status(200).json(ApiResponse.success(expenseCategory, null));
    }
  );

  /**
   * Get expense category by code
   * GET /api/expense-categories/code/:code
   */
  static getExpenseCategoryByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const expenseCategory = await ExpenseCategoryService.getExpenseCategoryByCode(code);

      if (!expenseCategory) {
        throw new NotFoundError('Expense category not found');
      }

      res.status(200).json(ApiResponse.success(expenseCategory, null));
    }
  );

  /**
   * Get expense categories by branch code
   * GET /api/expense-categories/branch/:branchCode
   */
  static getExpenseCategoriesByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const expenseCategories =
        await ExpenseCategoryService.getExpenseCategoriesByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(expenseCategories, null));
    }
  );

  /**
   * Update expense category
   * PUT /api/expense-categories/:id
   */
  static updateExpenseCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);
      const expenseCategoryData: UpdateExpenseCategoryRequest = req.body;

      const updatedExpenseCategory = await ExpenseCategoryService.updateExpenseCategory(
        id,
        expenseCategoryData
      );

      res.status(200).json({
        success: true,
        message: 'Expense category updated successfully',
        data: updatedExpenseCategory,
      });
    }
  );

  /**
   * Delete expense category
   * DELETE /api/expense-categories/:id
   */
  static deleteExpenseCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const id = parseInt(req.params.id);

      await ExpenseCategoryService.deleteExpenseCategory(id);

      res.status(200).json({
        success: true,
        message: 'Expense category deleted successfully',
      });
    }
  );

  /**
   * Get expense category statistics
   * GET /api/expense-categories/stats
   */
  static getExpenseCategoryStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const stats = await ExpenseCategoryService.getExpenseCategoryStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
