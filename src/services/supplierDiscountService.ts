/**
 * SupplierDiscount Service
 * Handles supplier discount CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateSupplierDiscountRequest,
  SupplierDiscountListQuery,
  SupplierDiscountResponse,
  UpdateSupplierDiscountRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class SupplierDiscountService {
  /**
   * Create a new supplier discount
   */
  static async createSupplierDiscount(
    data: CreateSupplierDiscountRequest
  ): Promise<SupplierDiscountResponse> {
    // Check if supplier discount code already exists
    const existingDiscount = await prisma.supplierDiscount.findUnique({
      where: { code: data.code },
    });

    if (existingDiscount) {
      throw new ConflictError('Supplier discount with this code already exists');
    }

    // Validate code length
    if (data.code.length > 16) {
      throw new ValidationError('Code must be at most 16 characters');
    }

    // Check if referenced supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { code: data.supplierCode },
    });

    if (!supplier) {
      throw new NotFoundError('Referenced supplier not found');
    }

    if (data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    const newDiscount = await prisma.supplierDiscount.create({
      data: {
        code: data.code,
        supplierCode: data.supplierCode,
        name: data.name,
        amount: data.amount,
        percentage: data.percentage,
        validDate: data.validDate ? new Date(data.validDate) : null,
      },
      select: {
        id: true,
        code: true,
        supplierCode: true,
        name: true,
        amount: true,
        percentage: true,
        validDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newDiscount;
  }

  /**
   * Get supplier discount by ID
   */
  static async getSupplierDiscountById(id: number): Promise<SupplierDiscountResponse | null> {
    const discount = await prisma.supplierDiscount.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        supplierCode: true,
        name: true,
        amount: true,
        percentage: true,
        validDate: true,
        createdAt: true,
        updatedAt: true,
        supplier: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return discount;
  }

  /**
   * Get supplier discount by code
   */
  static async getSupplierDiscountByCode(code: string): Promise<SupplierDiscountResponse | null> {
    const discount = await prisma.supplierDiscount.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        supplierCode: true,
        name: true,
        amount: true,
        percentage: true,
        validDate: true,
        createdAt: true,
        updatedAt: true,
        supplier: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return discount;
  }

  /**
   * Get supplier discounts by supplier code
   */
  static async getSupplierDiscountsBySupplierCode(
    supplierCode: string
  ): Promise<SupplierDiscountResponse[]> {
    const discounts = await prisma.supplierDiscount.findMany({
      where: { supplierCode },
      select: {
        id: true,
        code: true,
        supplierCode: true,
        name: true,
        amount: true,
        percentage: true,
        validDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return discounts;
  }

  /**
   * Update supplier discount
   */
  static async updateSupplierDiscount(
    id: number,
    data: UpdateSupplierDiscountRequest
  ): Promise<SupplierDiscountResponse> {
    // Check if supplier discount exists
    const existingDiscount = await prisma.supplierDiscount.findUnique({
      where: { id },
    });

    if (!existingDiscount) {
      throw new NotFoundError('Supplier discount not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const discountWithSameCode = await prisma.supplierDiscount.findUnique({
        where: { code: data.code },
      });

      if (discountWithSameCode && discountWithSameCode.id !== id) {
        throw new ConflictError('Supplier discount with this code already exists');
      }
    }

    // If updating supplierCode, verify it exists
    if (data.supplierCode) {
      const supplier = await prisma.supplier.findUnique({
        where: { code: data.supplierCode },
      });

      if (!supplier) {
        throw new NotFoundError('Referenced supplier not found');
      }
    }

    if (data.name && data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    const updatedDiscount = await prisma.supplierDiscount.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.supplierCode && { supplierCode: data.supplierCode }),
        ...(data.name && { name: data.name }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.percentage !== undefined && { percentage: data.percentage }),
        ...(data.validDate !== undefined && {
          validDate: data.validDate ? new Date(data.validDate) : null,
        }),
      },
      select: {
        id: true,
        code: true,
        supplierCode: true,
        name: true,
        amount: true,
        percentage: true,
        validDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedDiscount;
  }

  /**
   * Delete supplier discount
   */
  static async deleteSupplierDiscount(id: number): Promise<void> {
    // Check if supplier discount exists
    const existingDiscount = await prisma.supplierDiscount.findUnique({
      where: { id },
    });

    if (!existingDiscount) {
      throw new NotFoundError('Supplier discount not found');
    }

    // Check if there are related restocks
    const relatedRestocks = await prisma.restock.count({
      where: { supplierDiscountCode: existingDiscount.code },
    });

    if (relatedRestocks > 0) {
      throw new ConflictError('Cannot delete supplier discount with existing restocks');
    }

    await prisma.supplierDiscount.delete({ where: { id } });
  }

  /**
   * Get paginated supplier discounts list with filters
   */
  static async getSupplierDiscounts(query: SupplierDiscountListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, supplierCode } = query;

    // Build where clause
    const where: Prisma.SupplierDiscountWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'name']);
      Object.assign(where, searchFilter);
    }

    if (supplierCode) {
      where.supplierCode = supplierCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.SupplierDiscountOrderByWithRelationInput;

    // Get total count
    const total = await prisma.supplierDiscount.count({ where });

    // Get supplier discounts
    const discounts = await prisma.supplierDiscount.findMany({
      where,
      select: {
        id: true,
        code: true,
        supplierCode: true,
        name: true,
        amount: true,
        percentage: true,
        validDate: true,
        createdAt: true,
        updatedAt: true,
        supplier: {
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

    return PaginationUtils.createPaginatedResult(discounts, page, limit, total);
  }

  /**
   * Get supplier discount statistics
   */
  static async getSupplierDiscountStats() {
    const totalDiscounts = await prisma.supplierDiscount.count();

    // Get count by supplier
    const discountsBySupplier = await prisma.supplierDiscount.groupBy({
      by: ['supplierCode'],
      _count: {
        supplierCode: true,
      },
    });

    // Get average discount amounts
    const avgAmounts = await prisma.supplierDiscount.aggregate({
      _avg: {
        amount: true,
        percentage: true,
      },
    });

    return {
      totalDiscounts,
      discountsBySupplier: discountsBySupplier.map((item) => ({
        supplierCode: item.supplierCode,
        count: item._count.supplierCode,
      })),
      averageAmount: avgAmounts._avg.amount || 0,
      averagePercentage: avgAmounts._avg.percentage || 0,
    };
  }
}
