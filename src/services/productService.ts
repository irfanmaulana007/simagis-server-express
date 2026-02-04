/**
 * Product Service
 * Handles product CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateProductRequest,
  ProductListQuery,
  ProductResponse,
  UpdateProductRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ProductService {
  /**
   * Create a new product
   */
  static async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    // Check if product code already exists
    const existingProduct = await prisma.product.findUnique({
      where: { code: data.code },
    });

    if (existingProduct) {
      throw new ConflictError('Product with this code already exists');
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

    // Check if referenced product category exists
    const productCategory = await prisma.productCategory.findUnique({
      where: { code: data.productCategoryCode },
    });

    if (!productCategory) {
      throw new NotFoundError('Referenced product category not found');
    }

    if (data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    const newProduct = await prisma.product.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        productCategoryCode: data.productCategoryCode,
        name: data.name,
      },
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newProduct;
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: number): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        productCategory: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return product;
  }

  /**
   * Get product by code
   */
  static async getProductByCode(code: string): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        productCategory: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return product;
  }

  /**
   * Get products by branch code
   */
  static async getProductsByBranchCode(branchCode: string): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      where: { branchCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  /**
   * Get products by product category code
   */
  static async getProductsByProductCategoryCode(
    productCategoryCode: string
  ): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      where: { productCategoryCode },
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  /**
   * Update product
   */
  static async updateProduct(id: number, data: UpdateProductRequest): Promise<ProductResponse> {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const productWithSameCode = await prisma.product.findUnique({
        where: { code: data.code },
      });

      if (productWithSameCode && productWithSameCode.id !== id) {
        throw new ConflictError('Product with this code already exists');
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

    // If updating productCategoryCode, verify it exists
    if (data.productCategoryCode) {
      const productCategory = await prisma.productCategory.findUnique({
        where: { code: data.productCategoryCode },
      });

      if (!productCategory) {
        throw new NotFoundError('Referenced product category not found');
      }
    }

    if (data.name && data.name.length > 50) {
      throw new ValidationError('Name must be at most 50 characters');
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.productCategoryCode && { productCategoryCode: data.productCategoryCode }),
        ...(data.name && { name: data.name }),
      },
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedProduct;
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number): Promise<void> {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Check if there are related product details
    const relatedProductDetails = await prisma.productDetail.count({
      where: { productCode: existingProduct.code },
    });

    if (relatedProductDetails > 0) {
      throw new ConflictError('Cannot delete product with existing product details');
    }

    await prisma.product.delete({ where: { id } });
  }

  /**
   * Get paginated products list with filters
   */
  static async getProducts(query: ProductListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, productCategoryCode } = query;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'name']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    if (productCategoryCode) {
      where.productCategoryCode = productCategoryCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ProductOrderByWithRelationInput;

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        code: true,
        branchCode: true,
        productCategoryCode: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        productCategory: {
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

    return PaginationUtils.createPaginatedResult(products, page, limit, total);
  }

  /**
   * Get product statistics
   */
  static async getProductStats() {
    const totalProducts = await prisma.product.count();

    // Get count by branch
    const productsByBranch = await prisma.product.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
    });

    // Get count by product category
    const productsByCategory = await prisma.product.groupBy({
      by: ['productCategoryCode'],
      _count: {
        productCategoryCode: true,
      },
    });

    return {
      totalProducts,
      productsByBranch: productsByBranch.map(item => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
      })),
      productsByCategory: productsByCategory.map(item => ({
        productCategoryCode: item.productCategoryCode,
        count: item._count.productCategoryCode,
      })),
    };
  }
}
