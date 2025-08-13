/**
 * Phone Service
 * Handles phone CRUD operations and business logic
 */

import { ModuleEnum, Prisma, PrismaClient } from '@prisma/client';
import { PhoneListQuery, PhoneResponse, CreatePhoneRequest, UpdatePhoneRequest } from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class PhoneService {
  /**
   * Create a new phone
   */
  static async createPhone(data: CreatePhoneRequest): Promise<PhoneResponse> {
    // Check if phone with same number already exists
    const existingPhone = await prisma.phone.findUnique({
      where: { phone: data.phone },
    });

    if (existingPhone) {
      throw new ConflictError('Phone with this number already exists');
    }

    // Validate phone number format (basic validation)
    if (data.phone.length > 50) {
      throw new ValidationError('Phone number must be at most 50 characters');
    }

    const newPhone = await prisma.phone.create({
      data: {
        module: data.module,
        ownerCode: data.ownerCode,
        phone: data.phone,
      },
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newPhone;
  }

  /**
   * Get phone by ID
   */
  static async getPhoneById(id: number): Promise<PhoneResponse | null> {
    const phone = await prisma.phone.findUnique({
      where: { id },
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return phone;
  }

  /**
   * Get phone by phone number
   */
  static async getPhoneByNumber(phone: string): Promise<PhoneResponse | null> {
    const phoneRecord = await prisma.phone.findUnique({
      where: { phone },
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return phoneRecord;
  }

  /**
   * Get phones by owner code
   */
  static async getPhonesByOwnerCode(ownerCode: string): Promise<PhoneResponse[]> {
    const phones = await prisma.phone.findMany({
      where: { ownerCode },
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return phones;
  }

  /**
   * Get phones by module
   */
  static async getPhonesByModule(module: string): Promise<PhoneResponse[]> {
    const phones = await prisma.phone.findMany({
      where: { module: module as ModuleEnum },
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return phones;
  }

  /**
   * Update phone
   */
  static async updatePhone(id: number, data: UpdatePhoneRequest): Promise<PhoneResponse> {
    // Check if phone exists
    const existingPhone = await prisma.phone.findUnique({
      where: { id },
    });

    if (!existingPhone) {
      throw new NotFoundError('Phone not found');
    }

    // If updating phone number, check uniqueness
    if (data.phone) {
      if (data.phone.length > 50) {
        throw new ValidationError('Phone number must be at most 50 characters');
      }

      const phoneWithSameNumber = await prisma.phone.findUnique({
        where: { phone: data.phone },
      });

      if (phoneWithSameNumber && phoneWithSameNumber.id !== id) {
        throw new ConflictError('Phone with this number already exists');
      }
    }

    const updatedPhone = await prisma.phone.update({
      where: { id },
      data: {
        ...(data.module && { module: data.module }),
        ...(data.ownerCode && { ownerCode: data.ownerCode }),
        ...(data.phone && { phone: data.phone }),
      },
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedPhone;
  }

  /**
   * Delete phone
   */
  static async deletePhone(id: number): Promise<void> {
    // Check if phone exists
    const existingPhone = await prisma.phone.findUnique({
      where: { id },
    });

    if (!existingPhone) {
      throw new NotFoundError('Phone not found');
    }

    await prisma.phone.delete({ where: { id } });
  }

  /**
   * Get paginated phones list with filters
   */
  static async getPhones(query: PhoneListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, module, ownerCode } = query;

    // Build where clause
    const where: Prisma.PhoneWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['phone', 'ownerCode']);
      Object.assign(where, searchFilter);
    }

    if (module) {
      where.module = module;
    }

    if (ownerCode) {
      where.ownerCode = ownerCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.PhoneOrderByWithRelationInput;

    // Get total count
    const total = await prisma.phone.count({ where });

    // Get phones
    const phones = await prisma.phone.findMany({
      where,
      select: {
        id: true,
        module: true,
        ownerCode: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(phones, page, limit, total);
  }

  /**
   * Get phone statistics
   */
  static async getPhoneStats() {
    const totalPhones = await prisma.phone.count();

    // Get count by module
    const phonesByModule = await prisma.phone.groupBy({
      by: ['module'],
      _count: {
        module: true,
      },
    });

    const moduleStats = phonesByModule.reduce(
      (acc, item) => {
        acc[item.module] = item._count.module;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalPhones,
      phonesByModule: moduleStats,
    };
  }
}
