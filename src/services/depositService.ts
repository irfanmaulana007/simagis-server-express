/**
 * Deposit Service
 * Handles deposit CRUD operations and business logic
 */

import { Prisma, PrismaClient, StatusEnum } from '@prisma/client';
import {
  CreateDepositRequest,
  DepositListQuery,
  DepositResponse,
  UpdateDepositRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class DepositService {
  /**
   * Create a new deposit
   */
  static async createDeposit(data: CreateDepositRequest): Promise<DepositResponse> {
    // Check if deposit code already exists
    const existingDeposit = await prisma.deposit.findUnique({
      where: { code: data.code },
    });

    if (existingDeposit) {
      throw new ConflictError('Deposit with this code already exists');
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

    const newDeposit = await prisma.deposit.create({
      data: {
        code: data.code,
        status: data.status,
        branchCode: data.branchCode,
        userCode: data.userCode,
        date: new Date(data.date),
        amount: data.amount,
        note: data.note,
      },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newDeposit;
  }

  /**
   * Get deposit by ID
   */
  static async getDepositById(id: number): Promise<DepositResponse | null> {
    const deposit = await prisma.deposit.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
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

    return deposit;
  }

  /**
   * Get deposit by code
   */
  static async getDepositByCode(code: string): Promise<DepositResponse | null> {
    const deposit = await prisma.deposit.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
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

    return deposit;
  }

  /**
   * Get deposits by branch code
   */
  static async getDepositsByBranchCode(branchCode: string): Promise<DepositResponse[]> {
    const deposits = await prisma.deposit.findMany({
      where: { branchCode },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { date: 'desc' },
    });

    return deposits;
  }

  /**
   * Get deposits by status
   */
  static async getDepositsByStatus(status: StatusEnum): Promise<DepositResponse[]> {
    const deposits = await prisma.deposit.findMany({
      where: { status },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { date: 'desc' },
    });

    return deposits;
  }

  /**
   * Update deposit
   */
  static async updateDeposit(id: number, data: UpdateDepositRequest): Promise<DepositResponse> {
    // Check if deposit exists
    const existingDeposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!existingDeposit) {
      throw new NotFoundError('Deposit not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const depositWithSameCode = await prisma.deposit.findUnique({
        where: { code: data.code },
      });

      if (depositWithSameCode && depositWithSameCode.id !== id) {
        throw new ConflictError('Deposit with this code already exists');
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

    const updatedDeposit = await prisma.deposit.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.status && { status: data.status }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.userCode && { userCode: data.userCode }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.note !== undefined && { note: data.note }),
      },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedDeposit;
  }

  /**
   * Delete deposit
   */
  static async deleteDeposit(id: number): Promise<void> {
    // Check if deposit exists
    const existingDeposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!existingDeposit) {
      throw new NotFoundError('Deposit not found');
    }

    await prisma.deposit.delete({ where: { id } });
  }

  /**
   * Get paginated deposits list with filters
   */
  static async getDeposits(query: DepositListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, userCode, status } = query;

    // Build where clause
    const where: Prisma.DepositWhereInput = {};

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

    if (status) {
      where.status = status as StatusEnum;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.DepositOrderByWithRelationInput;

    // Get total count
    const total = await prisma.deposit.count({ where });

    // Get deposits
    const deposits = await prisma.deposit.findMany({
      where,
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        userCode: true,
        date: true,
        amount: true,
        note: true,
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

    return PaginationUtils.createPaginatedResult(deposits, page, limit, total);
  }

  /**
   * Get deposit statistics
   */
  static async getDepositStats() {
    const totalDeposits = await prisma.deposit.count();

    // Get total amount
    const totalAmount = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get count by status
    const depositsByStatus = await prisma.deposit.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      _sum: {
        amount: true,
      },
    });

    // Get count by branch
    const depositsByBranch = await prisma.deposit.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalDeposits,
      totalAmount: totalAmount._sum.amount || 0,
      depositsByStatus: depositsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
        totalAmount: item._sum.amount || 0,
      })),
      depositsByBranch: depositsByBranch.map((item) => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
