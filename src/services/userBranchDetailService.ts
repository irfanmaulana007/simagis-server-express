/**
 * UserBranchDetail Service
 * Handles user branch detail CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  UserBranchDetailListQuery,
  UserBranchDetailResponse,
  CreateUserBranchDetailRequest,
  UpdateUserBranchDetailRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class UserBranchDetailService {
  /**
   * Create a new user branch detail
   */
  static async createUserBranchDetail(
    data: CreateUserBranchDetailRequest
  ): Promise<UserBranchDetailResponse> {
    // Validate branch exists
    const branch = await prisma.branch.findUnique({
      where: { code: data.branchCode },
    });

    if (!branch) {
      throw new ValidationError('Branch not found');
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { code: data.userCode },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Check if relationship already exists
    const existingDetail = await prisma.userBranchDetail.findFirst({
      where: {
        branchCode: data.branchCode,
        userCode: data.userCode,
      },
    });

    if (existingDetail) {
      throw new ConflictError('This user is already assigned to this branch');
    }

    const newUserBranchDetail = await prisma.userBranchDetail.create({
      data: {
        branchCode: data.branchCode,
        userCode: data.userCode,
      },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return newUserBranchDetail;
  }

  /**
   * Get user branch detail by ID
   */
  static async getUserBranchDetailById(id: number): Promise<UserBranchDetailResponse | null> {
    const userBranchDetail = await prisma.userBranchDetail.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return userBranchDetail;
  }

  /**
   * Get user branch details by branch code
   */
  static async getUserBranchDetailsByBranchCode(
    branchCode: string
  ): Promise<UserBranchDetailResponse[]> {
    const userBranchDetails = await prisma.userBranchDetail.findMany({
      where: { branchCode },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return userBranchDetails;
  }

  /**
   * Get user branch details by user code
   */
  static async getUserBranchDetailsByUserCode(
    userCode: string
  ): Promise<UserBranchDetailResponse[]> {
    const userBranchDetails = await prisma.userBranchDetail.findMany({
      where: { userCode },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return userBranchDetails;
  }

  /**
   * Update user branch detail
   */
  static async updateUserBranchDetail(
    id: number,
    data: UpdateUserBranchDetailRequest
  ): Promise<UserBranchDetailResponse> {
    // Check if user branch detail exists
    const existingUserBranchDetail = await prisma.userBranchDetail.findUnique({
      where: { id },
    });

    if (!existingUserBranchDetail) {
      throw new NotFoundError('User branch detail not found');
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

    // Validate user if updating
    if (data.userCode) {
      const user = await prisma.user.findUnique({
        where: { code: data.userCode },
      });

      if (!user) {
        throw new ValidationError('User not found');
      }
    }

    // Check if relationship already exists (if updating both)
    const newBranchCode = data.branchCode || existingUserBranchDetail.branchCode;
    const newUserCode = data.userCode || existingUserBranchDetail.userCode;

    const duplicateDetail = await prisma.userBranchDetail.findFirst({
      where: {
        branchCode: newBranchCode,
        userCode: newUserCode,
        id: { not: id },
      },
    });

    if (duplicateDetail) {
      throw new ConflictError('This user is already assigned to this branch');
    }

    const updatedUserBranchDetail = await prisma.userBranchDetail.update({
      where: { id },
      data: {
        ...(data.branchCode && { branchCode: data.branchCode }),
        ...(data.userCode && { userCode: data.userCode }),
      },
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return updatedUserBranchDetail;
  }

  /**
   * Delete user branch detail
   */
  static async deleteUserBranchDetail(id: number): Promise<void> {
    // Check if user branch detail exists
    const existingUserBranchDetail = await prisma.userBranchDetail.findUnique({
      where: { id },
    });

    if (!existingUserBranchDetail) {
      throw new NotFoundError('User branch detail not found');
    }

    await prisma.userBranchDetail.delete({ where: { id } });
  }

  /**
   * Get paginated user branch details list with filters
   */
  static async getUserBranchDetails(query: UserBranchDetailListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, branchCode, userCode } = query;

    // Build where clause
    const where: Prisma.UserBranchDetailWhereInput = {};

    if (search) {
      where.OR = [
        { branchCode: { contains: search, mode: 'insensitive' } },
        { userCode: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { branch: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (branchCode) {
      where.branchCode = branchCode;
    }

    if (userCode) {
      where.userCode = userCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.UserBranchDetailOrderByWithRelationInput;

    // Get total count
    const total = await prisma.userBranchDetail.count({ where });

    // Get user branch details
    const userBranchDetails = await prisma.userBranchDetail.findMany({
      where,
      include: {
        branch: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        user: {
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

    return PaginationUtils.createPaginatedResult(userBranchDetails, page, limit, total);
  }

  /**
   * Get user branch detail statistics
   */
  static async getUserBranchDetailStats() {
    const totalUserBranchDetails = await prisma.userBranchDetail.count();

    // Get count by branch
    const detailsByBranch = await prisma.userBranchDetail.groupBy({
      by: ['branchCode'],
      _count: {
        branchCode: true,
      },
    });

    const branchStats = detailsByBranch.reduce(
      (acc, item) => {
        acc[item.branchCode] = item._count.branchCode;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalUserBranchDetails,
      detailsByBranch: branchStats,
    };
  }
}
