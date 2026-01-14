/**
 * ProductCategory Service
 * Handles product category CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  ProductCategoryListQuery,
  ProductCategoryResponse,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ProductCategoryService {
  /**
   * Create a new product category
   */
  static async createProductCategory(
    data: CreateProductCategoryRequest
  ): Promise<ProductCategoryResponse> {
    // Check if product category code already exists
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { code: data.code },
    });

    if (existingProductCategory) {
      throw new ConflictError('Product category with this code already exists');
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

    const newProductCategory = await prisma.productCategory.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        name: data.name,
        depreciationYear1: data.depreciationYear1,
        depreciationYear2: data.depreciationYear2,
        depreciationYear3: data.depreciationYear3,
        depreciationYear4: data.depreciationYear4,
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

    return newProductCategory;
  }

  /**
   * Get product category by ID
   */
  static async getProductCategoryById(id: number): Promise<ProductCategoryResponse | null> {
    const productCategory = await prisma.productCategory.findUnique({
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

    return productCategory;
  }

  /**
   * Get product category by code
   */
  static async getProductCategoryByCode(code: string): Promise<ProductCategoryResponse | null> {
    const productCategory = await prisma.productCategory.findUnique({
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

    return productCategory;
  }

  /**
   * Get product categories by branch code
   */
  static async getProductCategoriesByBranchCode(
    branchCode: string
  ): Promise<ProductCategoryResponse[]> {
    const productCategories = await prisma.productCategory.findMany({
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

    return productCategories;
  }

  /**
   * Update product category
   */
  static async updateProductCategory(
    id: number,
    data: UpdateProductCategoryRequest
  ): Promise<ProductCategoryResponse> {
    // Check if product category exists
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!existingProductCategory) {
      throw new NotFoundError('Product category not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const productCategoryWithSameCode = await prisma.productCategory.findUnique({
        where: { code: data.code },
      });

      if (productCategoryWithSameCode && productCategoryWithSameCode.id !== id) {
        throw new ConflictError('Product category with this code already exists');
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

    const updatedProductCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.name && { name: data.name }),
        ...(data.depreciationYear1 !== undefined && { depreciationYear1: data.depreciationYear1 }),
        ...(data.depreciationYear2 !== undefined && { depreciationYear2: data.depreciationYear2 }),
        ...(data.depreciationYear3 !== undefined && { depreciationYear3: data.depreciationYear3 }),
        ...(data.depreciationYear4 !== undefined && { depreciationYear4: data.depreciationYear4 }),
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

    return updatedProductCategory;
  }

  /**
   * Delete product category
   */
  static async deleteProductCategory(id: number): Promise<void> {
    // Check if product category exists
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!existingProductCategory) {
      throw new NotFoundError('Product category not found');
    }

    // Check if there are related products
    const relatedProducts = await prisma.product.count({
      where: { productCategoryCode: existingProductCategory.code },
    });

    if (relatedProducts > 0) {
      throw new ConflictError('Cannot delete product category with existing products');
    }

    await prisma.productCategory.delete({ where: { id } });
  }

  /**
   * Get paginated product categories list with filters
   */
  static async getProductCategories(query: ProductCategoryListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode } = query;

    // Build where clause
    const where: Prisma.ProductCategoryWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'name']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ProductCategoryOrderByWithRelationInput;

    // Get total count
    const total = await prisma.productCategory.count({ where });

    // Get product categories
    const productCategories = await prisma.productCategory.findMany({
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

    return PaginationUtils.createPaginatedResult(productCategories, page, limit, total);
  }

  /**
   * Get product category statistics
   */
  static async getProductCategoryStats() {
    const totalProductCategories = await prisma.productCategory.count();

    // Get count by branch
    const productCategoriesByBranch = await prisma.productCategory.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
    });

    const branchStats = productCategoriesByBranch.reduce(
      (acc, item) => {
        acc[item.branchCode] = item._count.branchCode;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalProductCategories,
      productCategoriesByBranch: branchStats,
    };
  }
}
