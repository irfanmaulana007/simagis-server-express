/**
 * StockOpname Service
 * Handles stock opname CRUD operations and business logic
 */

import { Prisma, PrismaClient, StatusEnum } from '@prisma/client';
import {
  CreateStockOpnameRequest,
  StockOpnameListQuery,
  StockOpnameResponse,
  UpdateStockOpnameRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class StockOpnameService {
  static async createStockOpname(data: CreateStockOpnameRequest): Promise<StockOpnameResponse> {
    const existingStockOpname = await prisma.stockOpname.findUnique({
      where: { code: data.code },
    });

    if (existingStockOpname) {
      throw new ConflictError('Stock opname with this code already exists');
    }

    if (data.code.length > 10) {
      throw new ValidationError('Code must be at most 10 characters');
    }

    const branch = await prisma.branch.findUnique({
      where: { code: data.branchCode },
    });

    if (!branch) {
      throw new NotFoundError('Referenced branch not found');
    }

    const newStockOpname = await prisma.stockOpname.create({
      data: {
        code: data.code,
        status: data.status,
        branchCode: data.branchCode,
        year: data.year,
        month: data.month,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        year: true,
        month: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newStockOpname;
  }

  static async getStockOpnameById(id: number): Promise<StockOpnameResponse | null> {
    return prisma.stockOpname.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        year: true,
        month: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
        branch: { select: { id: true, code: true, name: true } },
      },
    });
  }

  static async getStockOpnameByCode(code: string): Promise<StockOpnameResponse | null> {
    return prisma.stockOpname.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        year: true,
        month: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
        branch: { select: { id: true, code: true, name: true } },
      },
    });
  }

  static async getStockOpnamesByBranchCode(branchCode: string): Promise<StockOpnameResponse[]> {
    return prisma.stockOpname.findMany({
      where: { branchCode },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        year: true,
        month: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateStockOpname(
    id: number,
    data: UpdateStockOpnameRequest
  ): Promise<StockOpnameResponse> {
    const existingStockOpname = await prisma.stockOpname.findUnique({ where: { id } });

    if (!existingStockOpname) {
      throw new NotFoundError('Stock opname not found');
    }

    if (data.code) {
      if (data.code.length > 10) {
        throw new ValidationError('Code must be at most 10 characters');
      }

      const stockOpnameWithSameCode = await prisma.stockOpname.findUnique({
        where: { code: data.code },
      });

      if (stockOpnameWithSameCode && stockOpnameWithSameCode.id !== id) {
        throw new ConflictError('Stock opname with this code already exists');
      }
    }

    if (data.branchCode) {
      const branch = await prisma.branch.findUnique({ where: { code: data.branchCode } });
      if (!branch) throw new NotFoundError('Referenced branch not found');
    }

    return prisma.stockOpname.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.status && { status: data.status }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.month !== undefined && { month: data.month }),
        ...(data.updatedBy && { updatedBy: data.updatedBy }),
      },
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        year: true,
        month: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async deleteStockOpname(id: number): Promise<void> {
    const existingStockOpname = await prisma.stockOpname.findUnique({ where: { id } });

    if (!existingStockOpname) {
      throw new NotFoundError('Stock opname not found');
    }

    const relatedDetails = await prisma.stockOpnameDetail.count({
      where: { stockOpnameCode: existingStockOpname.code },
    });

    if (relatedDetails > 0) {
      throw new ConflictError('Cannot delete stock opname with existing details');
    }

    await prisma.stockOpname.delete({ where: { id } });
  }

  static async getStockOpnames(query: StockOpnameListQuery) {
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, status, year, month } = query;

    const where: Prisma.StockOpnameWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'createdBy']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) where.branchCode = branchCode;
    if (status) where.status = status as StatusEnum;
    if (year) where.year = year;
    if (month) where.month = month;

    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.StockOpnameOrderByWithRelationInput;

    const total = await prisma.stockOpname.count({ where });

    const stockOpnames = await prisma.stockOpname.findMany({
      where,
      select: {
        id: true,
        code: true,
        status: true,
        branchCode: true,
        year: true,
        month: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
        branch: { select: { id: true, code: true, name: true } },
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(stockOpnames, page, limit, total);
  }

  static async getStockOpnameStats() {
    const totalStockOpnames = await prisma.stockOpname.count();

    const stockOpnamesByStatus = await prisma.stockOpname.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const stockOpnamesByBranch = await prisma.stockOpname.groupBy({
      by: ['branchCode'],
      _count: { branchCode: true },
    });

    return {
      totalStockOpnames,
      stockOpnamesByStatus: stockOpnamesByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      stockOpnamesByBranch: stockOpnamesByBranch.map((item) => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
      })),
    };
  }
}
