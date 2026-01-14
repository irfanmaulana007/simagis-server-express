/**
 * CekGiro Service
 * Handles cek giro CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CekGiroListQuery,
  CekGiroResponse,
  CreateCekGiroRequest,
  UpdateCekGiroRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class CekGiroService {
  /**
   * Create a new cek giro
   */
  static async createCekGiro(data: CreateCekGiroRequest): Promise<CekGiroResponse> {
    // Check if cek giro code already exists
    const existingCekGiro = await prisma.cekGiro.findUnique({
      where: { code: data.code },
    });

    if (existingCekGiro) {
      throw new ConflictError('Cek giro with this code already exists');
    }

    // Validate code length
    if (data.code.length > 20) {
      throw new ValidationError('Code must be at most 20 characters');
    }

    if (data.type.length > 50) {
      throw new ValidationError('Type must be at most 50 characters');
    }

    if (data.accountNumber.length > 50) {
      throw new ValidationError('Account number must be at most 50 characters');
    }

    const newCekGiro = await prisma.cekGiro.create({
      data: {
        type: data.type,
        code: data.code,
        accountNumber: data.accountNumber,
        date: new Date(data.date),
      },
      select: {
        id: true,
        type: true,
        code: true,
        accountNumber: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newCekGiro;
  }

  /**
   * Get cek giro by ID
   */
  static async getCekGiroById(id: number): Promise<CekGiroResponse | null> {
    const cekGiro = await prisma.cekGiro.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        code: true,
        accountNumber: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        CekGiroDetail: true,
        CekGiroOwner: {
          include: {
            user: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return cekGiro;
  }

  /**
   * Get cek giro by code
   */
  static async getCekGiroByCode(code: string): Promise<CekGiroResponse | null> {
    const cekGiro = await prisma.cekGiro.findUnique({
      where: { code },
      select: {
        id: true,
        type: true,
        code: true,
        accountNumber: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        CekGiroDetail: true,
        CekGiroOwner: {
          include: {
            user: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return cekGiro;
  }

  /**
   * Get cek giros by type
   */
  static async getCekGirosByType(type: string): Promise<CekGiroResponse[]> {
    const cekGiros = await prisma.cekGiro.findMany({
      where: { type },
      select: {
        id: true,
        type: true,
        code: true,
        accountNumber: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return cekGiros;
  }

  /**
   * Update cek giro
   */
  static async updateCekGiro(id: number, data: UpdateCekGiroRequest): Promise<CekGiroResponse> {
    // Check if cek giro exists
    const existingCekGiro = await prisma.cekGiro.findUnique({
      where: { id },
    });

    if (!existingCekGiro) {
      throw new NotFoundError('Cek giro not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 20) {
        throw new ValidationError('Code must be at most 20 characters');
      }

      const cekGiroWithSameCode = await prisma.cekGiro.findUnique({
        where: { code: data.code },
      });

      if (cekGiroWithSameCode && cekGiroWithSameCode.id !== id) {
        throw new ConflictError('Cek giro with this code already exists');
      }
    }

    if (data.type && data.type.length > 50) {
      throw new ValidationError('Type must be at most 50 characters');
    }

    if (data.accountNumber && data.accountNumber.length > 50) {
      throw new ValidationError('Account number must be at most 50 characters');
    }

    const updatedCekGiro = await prisma.cekGiro.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.code && { code: data.code }),
        ...(data.accountNumber && { accountNumber: data.accountNumber }),
        ...(data.date && { date: new Date(data.date) }),
      },
      select: {
        id: true,
        type: true,
        code: true,
        accountNumber: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedCekGiro;
  }

  /**
   * Delete cek giro
   */
  static async deleteCekGiro(id: number): Promise<void> {
    // Check if cek giro exists
    const existingCekGiro = await prisma.cekGiro.findUnique({
      where: { id },
    });

    if (!existingCekGiro) {
      throw new NotFoundError('Cek giro not found');
    }

    // Check if there are related records
    const relatedDetails = await prisma.cekGiroDetail.count({
      where: { cekGiroCode: existingCekGiro.code },
    });

    if (relatedDetails > 0) {
      throw new ConflictError('Cannot delete cek giro with existing details');
    }

    const relatedOwners = await prisma.cekGiroOwner.count({
      where: { cekGiroCode: existingCekGiro.code },
    });

    if (relatedOwners > 0) {
      throw new ConflictError('Cannot delete cek giro with existing owners');
    }

    await prisma.cekGiro.delete({ where: { id } });
  }

  /**
   * Get paginated cek giros list with filters
   */
  static async getCekGiros(query: CekGiroListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, type } = query;

    // Build where clause
    const where: Prisma.CekGiroWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'code',
        'accountNumber',
        'type',
      ]);
      Object.assign(where, searchFilter);
    }

    if (type) {
      where.type = type;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.CekGiroOrderByWithRelationInput;

    // Get total count
    const total = await prisma.cekGiro.count({ where });

    // Get cek giros
    const cekGiros = await prisma.cekGiro.findMany({
      where,
      select: {
        id: true,
        type: true,
        code: true,
        accountNumber: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(cekGiros, page, limit, total);
  }

  /**
   * Get cek giro statistics
   */
  static async getCekGiroStats() {
    const totalCekGiros = await prisma.cekGiro.count();

    // Get count by type
    const cekGirosByType = await prisma.cekGiro.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
    });

    const typeStats = cekGirosByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalCekGiros,
      cekGirosByType: typeStats,
    };
  }
}
