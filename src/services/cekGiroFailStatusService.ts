/**
 * CekGiroFailStatus Service
 * Handles cek giro fail status CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CekGiroFailStatusListQuery,
  CekGiroFailStatusResponse,
  CreateCekGiroFailStatusRequest,
  UpdateCekGiroFailStatusRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class CekGiroFailStatusService {
  /**
   * Create a new cek giro fail status
   */
  static async createCekGiroFailStatus(
    data: CreateCekGiroFailStatusRequest
  ): Promise<CekGiroFailStatusResponse> {
    // Check if cek giro fail status with same code already exists
    const existingStatus = await prisma.cekGiroFailStatus.findUnique({
      where: { code: data.code },
    });

    if (existingStatus) {
      throw new ConflictError('Cek giro fail status with this code already exists');
    }

    // Check if cek giro fail status with same name already exists
    const existingStatusByName = await prisma.cekGiroFailStatus.findUnique({
      where: { name: data.name },
    });

    if (existingStatusByName) {
      throw new ConflictError('Cek giro fail status with this name already exists');
    }

    // Validate code length (should be 7 characters or less)
    if (data.code.length > 7) {
      throw new ValidationError('Cek giro fail status code must be at most 7 characters');
    }

    const newStatus = await prisma.cekGiroFailStatus.create({
      data: {
        code: data.code.toUpperCase(),
        name: data.name,
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newStatus;
  }

  /**
   * Get cek giro fail status by ID
   */
  static async getCekGiroFailStatusById(id: number): Promise<CekGiroFailStatusResponse | null> {
    const status = await prisma.cekGiroFailStatus.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return status;
  }

  /**
   * Get cek giro fail status by code
   */
  static async getCekGiroFailStatusByCode(code: string): Promise<CekGiroFailStatusResponse | null> {
    const status = await prisma.cekGiroFailStatus.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return status;
  }

  /**
   * Update cek giro fail status
   */
  static async updateCekGiroFailStatus(
    id: number,
    data: UpdateCekGiroFailStatusRequest
  ): Promise<CekGiroFailStatusResponse> {
    // Check if cek giro fail status exists
    const existingStatus = await prisma.cekGiroFailStatus.findUnique({
      where: { id },
    });

    if (!existingStatus) {
      throw new NotFoundError('Cek giro fail status not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 7) {
        throw new ValidationError('Cek giro fail status code must be at most 7 characters');
      }

      const statusWithSameCode = await prisma.cekGiroFailStatus.findUnique({
        where: { code: data.code },
      });

      if (statusWithSameCode && statusWithSameCode.id !== id) {
        throw new ConflictError('Cek giro fail status with this code already exists');
      }
    }

    // If updating name, check uniqueness
    if (data.name) {
      const statusWithSameName = await prisma.cekGiroFailStatus.findUnique({
        where: { name: data.name },
      });

      if (statusWithSameName && statusWithSameName.id !== id) {
        throw new ConflictError('Cek giro fail status with this name already exists');
      }
    }

    const updatedStatus = await prisma.cekGiroFailStatus.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code.toUpperCase() }),
        ...(data.name && { name: data.name }),
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedStatus;
  }

  /**
   * Delete cek giro fail status
   */
  static async deleteCekGiroFailStatus(id: number): Promise<void> {
    // Check if cek giro fail status exists
    const existingStatus = await prisma.cekGiroFailStatus.findUnique({
      where: { id },
    });

    if (!existingStatus) {
      throw new NotFoundError('Cek giro fail status not found');
    }

    // Note: Since this is a reference table, we can delete it
    // If there are any foreign key constraints in the future, they should be handled here

    await prisma.cekGiroFailStatus.delete({ where: { id } });
  }

  /**
   * Get paginated cek giro fail status list with filters
   */
  static async getCekGiroFailStatuses(query: CekGiroFailStatusListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search } = query;

    // Build where clause
    const where: Prisma.CekGiroFailStatusWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['name', 'code']);
      Object.assign(where, searchFilter);
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.CekGiroFailStatusOrderByWithRelationInput;

    // Get total count
    const total = await prisma.cekGiroFailStatus.count({ where });

    // Get cek giro fail statuses
    const statuses = await prisma.cekGiroFailStatus.findMany({
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

    return PaginationUtils.createPaginatedResult(statuses, page, limit, total);
  }

  /**
   * Get cek giro fail status statistics
   */
  static async getCekGiroFailStatusStats() {
    const totalStatuses = await prisma.cekGiroFailStatus.count();

    return {
      totalStatuses,
    };
  }
}
