/**
 * Closing Service
 * Handles closing CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  ClosingListQuery,
  ClosingResponse,
  CreateClosingRequest,
  UpdateClosingRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ClosingService {
  /**
   * Create a new closing
   */
  static async createClosing(data: CreateClosingRequest): Promise<ClosingResponse> {
    // Check if closing code already exists
    const existingClosing = await prisma.closing.findUnique({
      where: { code: data.code },
    });

    if (existingClosing) {
      throw new ConflictError('Closing with this code already exists');
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

    // Check if referenced user exists
    const user = await prisma.user.findUnique({
      where: { code: data.userCode },
    });

    if (!user) {
      throw new NotFoundError('Referenced user not found');
    }

    const newClosing = await prisma.closing.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        userCode: data.userCode,
        date: new Date(data.date),
        amount: data.amount,
        debit: data.debit,
        p100000: data.p100000,
        p50000: data.p50000,
        p20000: data.p20000,
        p10000: data.p10000,
        p5000: data.p5000,
        p2000: data.p2000,
        p1000: data.p1000,
        p500: data.p500,
        p200: data.p200,
        p100: data.p100,
        p50: data.p50,
      },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        debit: true,
        p100000: true,
        p50000: true,
        p20000: true,
        p10000: true,
        p5000: true,
        p2000: true,
        p1000: true,
        p500: true,
        p200: true,
        p100: true,
        p50: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newClosing;
  }

  /**
   * Get closing by ID
   */
  static async getClosingById(id: number): Promise<ClosingResponse | null> {
    const closing = await prisma.closing.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        debit: true,
        p100000: true,
        p50000: true,
        p20000: true,
        p10000: true,
        p5000: true,
        p2000: true,
        p1000: true,
        p500: true,
        p200: true,
        p100: true,
        p50: true,
        createdAt: true,
        updatedAt: true,
        branch: {
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

    return closing;
  }

  /**
   * Get closing by code
   */
  static async getClosingByCode(code: string): Promise<ClosingResponse | null> {
    const closing = await prisma.closing.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        debit: true,
        p100000: true,
        p50000: true,
        p20000: true,
        p10000: true,
        p5000: true,
        p2000: true,
        p1000: true,
        p500: true,
        p200: true,
        p100: true,
        p50: true,
        createdAt: true,
        updatedAt: true,
        branch: {
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

    return closing;
  }

  /**
   * Get closings by branch code
   */
  static async getClosingsByBranchCode(branchCode: string): Promise<ClosingResponse[]> {
    const closings = await prisma.closing.findMany({
      where: { branchCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        debit: true,
        p100000: true,
        p50000: true,
        p20000: true,
        p10000: true,
        p5000: true,
        p2000: true,
        p1000: true,
        p500: true,
        p200: true,
        p100: true,
        p50: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { date: 'desc' },
    });

    return closings;
  }

  /**
   * Update closing
   */
  static async updateClosing(id: number, data: UpdateClosingRequest): Promise<ClosingResponse> {
    // Check if closing exists
    const existingClosing = await prisma.closing.findUnique({
      where: { id },
    });

    if (!existingClosing) {
      throw new NotFoundError('Closing not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const closingWithSameCode = await prisma.closing.findUnique({
        where: { code: data.code },
      });

      if (closingWithSameCode && closingWithSameCode.id !== id) {
        throw new ConflictError('Closing with this code already exists');
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

    // If updating userCode, verify it exists
    if (data.userCode) {
      const user = await prisma.user.findUnique({
        where: { code: data.userCode },
      });

      if (!user) {
        throw new NotFoundError('Referenced user not found');
      }
    }

    const updatedClosing = await prisma.closing.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.userCode && { userCode: data.userCode }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.debit !== undefined && { debit: data.debit }),
        ...(data.p100000 !== undefined && { p100000: data.p100000 }),
        ...(data.p50000 !== undefined && { p50000: data.p50000 }),
        ...(data.p20000 !== undefined && { p20000: data.p20000 }),
        ...(data.p10000 !== undefined && { p10000: data.p10000 }),
        ...(data.p5000 !== undefined && { p5000: data.p5000 }),
        ...(data.p2000 !== undefined && { p2000: data.p2000 }),
        ...(data.p1000 !== undefined && { p1000: data.p1000 }),
        ...(data.p500 !== undefined && { p500: data.p500 }),
        ...(data.p200 !== undefined && { p200: data.p200 }),
        ...(data.p100 !== undefined && { p100: data.p100 }),
        ...(data.p50 !== undefined && { p50: data.p50 }),
      },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        debit: true,
        p100000: true,
        p50000: true,
        p20000: true,
        p10000: true,
        p5000: true,
        p2000: true,
        p1000: true,
        p500: true,
        p200: true,
        p100: true,
        p50: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedClosing;
  }

  /**
   * Delete closing
   */
  static async deleteClosing(id: number): Promise<void> {
    // Check if closing exists
    const existingClosing = await prisma.closing.findUnique({
      where: { id },
    });

    if (!existingClosing) {
      throw new NotFoundError('Closing not found');
    }

    await prisma.closing.delete({ where: { id } });
  }

  /**
   * Get paginated closings list with filters
   */
  static async getClosings(query: ClosingListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, userCode } = query;

    // Build where clause
    const where: Prisma.ClosingWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    if (userCode) {
      where.userCode = userCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ClosingOrderByWithRelationInput;

    // Get total count
    const total = await prisma.closing.count({ where });

    // Get closings
    const closings = await prisma.closing.findMany({
      where,
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        debit: true,
        p100000: true,
        p50000: true,
        p20000: true,
        p10000: true,
        p5000: true,
        p2000: true,
        p1000: true,
        p500: true,
        p200: true,
        p100: true,
        p50: true,
        createdAt: true,
        updatedAt: true,
        branch: {
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

    return PaginationUtils.createPaginatedResult(closings, page, limit, total);
  }

  /**
   * Get closing statistics
   */
  static async getClosingStats() {
    const totalClosings = await prisma.closing.count();

    // Get total amount
    const totalAmount = await prisma.closing.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get count by branch
    const closingsByBranch = await prisma.closing.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalClosings,
      totalAmount: totalAmount._sum.amount || 0,
      closingsByBranch: closingsByBranch.map(item => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
