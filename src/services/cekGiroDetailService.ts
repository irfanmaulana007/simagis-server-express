/**
 * CekGiroDetail Service
 * Handles cek giro detail CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  CekGiroDetailListQuery,
  CekGiroDetailResponse,
  CreateCekGiroDetailRequest,
  UpdateCekGiroDetailRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class CekGiroDetailService {
  /**
   * Create a new cek giro detail
   */
  static async createCekGiroDetail(
    data: CreateCekGiroDetailRequest
  ): Promise<CekGiroDetailResponse> {
    // Check if cek giro detail code already exists
    const existingDetail = await prisma.cekGiroDetail.findUnique({
      where: { code: data.code },
    });

    if (existingDetail) {
      throw new ConflictError('Cek giro detail with this code already exists');
    }

    // Validate code length
    if (data.code.length > 20) {
      throw new ValidationError('Code must be at most 20 characters');
    }

    // Check if referenced cek giro exists
    const cekGiro = await prisma.cekGiro.findUnique({
      where: { code: data.cekGiroCode },
    });

    if (!cekGiro) {
      throw new NotFoundError('Referenced cek giro not found');
    }

    if (data.accountNumber.length > 50) {
      throw new ValidationError('Account number must be at most 50 characters');
    }

    if (data.accountName.length > 50) {
      throw new ValidationError('Account name must be at most 50 characters');
    }

    if (data.receiverName.length > 50) {
      throw new ValidationError('Receiver name must be at most 50 characters');
    }

    if (data.receiverPhone && data.receiverPhone.length > 50) {
      throw new ValidationError('Receiver phone must be at most 50 characters');
    }

    if (data.note && data.note.length > 255) {
      throw new ValidationError('Note must be at most 255 characters');
    }

    const newDetail = await prisma.cekGiroDetail.create({
      data: {
        code: data.code,
        cekGiroCode: data.cekGiroCode,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        amount: data.amount,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        disbursementDate: new Date(data.disbursementDate),
        handoverDate: new Date(data.handoverDate),
        note: data.note,
      },
      select: {
        id: true,
        code: true,
        cekGiroCode: true,
        accountNumber: true,
        accountName: true,
        amount: true,
        receiverName: true,
        receiverPhone: true,
        disbursementDate: true,
        handoverDate: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newDetail;
  }

  /**
   * Get cek giro detail by ID
   */
  static async getCekGiroDetailById(id: number): Promise<CekGiroDetailResponse | null> {
    const detail = await prisma.cekGiroDetail.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        cekGiroCode: true,
        accountNumber: true,
        accountName: true,
        amount: true,
        receiverName: true,
        receiverPhone: true,
        disbursementDate: true,
        handoverDate: true,
        note: true,
        createdAt: true,
        updatedAt: true,
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
          },
        },
      },
    });

    return detail;
  }

  /**
   * Get cek giro detail by code
   */
  static async getCekGiroDetailByCode(code: string): Promise<CekGiroDetailResponse | null> {
    const detail = await prisma.cekGiroDetail.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        cekGiroCode: true,
        accountNumber: true,
        accountName: true,
        amount: true,
        receiverName: true,
        receiverPhone: true,
        disbursementDate: true,
        handoverDate: true,
        note: true,
        createdAt: true,
        updatedAt: true,
        cekGiro: {
          select: {
            id: true,
            code: true,
            type: true,
          },
        },
      },
    });

    return detail;
  }

  /**
   * Get cek giro details by cek giro code
   */
  static async getCekGiroDetailsByCekGiroCode(
    cekGiroCode: string
  ): Promise<CekGiroDetailResponse[]> {
    const details = await prisma.cekGiroDetail.findMany({
      where: { cekGiroCode },
      select: {
        id: true,
        code: true,
        cekGiroCode: true,
        accountNumber: true,
        accountName: true,
        amount: true,
        receiverName: true,
        receiverPhone: true,
        disbursementDate: true,
        handoverDate: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return details;
  }

  /**
   * Update cek giro detail
   */
  static async updateCekGiroDetail(
    id: number,
    data: UpdateCekGiroDetailRequest
  ): Promise<CekGiroDetailResponse> {
    // Check if cek giro detail exists
    const existingDetail = await prisma.cekGiroDetail.findUnique({
      where: { id },
    });

    if (!existingDetail) {
      throw new NotFoundError('Cek giro detail not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 20) {
        throw new ValidationError('Code must be at most 20 characters');
      }

      const detailWithSameCode = await prisma.cekGiroDetail.findUnique({
        where: { code: data.code },
      });

      if (detailWithSameCode && detailWithSameCode.id !== id) {
        throw new ConflictError('Cek giro detail with this code already exists');
      }
    }

    // If updating cekGiroCode, verify it exists
    if (data.cekGiroCode) {
      const cekGiro = await prisma.cekGiro.findUnique({
        where: { code: data.cekGiroCode },
      });

      if (!cekGiro) {
        throw new NotFoundError('Referenced cek giro not found');
      }
    }

    if (data.accountNumber && data.accountNumber.length > 50) {
      throw new ValidationError('Account number must be at most 50 characters');
    }

    if (data.accountName && data.accountName.length > 50) {
      throw new ValidationError('Account name must be at most 50 characters');
    }

    if (data.receiverName && data.receiverName.length > 50) {
      throw new ValidationError('Receiver name must be at most 50 characters');
    }

    if (data.receiverPhone && data.receiverPhone.length > 50) {
      throw new ValidationError('Receiver phone must be at most 50 characters');
    }

    if (data.note && data.note.length > 255) {
      throw new ValidationError('Note must be at most 255 characters');
    }

    const updatedDetail = await prisma.cekGiroDetail.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.cekGiroCode && { cekGiroCode: data.cekGiroCode }),
        ...(data.accountNumber && { accountNumber: data.accountNumber }),
        ...(data.accountName && { accountName: data.accountName }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.receiverName && { receiverName: data.receiverName }),
        ...(data.receiverPhone !== undefined && { receiverPhone: data.receiverPhone }),
        ...(data.disbursementDate && { disbursementDate: new Date(data.disbursementDate) }),
        ...(data.handoverDate && { handoverDate: new Date(data.handoverDate) }),
        ...(data.note !== undefined && { note: data.note }),
      },
      select: {
        id: true,
        code: true,
        cekGiroCode: true,
        accountNumber: true,
        accountName: true,
        amount: true,
        receiverName: true,
        receiverPhone: true,
        disbursementDate: true,
        handoverDate: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedDetail;
  }

  /**
   * Delete cek giro detail
   */
  static async deleteCekGiroDetail(id: number): Promise<void> {
    // Check if cek giro detail exists
    const existingDetail = await prisma.cekGiroDetail.findUnique({
      where: { id },
    });

    if (!existingDetail) {
      throw new NotFoundError('Cek giro detail not found');
    }

    // Check if there are related restock payments
    const relatedRestockPayments = await prisma.restockPayment.count({
      where: { cekGiroDetailCode: existingDetail.code },
    });

    if (relatedRestockPayments > 0) {
      throw new ConflictError('Cannot delete cek giro detail with existing restock payments');
    }

    await prisma.cekGiroDetail.delete({ where: { id } });
  }

  /**
   * Get paginated cek giro details list with filters
   */
  static async getCekGiroDetails(query: CekGiroDetailListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, cekGiroCode } = query;

    // Build where clause
    const where: Prisma.CekGiroDetailWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'code',
        'accountNumber',
        'accountName',
        'receiverName',
      ]);
      Object.assign(where, searchFilter);
    }

    if (cekGiroCode) {
      where.cekGiroCode = cekGiroCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.CekGiroDetailOrderByWithRelationInput;

    // Get total count
    const total = await prisma.cekGiroDetail.count({ where });

    // Get cek giro details
    const details = await prisma.cekGiroDetail.findMany({
      where,
      select: {
        id: true,
        code: true,
        cekGiroCode: true,
        accountNumber: true,
        accountName: true,
        amount: true,
        receiverName: true,
        receiverPhone: true,
        disbursementDate: true,
        handoverDate: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(details, page, limit, total);
  }

  /**
   * Get cek giro detail statistics
   */
  static async getCekGiroDetailStats() {
    const totalDetails = await prisma.cekGiroDetail.count();

    // Get total amount
    const totalAmount = await prisma.cekGiroDetail.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get count by cek giro
    const detailsByCekGiro = await prisma.cekGiroDetail.groupBy({
      by: ['cekGiroCode'],
      _count: {
        cekGiroCode: true,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalDetails,
      totalAmount: totalAmount._sum.amount || 0,
      detailsByCekGiro: detailsByCekGiro.map((item) => ({
        cekGiroCode: item.cekGiroCode,
        count: item._count.cekGiroCode,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
