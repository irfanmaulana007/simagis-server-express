/**
 * ReimbursementType Service
 * Handles reimbursement type CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateReimbursementTypeRequest,
  ReimbursementTypeListQuery,
  ReimbursementTypeResponse,
  UpdateReimbursementTypeRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ReimbursementTypeService {
  /**
   * Create a new reimbursement type
   */
  static async createReimbursementType(
    reimbursementTypeData: CreateReimbursementTypeRequest
  ): Promise<ReimbursementTypeResponse> {
    // Check if reimbursement type with same code already exists
    const existingReimbursementTypeByCode = await prisma.reimbursementType.findUnique({
      where: { code: reimbursementTypeData.code },
    });

    if (existingReimbursementTypeByCode) {
      throw new ConflictError('Reimbursement type with this code already exists');
    }

    // Check if reimbursement type with same name already exists
    const existingReimbursementTypeByName = await prisma.reimbursementType.findUnique({
      where: { name: reimbursementTypeData.name },
    });

    if (existingReimbursementTypeByName) {
      throw new ConflictError('Reimbursement type with this name already exists');
    }

    // Validate code length (should be 7 characters)
    if (reimbursementTypeData.code.length !== 7) {
      throw new ValidationError('Reimbursement type code must be exactly 7 characters');
    }

    const newReimbursementType = await prisma.reimbursementType.create({
      data: {
        code: reimbursementTypeData.code.toUpperCase(),
        name: reimbursementTypeData.name,
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newReimbursementType;
  }

  /**
   * Get reimbursement type by ID
   */
  static async getReimbursementTypeById(id: number): Promise<ReimbursementTypeResponse | null> {
    const reimbursementType = await prisma.reimbursementType.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reimbursementType;
  }

  /**
   * Get reimbursement type by code
   */
  static async getReimbursementTypeByCode(code: string): Promise<ReimbursementTypeResponse | null> {
    const reimbursementType = await prisma.reimbursementType.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reimbursementType;
  }

  /**
   * Update reimbursement type
   */
  static async updateReimbursementType(
    id: number,
    reimbursementTypeData: UpdateReimbursementTypeRequest
  ): Promise<ReimbursementTypeResponse> {
    // Check if reimbursement type exists
    const existingReimbursementType = await prisma.reimbursementType.findUnique({
      where: { id },
    });

    if (!existingReimbursementType) {
      throw new NotFoundError('Reimbursement type not found');
    }

    // If updating code, check uniqueness and length
    if (reimbursementTypeData.code) {
      if (reimbursementTypeData.code.length !== 7) {
        throw new ValidationError('Reimbursement type code must be exactly 7 characters');
      }

      const reimbursementTypeWithSameCode = await prisma.reimbursementType.findUnique({
        where: { code: reimbursementTypeData.code },
      });

      if (reimbursementTypeWithSameCode && reimbursementTypeWithSameCode.id !== id) {
        throw new ConflictError('Reimbursement type with this code already exists');
      }
    }

    // If updating name, check uniqueness
    if (reimbursementTypeData.name) {
      const reimbursementTypeWithSameName = await prisma.reimbursementType.findUnique({
        where: { name: reimbursementTypeData.name },
      });

      if (reimbursementTypeWithSameName && reimbursementTypeWithSameName.id !== id) {
        throw new ConflictError('Reimbursement type with this name already exists');
      }
    }

    const updatedReimbursementType = await prisma.reimbursementType.update({
      where: { id },
      data: {
        ...(reimbursementTypeData.code && { code: reimbursementTypeData.code.toUpperCase() }),
        ...(reimbursementTypeData.name && { name: reimbursementTypeData.name }),
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedReimbursementType;
  }

  /**
   * Delete reimbursement type
   */
  static async deleteReimbursementType(id: number): Promise<void> {
    // Check if reimbursement type exists
    const existingReimbursementType = await prisma.reimbursementType.findUnique({
      where: { id },
    });

    if (!existingReimbursementType) {
      throw new NotFoundError('Reimbursement type not found');
    }

    // Note: ReimbursementType doesn't have any relations in the schema,
    // so we can delete it directly without checking references

    await prisma.reimbursementType.delete({ where: { id } });
  }

  /**
   * Get paginated reimbursement types list with filters
   */
  static async getReimbursementTypes(query: ReimbursementTypeListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search } = query;

    // Build where clause
    const where: Prisma.ReimbursementTypeWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['name', 'code']);
      Object.assign(where, searchFilter);
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ReimbursementTypeOrderByWithRelationInput;

    // Get total count
    const total = await prisma.reimbursementType.count({ where });

    // Get reimbursement types
    const reimbursementTypes = await prisma.reimbursementType.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(reimbursementTypes, page, limit, total);
  }

  /**
   * Get reimbursement type statistics
   */
  static async getReimbursementTypeStats() {
    const totalReimbursementTypes = await prisma.reimbursementType.count();

    return {
      totalReimbursementTypes,
    };
  }
}
