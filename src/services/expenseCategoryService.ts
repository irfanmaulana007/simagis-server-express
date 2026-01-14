/**
 * ExpenseCategory Service
 * Handles expense category CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  ExpenseCategoryListQuery,
  ExpenseCategoryResponse,
  CreateExpenseCategoryRequest,
  UpdateExpenseCategoryRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ExpenseCategoryService {
  /**
   * Create a new expense category
   */
  static async createExpenseCategory(
    data: CreateExpenseCategoryRequest
  ): Promise<ExpenseCategoryResponse> {
    // Check if expense category code already exists
    const existingExpenseCategory = await prisma.expenseCategory.findUnique({
      where: { code: data.code },
    });

    if (existingExpenseCategory) {
      throw new ConflictError('Expense category with this code already exists');
    }

    // Validate branch exists
    const branch = await prisma.branch.findUnique({
      where: { code: data.branchCode },
    });

    if (!branch) {
      throw new ValidationError('Branch not found');
    }

    // Validate code length
    if (data.code.length > 10) {
      throw new ValidationError('Code must be at most 10 characters');
    }

    if (data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    const newExpenseCategory = await prisma.expenseCategory.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        name: data.name,
      },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return newExpenseCategory;
  }

  /**
   * Get expense category by ID
   */
  static async getExpenseCategoryById(id: number): Promise<ExpenseCategoryResponse | null> {
    const expenseCategory = await prisma.expenseCategory.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return expenseCategory;
  }

  /**
   * Get expense category by code
   */
  static async getExpenseCategoryByCode(code: string): Promise<ExpenseCategoryResponse | null> {
    const expenseCategory = await prisma.expenseCategory.findUnique({
      where: { code },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return expenseCategory;
  }

  /**
   * Get expense categories by branch code
   */
  static async getExpenseCategoriesByBranchCode(
    branchCode: string
  ): Promise<ExpenseCategoryResponse[]> {
    const expenseCategories = await prisma.expenseCategory.findMany({
      where: { branchCode },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return expenseCategories;
  }

  /**
   * Update expense category
   */
  static async updateExpenseCategory(
    id: number,
    data: UpdateExpenseCategoryRequest
  ): Promise<ExpenseCategoryResponse> {
    // Check if expense category exists
    const existingExpenseCategory = await prisma.expenseCategory.findUnique({
      where: { id },
    });

    if (!existingExpenseCategory) {
      throw new NotFoundError('Expense category not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 10) {
        throw new ValidationError('Code must be at most 10 characters');
      }

      const expenseCategoryWithSameCode = await prisma.expenseCategory.findUnique({
        where: { code: data.code },
      });

      if (expenseCategoryWithSameCode && expenseCategoryWithSameCode.id !== id) {
        throw new ConflictError('Expense category with this code already exists');
      }
    }

    // Validate branch if updating
    if (data.branchCode) {
      const branch = await prisma.branch.findUnique({
        where: { code: data.branchCode },
      });

      if (!branch) {
        throw new ValidationError('Branch not found');
      }
    }

    if (data.name && data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    const updatedExpenseCategory = await prisma.expenseCategory.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.name && { name: data.name }),
      },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return updatedExpenseCategory;
  }

  /**
   * Delete expense category
   */
  static async deleteExpenseCategory(id: number): Promise<void> {
    // Check if expense category exists
    const existingExpenseCategory = await prisma.expenseCategory.findUnique({
      where: { id },
    });

    if (!existingExpenseCategory) {
      throw new NotFoundError('Expense category not found');
    }

    // Check if there are related expenses
    const relatedExpenses = await prisma.expense.count({
      where: { expenseCategoryCode: existingExpenseCategory.code },
    });

    if (relatedExpenses > 0) {
      throw new ConflictError('Cannot delete expense category with existing expenses');
    }

    await prisma.expenseCategory.delete({ where: { id } });
  }

  /**
   * Get paginated expense categories list with filters
   */
  static async getExpenseCategories(query: ExpenseCategoryListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode } = query;

    // Build where clause
    const where: Prisma.ExpenseCategoryWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'name']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ExpenseCategoryOrderByWithRelationInput;

    // Get total count
    const total = await prisma.expenseCategory.count({ where });

    // Get expense categories
    const expenseCategories = await prisma.expenseCategory.findMany({
      where,
      include: {
        branch: {
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

    return PaginationUtils.createPaginatedResult(expenseCategories, page, limit, total);
  }

  /**
   * Get expense category statistics
   */
  static async getExpenseCategoryStats() {
    const totalExpenseCategories = await prisma.expenseCategory.count();

    // Get count by branch
    const expenseCategoriesByBranch = await prisma.expenseCategory.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
    });

    const branchStats = expenseCategoriesByBranch.reduce(
      (acc, item) => {
        acc[item.branchCode] = item._count.branchCode;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalExpenseCategories,
      expenseCategoriesByBranch: branchStats,
    };
  }
}
