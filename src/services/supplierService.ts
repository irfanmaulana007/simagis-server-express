/**
 * Supplier Service
 * Handles supplier CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  SupplierListQuery,
  SupplierResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class SupplierService {
  /**
   * Create a new supplier
   */
  static async createSupplier(data: CreateSupplierRequest): Promise<SupplierResponse> {
    // Check if supplier code already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { code: data.code },
    });

    if (existingSupplier) {
      throw new ConflictError('Supplier with this code already exists');
    }

    // Validate branch exists
    const branch = await prisma.branch.findUnique({
      where: { code: data.branchCode },
    });

    if (!branch) {
      throw new ValidationError('Branch not found');
    }

    // Validate field lengths
    if (data.code.length > 16) {
      throw new ValidationError('Code must be at most 16 characters');
    }

    if (data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    if (data.address.length > 255) {
      throw new ValidationError('Address must be at most 255 characters');
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        name: data.name,
        address: data.address,
      },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return newSupplier;
  }

  /**
   * Get supplier by ID
   */
  static async getSupplierById(id: number): Promise<SupplierResponse | null> {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return supplier;
  }

  /**
   * Get supplier by code
   */
  static async getSupplierByCode(code: string): Promise<SupplierResponse | null> {
    const supplier = await prisma.supplier.findUnique({
      where: { code },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return supplier;
  }

  /**
   * Get suppliers by branch code
   */
  static async getSuppliersByBranchCode(branchCode: string): Promise<SupplierResponse[]> {
    const suppliers = await prisma.supplier.findMany({
      where: { branchCode },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return suppliers;
  }

  /**
   * Update supplier
   */
  static async updateSupplier(id: number, data: UpdateSupplierRequest): Promise<SupplierResponse> {
    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      throw new NotFoundError('Supplier not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const supplierWithSameCode = await prisma.supplier.findUnique({
        where: { code: data.code },
      });

      if (supplierWithSameCode && supplierWithSameCode.id !== id) {
        throw new ConflictError('Supplier with this code already exists');
      }
    }

    // Validate branch if updating
    if (data.branchCode) {
      const branch = await prisma.branch.findUnique({
        where: { code: data.branchCode },
      });

      if (!branch) {
        throw new ValidationError('Branch not found');
      }
    }

    if (data.name && data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    if (data.address && data.address.length > 255) {
      throw new ValidationError('Address must be at most 255 characters');
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
      },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return updatedSupplier;
  }

  /**
   * Delete supplier
   */
  static async deleteSupplier(id: number): Promise<void> {
    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      throw new NotFoundError('Supplier not found');
    }

    // Check if there are related product details
    const relatedProductDetails = await prisma.productDetail.count({
      where: { supplierCode: existingSupplier.code },
    });

    if (relatedProductDetails > 0) {
      throw new ConflictError('Cannot delete supplier with existing product details');
    }

    // Check if there are related supplier discounts
    const relatedSupplierDiscounts = await prisma.supplierDiscount.count({
      where: { supplierCode: existingSupplier.code },
    });

    if (relatedSupplierDiscounts > 0) {
      throw new ConflictError('Cannot delete supplier with existing supplier discounts');
    }

    // Check if there are related restocks
    const relatedRestocks = await prisma.restock.count({
      where: { supplierCode: existingSupplier.code },
    });

    if (relatedRestocks > 0) {
      throw new ConflictError('Cannot delete supplier with existing restocks');
    }

    await prisma.supplier.delete({ where: { id } });
  }

  /**
   * Get paginated suppliers list with filters
   */
  static async getSuppliers(query: SupplierListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode } = query;

    // Build where clause
    const where: Prisma.SupplierWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'code',
        'name',
        'address',
      ]);
      Object.assign(where, searchFilter);
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.SupplierOrderByWithRelationInput;

    // Get total count
    const total = await prisma.supplier.count({ where });

    // Get suppliers
    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        branch: {
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

    return PaginationUtils.createPaginatedResult(suppliers, page, limit, total);
  }

  /**
   * Get supplier statistics
   */
  static async getSupplierStats() {
    const totalSuppliers = await prisma.supplier.count();

    // Get count by branch
    const suppliersByBranch = await prisma.supplier.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
    });

    const branchStats = suppliersByBranch.reduce(
      (acc, item) => {
        acc[item.branchCode] = item._count.branchCode;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalSuppliers,
      suppliersByBranch: branchStats,
    };
  }
}
