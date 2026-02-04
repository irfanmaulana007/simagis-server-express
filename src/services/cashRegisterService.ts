/**
 * CashRegister Service
 * Handles cash register CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CashRegisterListQuery,
  CashRegisterResponse,
  CreateCashRegisterRequest,
  UpdateCashRegisterRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class CashRegisterService {
  /**
   * Create a new cash register
   */
  static async createCashRegister(data: CreateCashRegisterRequest): Promise<CashRegisterResponse> {
    // Check if cash register code already exists
    const existingCashRegister = await prisma.cashRegister.findUnique({
      where: { code: data.code },
    });

    if (existingCashRegister) {
      throw new ConflictError('Cash register with this code already exists');
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

    const newCashRegister = await prisma.cashRegister.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        userCode: data.userCode,
        date: new Date(data.date),
        amount: data.amount,
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

    return newCashRegister;
  }

  /**
   * Get cash register by ID
   */
  static async getCashRegisterById(id: number): Promise<CashRegisterResponse | null> {
    const cashRegister = await prisma.cashRegister.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
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

    return cashRegister;
  }

  /**
   * Get cash register by code
   */
  static async getCashRegisterByCode(code: string): Promise<CashRegisterResponse | null> {
    const cashRegister = await prisma.cashRegister.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
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

    return cashRegister;
  }

  /**
   * Get cash registers by branch code
   */
  static async getCashRegistersByBranchCode(branchCode: string): Promise<CashRegisterResponse[]> {
    const cashRegisters = await prisma.cashRegister.findMany({
      where: { branchCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
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

    return cashRegisters;
  }

  /**
   * Get cash registers by user code
   */
  static async getCashRegistersByUserCode(userCode: string): Promise<CashRegisterResponse[]> {
    const cashRegisters = await prisma.cashRegister.findMany({
      where: { userCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
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

    return cashRegisters;
  }

  /**
   * Update cash register
   */
  static async updateCashRegister(
    id: number,
    data: UpdateCashRegisterRequest
  ): Promise<CashRegisterResponse> {
    // Check if cash register exists
    const existingCashRegister = await prisma.cashRegister.findUnique({
      where: { id },
    });

    if (!existingCashRegister) {
      throw new NotFoundError('Cash register not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const cashRegisterWithSameCode = await prisma.cashRegister.findUnique({
        where: { code: data.code },
      });

      if (cashRegisterWithSameCode && cashRegisterWithSameCode.id !== id) {
        throw new ConflictError('Cash register with this code already exists');
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

    const updatedCashRegister = await prisma.cashRegister.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.userCode && { userCode: data.userCode }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.amount !== undefined && { amount: data.amount }),
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

    return updatedCashRegister;
  }

  /**
   * Delete cash register
   */
  static async deleteCashRegister(id: number): Promise<void> {
    // Check if cash register exists
    const existingCashRegister = await prisma.cashRegister.findUnique({
      where: { id },
    });

    if (!existingCashRegister) {
      throw new NotFoundError('Cash register not found');
    }

    await prisma.cashRegister.delete({ where: { id } });
  }

  /**
   * Get paginated cash registers list with filters
   */
  static async getCashRegisters(query: CashRegisterListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, userCode } = query;

    // Build where clause
    const where: Prisma.CashRegisterWhereInput = {};

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
    ) as Prisma.CashRegisterOrderByWithRelationInput;

    // Get total count
    const total = await prisma.cashRegister.count({ where });

    // Get cash registers
    const cashRegisters = await prisma.cashRegister.findMany({
      where,
      select: {
        id: true,
        code: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
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

    return PaginationUtils.createPaginatedResult(cashRegisters, page, limit, total);
  }

  /**
   * Get cash register statistics
   */
  static async getCashRegisterStats() {
    const totalCashRegisters = await prisma.cashRegister.count();

    // Get total amount
    const totalAmount = await prisma.cashRegister.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get count by branch
    const cashRegistersByBranch = await prisma.cashRegister.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalCashRegisters,
      totalAmount: totalAmount._sum.amount || 0,
      cashRegistersByBranch: cashRegistersByBranch.map(item => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
