/**
 * Member Service
 * Handles member CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import { MemberListQuery, MemberResponse, CreateMemberRequest, UpdateMemberRequest } from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class MemberService {
  /**
   * Create a new member
   */
  static async createMember(data: CreateMemberRequest): Promise<MemberResponse> {
    // Check if member code already exists
    const existingMember = await prisma.member.findUnique({
      where: { code: data.code },
    });

    if (existingMember) {
      throw new ConflictError('Member with this code already exists');
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

    if (data.location.length > 255) {
      throw new ValidationError('Location must be at most 255 characters');
    }

    if (data.email && data.email.length > 50) {
      throw new ValidationError('Email must be at most 50 characters');
    }

    const newMember = await prisma.member.create({
      data: {
        code: data.code,
        branchCode: data.branchCode,
        name: data.name,
        location: data.location,
        email: data.email,
        debt: data.debt,
        debtLimit: data.debtLimit,
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

    return newMember;
  }

  /**
   * Get member by ID
   */
  static async getMemberById(id: number): Promise<MemberResponse | null> {
    const member = await prisma.member.findUnique({
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

    return member;
  }

  /**
   * Get member by code
   */
  static async getMemberByCode(code: string): Promise<MemberResponse | null> {
    const member = await prisma.member.findUnique({
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

    return member;
  }

  /**
   * Get members by branch code
   */
  static async getMembersByBranchCode(branchCode: string): Promise<MemberResponse[]> {
    const members = await prisma.member.findMany({
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

    return members;
  }

  /**
   * Update member
   */
  static async updateMember(id: number, data: UpdateMemberRequest): Promise<MemberResponse> {
    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      throw new NotFoundError('Member not found');
    }

    // If updating code, check uniqueness
    if (data.code) {
      if (data.code.length > 16) {
        throw new ValidationError('Code must be at most 16 characters');
      }

      const memberWithSameCode = await prisma.member.findUnique({
        where: { code: data.code },
      });

      if (memberWithSameCode && memberWithSameCode.id !== id) {
        throw new ConflictError('Member with this code already exists');
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

    if (data.location && data.location.length > 255) {
      throw new ValidationError('Location must be at most 255 characters');
    }

    if (data.email && data.email.length > 50) {
      throw new ValidationError('Email must be at most 50 characters');
    }

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.debt !== undefined && { debt: data.debt }),
        ...(data.debtLimit !== undefined && { debtLimit: data.debtLimit }),
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

    return updatedMember;
  }

  /**
   * Delete member
   */
  static async deleteMember(id: number): Promise<void> {
    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      throw new NotFoundError('Member not found');
    }

    // Check if there are related orders
    const relatedOrders = await prisma.order.count({
      where: { memberCode: existingMember.code },
    });

    if (relatedOrders > 0) {
      throw new ConflictError('Cannot delete member with existing orders');
    }

    // Check if there are related payment billings
    const relatedPaymentBillings = await prisma.paymentBilling.count({
      where: { memberCode: existingMember.code },
    });

    if (relatedPaymentBillings > 0) {
      throw new ConflictError('Cannot delete member with existing payment billings');
    }

    await prisma.member.delete({ where: { id } });
  }

  /**
   * Get paginated members list with filters
   */
  static async getMembers(query: MemberListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode } = query;

    // Build where clause
    const where: Prisma.MemberWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'code',
        'name',
        'location',
        'email',
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
    ) as Prisma.MemberOrderByWithRelationInput;

    // Get total count
    const total = await prisma.member.count({ where });

    // Get members
    const members = await prisma.member.findMany({
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

    return PaginationUtils.createPaginatedResult(members, page, limit, total);
  }

  /**
   * Get member statistics
   */
  static async getMemberStats() {
    const totalMembers = await prisma.member.count();

    // Get count by branch
    const membersByBranch = await prisma.member.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
    });

    const branchStats = membersByBranch.reduce(
      (acc, item) => {
        acc[item.branchCode] = item._count.branchCode;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get total debt
    const debtStats = await prisma.member.aggregate({
      _sum: {
        debt: true,
      },
      _avg: {
        debt: true,
      },
    });

    return {
      totalMembers,
      membersByBranch: branchStats,
      totalDebt: debtStats._sum.debt || 0,
      averageDebt: debtStats._avg.debt || 0,
    };
  }
}
