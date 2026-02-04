/**
 * CekGiroOwner Service
 * Handles cek giro owner CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CekGiroOwnerListQuery,
  CekGiroOwnerResponse,
  CreateCekGiroOwnerRequest,
  UpdateCekGiroOwnerRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class CekGiroOwnerService {
  /**
   * Create a new cek giro owner
   */
  static async createCekGiroOwner(data: CreateCekGiroOwnerRequest): Promise<CekGiroOwnerResponse> {
    // Validate cek giro exists
    const cekGiro = await prisma.cekGiro.findUnique({
      where: { code: data.cekGiroCode },
    });

    if (!cekGiro) {
      throw new ValidationError('Cek giro not found');
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { code: data.userCode },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Check if relationship already exists
    const existingOwner = await prisma.cekGiroOwner.findFirst({
      where: {
        cekGiroCode: data.cekGiroCode,
        userCode: data.userCode,
      },
    });

    if (existingOwner) {
      throw new ConflictError('This user is already an owner of this cek giro');
    }

    const newCekGiroOwner = await prisma.cekGiroOwner.create({
      data: {
        cekGiroCode: data.cekGiroCode,
        userCode: data.userCode,
      },
      include: {
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
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

    return newCekGiroOwner;
  }

  /**
   * Get cek giro owner by ID
   */
  static async getCekGiroOwnerById(id: number): Promise<CekGiroOwnerResponse | null> {
    const cekGiroOwner = await prisma.cekGiroOwner.findUnique({
      where: { id },
      include: {
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
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

    return cekGiroOwner;
  }

  /**
   * Get cek giro owners by cek giro code
   */
  static async getCekGiroOwnersByCekGiroCode(cekGiroCode: string): Promise<CekGiroOwnerResponse[]> {
    const cekGiroOwners = await prisma.cekGiroOwner.findMany({
      where: { cekGiroCode },
      include: {
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return cekGiroOwners;
  }

  /**
   * Get cek giro owners by user code
   */
  static async getCekGiroOwnersByUserCode(userCode: string): Promise<CekGiroOwnerResponse[]> {
    const cekGiroOwners = await prisma.cekGiroOwner.findMany({
      where: { userCode },
      include: {
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return cekGiroOwners;
  }

  /**
   * Update cek giro owner
   */
  static async updateCekGiroOwner(
    id: number,
    data: UpdateCekGiroOwnerRequest
  ): Promise<CekGiroOwnerResponse> {
    // Check if cek giro owner exists
    const existingCekGiroOwner = await prisma.cekGiroOwner.findUnique({
      where: { id },
    });

    if (!existingCekGiroOwner) {
      throw new NotFoundError('Cek giro owner not found');
    }

    // Validate cek giro if updating
    if (data.cekGiroCode) {
      const cekGiro = await prisma.cekGiro.findUnique({
        where: { code: data.cekGiroCode },
      });

      if (!cekGiro) {
        throw new ValidationError('Cek giro not found');
      }
    }

    // Validate user if updating
    if (data.userCode) {
      const user = await prisma.user.findUnique({
        where: { code: data.userCode },
      });

      if (!user) {
        throw new ValidationError('User not found');
      }
    }

    // Check if relationship already exists (if updating both)
    const newCekGiroCode = data.cekGiroCode || existingCekGiroOwner.cekGiroCode;
    const newUserCode = data.userCode || existingCekGiroOwner.userCode;

    const duplicateOwner = await prisma.cekGiroOwner.findFirst({
      where: {
        cekGiroCode: newCekGiroCode,
        userCode: newUserCode,
        id: { not: id },
      },
    });

    if (duplicateOwner) {
      throw new ConflictError('This user is already an owner of this cek giro');
    }

    const updatedCekGiroOwner = await prisma.cekGiroOwner.update({
      where: { id },
      data: {
        ...(data.cekGiroCode && { cekGiroCode: data.cekGiroCode }),
        ...(data.userCode && { userCode: data.userCode }),
      },
      include: {
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
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

    return updatedCekGiroOwner;
  }

  /**
   * Delete cek giro owner
   */
  static async deleteCekGiroOwner(id: number): Promise<void> {
    // Check if cek giro owner exists
    const existingCekGiroOwner = await prisma.cekGiroOwner.findUnique({
      where: { id },
    });

    if (!existingCekGiroOwner) {
      throw new NotFoundError('Cek giro owner not found');
    }

    await prisma.cekGiroOwner.delete({ where: { id } });
  }

  /**
   * Get paginated cek giro owners list with filters
   */
  static async getCekGiroOwners(query: CekGiroOwnerListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, cekGiroCode, userCode } = query;

    // Build where clause
    const where: Prisma.CekGiroOwnerWhereInput = {};

    if (search) {
      where.OR = [
        { cekGiroCode: { contains: search, mode: 'insensitive' } },
        { userCode: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (cekGiroCode) {
      where.cekGiroCode = cekGiroCode;
    }

    if (userCode) {
      where.userCode = userCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.CekGiroOwnerOrderByWithRelationInput;

    // Get total count
    const total = await prisma.cekGiroOwner.count({ where });

    // Get cek giro owners
    const cekGiroOwners = await prisma.cekGiroOwner.findMany({
      where,
      include: {
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
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

    return PaginationUtils.createPaginatedResult(cekGiroOwners, page, limit, total);
  }

  /**
   * Get cek giro owner statistics
   */
  static async getCekGiroOwnerStats() {
    const totalCekGiroOwners = await prisma.cekGiroOwner.count();

    // Get count by cek giro
    const ownersByCekGiro = await prisma.cekGiroOwner.groupBy({
      by: ['cekGiroCode'],
      _count: {
        cekGiroCode: true,
      },
    });

    const cekGiroStats = ownersByCekGiro.reduce(
      (acc, item) => {
        acc[item.cekGiroCode] = item._count.cekGiroCode;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalCekGiroOwners,
      ownersByCekGiro: cekGiroStats,
    };
  }
}
