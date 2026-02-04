/**
 * Expense Controller
 * Handles expense management HTTP requests
 */

import { NextFunction, Request, Response } from 'express';
import { ExpenseService } from '~/services/expenseService';
import { CreateExpenseRequest, ExpenseListQuery, UpdateExpenseRequest } from '~/types';
import asyncHandler from '~/utils/asyncHandler';
import { NotFoundError } from '~/utils/customErrors';
import { ApiResponse } from '~/utils/response';

export class ExpenseController {
  /**
   * Create a new expense
   * POST /api/expenses
   */
  static createExpense = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const expenseData: CreateExpenseRequest = req.body;

    const newExpense = await ExpenseService.createExpense(expenseData);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: newExpense,
    });
  });

  /**
   * Get all expenses (paginated)
   * GET /api/expenses
   */
  static getExpenses = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query: ExpenseListQuery = req.query as ExpenseListQuery;

    const result = await ExpenseService.getExpenses(query);

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
   * Get expense by ID
   * GET /api/expenses/:id
   */
  static getExpenseById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    const expense = await ExpenseService.getExpenseById(id);

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    res.status(200).json(ApiResponse.success(expense, null));
  });

  /**
   * Get expense by code
   * GET /api/expenses/code/:code
   */
  static getExpenseByCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const code = req.params.code;

      const expense = await ExpenseService.getExpenseByCode(code);

      if (!expense) {
        throw new NotFoundError('Expense not found');
      }

      res.status(200).json(ApiResponse.success(expense, null));
    }
  );

  /**
   * Get expenses by branch code
   * GET /api/expenses/branch/:branchCode
   */
  static getExpensesByBranchCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const branchCode = req.params.branchCode;

      const expenses = await ExpenseService.getExpensesByBranchCode(branchCode);

      res.status(200).json(ApiResponse.success(expenses, null));
    }
  );

  /**
   * Get expenses by expense category code
   * GET /api/expenses/category/:expenseCategoryCode
   */
  static getExpensesByExpenseCategoryCode = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const expenseCategoryCode = req.params.expenseCategoryCode;

      const expenses = await ExpenseService.getExpensesByExpenseCategoryCode(expenseCategoryCode);

      res.status(200).json(ApiResponse.success(expenses, null));
    }
  );

  /**
   * Update expense
   * PUT /api/expenses/:id
   */
  static updateExpense = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);
    const expenseData: UpdateExpenseRequest = req.body;

    const updatedExpense = await ExpenseService.updateExpense(id, expenseData);

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  });

  /**
   * Delete expense
   * DELETE /api/expenses/:id
   */
  static deleteExpense = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const id = parseInt(req.params.id);

    await ExpenseService.deleteExpense(id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  });

  /**
   * Get expense statistics
   * GET /api/expenses/stats
   */
  static getExpenseStats = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const stats = await ExpenseService.getExpenseStats();

      res.status(200).json(ApiResponse.success(stats, null));
    }
  );
}
