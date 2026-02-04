/**
 * ProductDetail Service
 * Handles product detail CRUD operations and business logic
 */

import { Prisma, PrismaClient, StatusEnum } from '@prisma/client';
import {
  CreateProductDetailRequest,
  ProductDetailListQuery,
  ProductDetailResponse,
  UpdateProductDetailRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class ProductDetailService {
  /**
   * Create a new product detail
   */
  static async createProductDetail(
    data: CreateProductDetailRequest
  ): Promise<ProductDetailResponse> {
    // Check if product detail code already exists
    const existingDetail = await prisma.productDetail.findUnique({
      where: { code: data.code },
    });

    if (existingDetail) {
      throw new ConflictError('Product detail with this code already exists');
    }

    // Validate code length
    if (data.code.length > 16) {
      throw new ValidationError('Code must be at most 16 characters');
    }

    // Check if referenced product exists
    const product = await prisma.product.findUnique({
      where: { code: data.productCode },
    });

    if (!product) {
      throw new NotFoundError('Referenced product not found');
    }

    // Check if referenced color exists
    const color = await prisma.color.findUnique({
      where: { code: data.colorCode },
    });

    if (!color) {
      throw new NotFoundError('Referenced color not found');
    }

    // Check if referenced supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { code: data.supplierCode },
    });

    if (!supplier) {
      throw new NotFoundError('Referenced supplier not found');
    }

    const newDetail = await prisma.productDetail.create({
      data: {
        status: data.status,
        code: data.code,
        productCode: data.productCode,
        colorCode: data.colorCode,
        supplierCode: data.supplierCode,
        article: data.article,
        size: data.size,
        purchasePrice: data.purchasePrice,
        salesPrice: data.salesPrice,
        wholesalePrice: data.wholesalePrice,
        stock: data.stock,
        purchaseDate: new Date(data.purchaseDate),
      },
      select: {
        id: true,
        status: true,
        code: true,
        productCode: true,
        colorCode: true,
        supplierCode: true,
        article: true,
        size: true,
        purchasePrice: true,
        salesPrice: true,
        wholesalePrice: true,
        stock: true,
        purchaseDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newDetail;
  }

  /**
   * Get product detail by ID
   */
  static async getProductDetailById(id: number): Promise<ProductDetailResponse | null> {
    const detail = await prisma.productDetail.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        code: true,
        productCode: true,
        colorCode: true,
        supplierCode: true,
        article: true,
        size: true,
        purchasePrice: true,
        salesPrice: true,
        wholesalePrice: true,
        stock: true,
        purchaseDate: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: { id: true, code: true, name: true },
        },
        color: {
          select: { id: true, code: true, name: true },
        },
        supplier: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    return detail;
  }

  /**
   * Get product detail by code
   */
  static async getProductDetailByCode(code: string): Promise<ProductDetailResponse | null> {
    const detail = await prisma.productDetail.findUnique({
      where: { code },
      select: {
        id: true,
        status: true,
        code: true,
        productCode: true,
        colorCode: true,
        supplierCode: true,
        article: true,
        size: true,
        purchasePrice: true,
        salesPrice: true,
        wholesalePrice: true,
        stock: true,
        purchaseDate: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: { id: true, code: true, name: true },
        },
        color: {
          select: { id: true, code: true, name: true },
        },
        supplier: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    return detail;
  }

  /**
   * Get product details by product code
   */
  static async getProductDetailsByProductCode(
    productCode: string
  ): Promise<ProductDetailResponse[]> {
    const details = await prisma.productDetail.findMany({
      where: { productCode },
      select: {
        id: true,
        status: true,
        code: true,
        productCode: true,
        colorCode: true,
        supplierCode: true,
        article: true,
        size: true,
        purchasePrice: true,
        salesPrice: true,
        wholesalePrice: true,
        stock: true,
        purchaseDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return details;
  }

  /**
   * Update product detail
   */
  static async updateProductDetail(
    id: number,
    data: UpdateProductDetailRequest
  ): Promise<ProductDetailResponse> {
    const existingDetail = await prisma.productDetail.findUnique({
      where: { id },
    });

    if (!existingDetail) {
      throw new NotFoundError('Product detail not found');
    }

    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const detailWithSameCode = await prisma.productDetail.findUnique({
        where: { code: data.code },
      });

      if (detailWithSameCode && detailWithSameCode.id !== id) {
        throw new ConflictError('Product detail with this code already exists');
      }
    }

    if (data.productCode) {
      const product = await prisma.product.findUnique({
        where: { code: data.productCode },
      });
      if (!product) throw new NotFoundError('Referenced product not found');
    }

    if (data.colorCode) {
      const color = await prisma.color.findUnique({
        where: { code: data.colorCode },
      });
      if (!color) throw new NotFoundError('Referenced color not found');
    }

    if (data.supplierCode) {
      const supplier = await prisma.supplier.findUnique({
        where: { code: data.supplierCode },
      });
      if (!supplier) throw new NotFoundError('Referenced supplier not found');
    }

    const updatedDetail = await prisma.productDetail.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.code && { code: data.code }),
        ...(data.productCode && { productCode: data.productCode }),
        ...(data.colorCode && { colorCode: data.colorCode }),
        ...(data.supplierCode && { supplierCode: data.supplierCode }),
        ...(data.article !== undefined && { article: data.article }),
        ...(data.size && { size: data.size }),
        ...(data.purchasePrice !== undefined && { purchasePrice: data.purchasePrice }),
        ...(data.salesPrice !== undefined && { salesPrice: data.salesPrice }),
        ...(data.wholesalePrice !== undefined && { wholesalePrice: data.wholesalePrice }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.purchaseDate && { purchaseDate: new Date(data.purchaseDate) }),
      },
      select: {
        id: true,
        status: true,
        code: true,
        productCode: true,
        colorCode: true,
        supplierCode: true,
        article: true,
        size: true,
        purchasePrice: true,
        salesPrice: true,
        wholesalePrice: true,
        stock: true,
        purchaseDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedDetail;
  }

  /**
   * Delete product detail
   */
  static async deleteProductDetail(id: number): Promise<void> {
    const existingDetail = await prisma.productDetail.findUnique({
      where: { id },
    });

    if (!existingDetail) {
      throw new NotFoundError('Product detail not found');
    }

    // Check for related records
    const relatedStockOpnames = await prisma.stockOpnameDetail.count({
      where: { productDetailCode: existingDetail.code },
    });

    if (relatedStockOpnames > 0) {
      throw new ConflictError('Cannot delete product detail with existing stock opname details');
    }

    const relatedOrderDetails = await prisma.orderDetail.count({
      where: { productDetailCode: existingDetail.code },
    });

    if (relatedOrderDetails > 0) {
      throw new ConflictError('Cannot delete product detail with existing order details');
    }

    await prisma.productDetail.delete({ where: { id } });
  }

  /**
   * Get paginated product details list with filters
   */
  static async getProductDetails(query: ProductDetailListQuery) {
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, productCode, colorCode, supplierCode, status } = query;

    const where: Prisma.ProductDetailWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'code',
        'article',
        'size',
      ]);
      Object.assign(where, searchFilter);
    }

    if (productCode) where.productCode = productCode;
    if (colorCode) where.colorCode = colorCode;
    if (supplierCode) where.supplierCode = supplierCode;
    if (status) where.status = status as StatusEnum;

    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.ProductDetailOrderByWithRelationInput;

    const total = await prisma.productDetail.count({ where });

    const details = await prisma.productDetail.findMany({
      where,
      select: {
        id: true,
        status: true,
        code: true,
        productCode: true,
        colorCode: true,
        supplierCode: true,
        article: true,
        size: true,
        purchasePrice: true,
        salesPrice: true,
        wholesalePrice: true,
        stock: true,
        purchaseDate: true,
        createdAt: true,
        updatedAt: true,
        product: { select: { id: true, code: true, name: true } },
        color: { select: { id: true, code: true, name: true } },
        supplier: { select: { id: true, code: true, name: true } },
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(details, page, limit, total);
  }

  /**
   * Get product detail statistics
   */
  static async getProductDetailStats() {
    const totalDetails = await prisma.productDetail.count();

    const totalStock = await prisma.productDetail.aggregate({
      _sum: { stock: true },
    });

    const detailsByStatus = await prisma.productDetail.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      totalDetails,
      totalStock: totalStock._sum.stock || 0,
      detailsByStatus: detailsByStatus.map(item => ({
        status: item.status,
        count: item._count.status,
      })),
    };
  }
}
