/**
 * Promo Service
 * Handles promo CRUD operations and business logic
 */

import { Prisma, PrismaClient, StatusEnum } from '@prisma/client';
import { CreatePromoRequest, PromoListQuery, PromoResponse, UpdatePromoRequest } from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class PromoService {
  static async createPromo(data: CreatePromoRequest): Promise<PromoResponse> {
    const existingPromo = await prisma.promo.findUnique({
      where: { code: data.code },
    });

    if (existingPromo) {
      throw new ConflictError('Promo with this code already exists');
    }

    if (data.code.length > 16) {
      throw new ValidationError('Code must be at most 16 characters');
    }

    const branch = await prisma.branch.findUnique({
      where: { code: data.branchCode },
    });

    if (!branch) {
      throw new NotFoundError('Referenced branch not found');
    }

    const newPromo = await prisma.promo.create({
      data: {
        status: data.status,
        code: data.code,
        branchCode: data.branchCode,
        name: data.name,
        termsAndCondition: data.termsAndCondition,
        amount: data.amount,
        percentage: data.percentage,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      select: {
        id: true,
        status: true,
        code: true,
        branchCode: true,
        name: true,
        termsAndCondition: true,
        amount: true,
        percentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newPromo;
  }

  static async getPromoById(id: number): Promise<PromoResponse | null> {
    return prisma.promo.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        code: true,
        branchCode: true,
        name: true,
        termsAndCondition: true,
        amount: true,
        percentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        branch: { select: { id: true, code: true, name: true } },
      },
    });
  }

  static async getPromoByCode(code: string): Promise<PromoResponse | null> {
    return prisma.promo.findUnique({
      where: { code },
      select: {
        id: true,
        status: true,
        code: true,
        branchCode: true,
        name: true,
        termsAndCondition: true,
        amount: true,
        percentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        branch: { select: { id: true, code: true, name: true } },
      },
    });
  }

  static async getPromosByBranchCode(branchCode: string): Promise<PromoResponse[]> {
    return prisma.promo.findMany({
      where: { branchCode },
      select: {
        id: true,
        status: true,
        code: true,
        branchCode: true,
        name: true,
        termsAndCondition: true,
        amount: true,
        percentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updatePromo(id: number, data: UpdatePromoRequest): Promise<PromoResponse> {
    const existingPromo = await prisma.promo.findUnique({ where: { id } });

    if (!existingPromo) {
      throw new NotFoundError('Promo not found');
    }

    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const promoWithSameCode = await prisma.promo.findUnique({
        where: { code: data.code },
      });

      if (promoWithSameCode && promoWithSameCode.id !== id) {
        throw new ConflictError('Promo with this code already exists');
      }
    }

    if (data.branchCode) {
      const branch = await prisma.branch.findUnique({ where: { code: data.branchCode } });
      if (!branch) throw new NotFoundError('Referenced branch not found');
    }

    return prisma.promo.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.name && { name: data.name }),
        ...(data.termsAndCondition !== undefined && { termsAndCondition: data.termsAndCondition }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.percentage !== undefined && { percentage: data.percentage }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      },
      select: {
        id: true,
        status: true,
        code: true,
        branchCode: true,
        name: true,
        termsAndCondition: true,
        amount: true,
        percentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async deletePromo(id: number): Promise<void> {
    const existingPromo = await prisma.promo.findUnique({ where: { id } });

    if (!existingPromo) {
      throw new NotFoundError('Promo not found');
    }

    const relatedOrders = await prisma.order.count({
      where: { promoCode: existingPromo.code },
    });

    if (relatedOrders > 0) {
      throw new ConflictError('Cannot delete promo with existing orders');
    }

    await prisma.promo.delete({ where: { id } });
  }

  static async getPromos(query: PromoListQuery) {
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, status } = query;

    const where: Prisma.PromoWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['code', 'name']);
      Object.assign(where, searchFilter);
    }

    if (branchCode) where.branchCode = branchCode;
    if (status) where.status = status as StatusEnum;

    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.PromoOrderByWithRelationInput;

    const total = await prisma.promo.count({ where });

    const promos = await prisma.promo.findMany({
      where,
      select: {
        id: true,
        status: true,
        code: true,
        branchCode: true,
        name: true,
        termsAndCondition: true,
        amount: true,
        percentage: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        branch: { select: { id: true, code: true, name: true } },
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(promos, page, limit, total);
  }

  static async getPromoStats() {
    const totalPromos = await prisma.promo.count();

    const promosByStatus = await prisma.promo.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const promosByBranch = await prisma.promo.groupBy({
      by: ['branchCode'],
      _count: { branchCode: true },
    });

    return {
      totalPromos,
      promosByStatus: promosByStatus.map(item => ({
        status: item.status,
        count: item._count.status,
      })),
      promosByBranch: promosByBranch.map(item => ({
        branchCode: item.branchCode,
        count: item._count.branchCode,
      })),
    };
  }
}
