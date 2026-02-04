/**
 * Expense Service
 * Handles expense CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateExpenseRequest,
  ExpenseListQuery,
  ExpenseResponse,
  UpdateExpenseRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ExpenseService {
  /**
   * Create a new expense
   */
  static async createExpense(data: CreateExpenseRequest): Promise<ExpenseResponse> {
    // Check if expense code already exists
    const existingExpense = await prisma.expense.findUnique({
      where: { code: data.code },
    });

    if (existingExpense) {
      throw new ConflictError('Expense with this code already exists');
    }

    // Validate code length
    if (data.code.length > 16) {
      throw new ValidationError('Code must be at most 16 characters');
    }

    // Check if referenced branch exists
    const branch = await prisma.branch.findUnique({
      where: { code: data.branchCode },
    });

    if (!branch) {
      throw new NotFoundError('Referenced branch not found');
    }

    // Check if referenced expense category exists
    const expenseCategory = await prisma.expenseCategory.findUnique({
      where: { code: data.expenseCategoryCode },
    });

    if (!expenseCategory) {
      throw new NotFoundError('Referenced expense category not found');
    }

    // Check if referenced user exists
    const user = await prisma.user.findUnique({
      where: { code: data.userCode },
    });

    if (!user) {
      throw new NotFoundError('Referenced user not found');
    }

    const newExpense = await prisma.expense.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        expenseCategoryCode: data.expenseCategoryCode,
        userCode: data.userCode,
        date: new Date(data.date),
        amount: data.amount,
        description: data.description,
      },
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newExpense;
  }

  /**
   * Get expense by ID
   */
  static async getExpenseById(id: number): Promise<ExpenseResponse | null> {
    const expense = await prisma.expense.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        expenseCategory: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return expense;
  }

  /**
   * Get expense by code
   */
  static async getExpenseByCode(code: string): Promise<ExpenseResponse | null> {
    const expense = await prisma.expense.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        expenseCategory: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return expense;
  }

  /**
   * Get expenses by branch code
   */
  static async getExpensesByBranchCode(branchCode: string): Promise<ExpenseResponse[]> {
    const expenses = await prisma.expense.findMany({
      where: { branchCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { date: 'desc' },
    });

    return expenses;
  }

  /**
   * Get expenses by expense category code
   */
  static async getExpensesByExpenseCategoryCode(
    expenseCategoryCode: string
  ): Promise<ExpenseResponse[]> {
    const expenses = await prisma.expense.findMany({
      where: { expenseCategoryCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { date: 'desc' },
    });

    return expenses;
  }

  /**
   * Update expense
   */
  static async updateExpense(id: number, data: UpdateExpenseRequest): Promise<ExpenseResponse> {
    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      throw new NotFoundError('Expense not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const expenseWithSameCode = await prisma.expense.findUnique({
        where: { code: data.code },
      });

      if (expenseWithSameCode && expenseWithSameCode.id !== id) {
        throw new ConflictError('Expense with this code already exists');
      }
    }

    // If updating branchCode, verify it exists
    if (data.branchCode) {
      const branch = await prisma.branch.findUnique({
        where: { code: data.branchCode },
      });

      if (!branch) {
        throw new NotFoundError('Referenced branch not found');
      }
    }

    // If updating expenseCategoryCode, verify it exists
    if (data.expenseCategoryCode) {
      const expenseCategory = await prisma.expenseCategory.findUnique({
        where: { code: data.expenseCategoryCode },
      });

      if (!expenseCategory) {
        throw new NotFoundError('Referenced expense category not found');
      }
    }

    // If updating userCode, verify it exists
    if (data.userCode) {
      const user = await prisma.user.findUnique({
        where: { code: data.userCode },
      });

      if (!user) {
        throw new NotFoundError('Referenced user not found');
      }
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.expenseCategoryCode && { expenseCategoryCode: data.expenseCategoryCode }),
        ...(data.userCode && { userCode: data.userCode }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.description && { description: data.description }),
      },
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedExpense;
  }

  /**
   * Delete expense
   */
  static async deleteExpense(id: number): Promise<void> {
    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      throw new NotFoundError('Expense not found');
    }

    await prisma.expense.delete({ where: { id } });
  }

  /**
   * Get paginated expenses list with filters
   */
  static async getExpenses(query: ExpenseListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, expenseCategoryCode, userCode } = query;

    // Build where clause
    const where: Prisma.ExpenseWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'description']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    if (expenseCategoryCode) {
      where.expenseCategoryCode = expenseCategoryCode;
    }

    if (userCode) {
      where.userCode = userCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ExpenseOrderByWithRelationInput;

    // Get total count
    const total = await prisma.expense.count({ where });

    // Get expenses
    const expenses = await prisma.expense.findMany({
      where,
      select: {
        id: true,
        code: true,
        branchCode: true,
        expenseCategoryCode: true,
        userCode: true,
        date: true,
        amount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        expenseCategory: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(expenses, page, limit, total);
  }

  /**
   * Get expense statistics
   */
  static async getExpenseStats() {
    const totalExpenses = await prisma.expense.count();

    // Get total amount
    const totalAmount = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get count by category
    const expensesByCategory = await prisma.expense.groupBy({
      by: ['expenseCategoryCode'],
      _count: {
        expenseCategoryCode: true,
      },
      _sum: {
        amount: true,
      },
    });

    // Get count by branch
    const expensesByBranch = await prisma.expense.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalExpenses,
      totalAmount: totalAmount._sum.amount || 0,
      expensesByCategory: expensesByCategory.map(item => ({
        expenseCategoryCode: item.expenseCategoryCode,
        count: item._count.expenseCategoryCode,
        totalAmount: item._sum.amount || 0,
      })),
      expensesByBranch: expensesByBranch.map(item => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
