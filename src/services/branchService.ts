/**
 * Branch Service
 * Handles branch CRUD operations and business logic
 */

import { PriceTypeEnum, Prisma, PrismaClient } from '@prisma/client';
import { BranchListQuery, BranchResponse, CreateBranchRequest, UpdateBranchRequest } from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class BranchService {
  /**
   * Create a new branch
   */
  static async createBranch(branchData: CreateBranchRequest): Promise<BranchResponse> {
    // Check if branch with same code already exists
    const existingBranchByCode = await prisma.branch.findUnique({
      where: { code: branchData.code },
    });

    if (existingBranchByCode) {
      throw new ConflictError('Branch with this code already exists');
    }

    // Check if branch with same name already exists
    const existingBranchByName = await prisma.branch.findUnique({
      where: { name: branchData.name },
    });

    if (existingBranchByName) {
      throw new ConflictError('Branch with this name already exists');
    }

    // Check if branch with same address already exists
    const existingBranchByAddress = await prisma.branch.findUnique({
      where: { address: branchData.address },
    });

    if (existingBranchByAddress) {
      throw new ConflictError('Branch with this address already exists');
    }

    // Validate code length (should be 3 characters)
    if (branchData.code.length !== 3) {
      throw new ValidationError('Branch code must be exactly 3 characters');
    }

    const newBranch = await prisma.branch.create({
      data: {
        priceType: branchData.priceType,
        code: branchData.code.toUpperCase(),
        name: branchData.name,
        phone: branchData.phone || null,
        address: branchData.address,
        img: branchData.img || null,
        depreciationYear1: branchData.depreciationYear1 || 0,
        depreciationYear2: branchData.depreciationYear2 || 0,
        depreciationYear3: branchData.depreciationYear3 || 0,
        depreciationYear4: branchData.depreciationYear4 || 0,
      },
      select: {
        id: true,
        priceType: true,
        code: true,
        name: true,
        phone: true,
        address: true,
        img: true,
        depreciationYear1: true,
        depreciationYear2: true,
        depreciationYear3: true,
        depreciationYear4: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newBranch;
  }

  /**
   * Get branch by ID
   */
  static async getBranchById(id: number): Promise<BranchResponse | null> {
    const branch = await prisma.branch.findUnique({
      where: { id },
      select: {
        id: true,
        priceType: true,
        code: true,
        name: true,
        phone: true,
        address: true,
        img: true,
        depreciationYear1: true,
        depreciationYear2: true,
        depreciationYear3: true,
        depreciationYear4: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return branch;
  }

  /**
   * Get branch by code
   */
  static async getBranchByCode(code: string): Promise<BranchResponse | null> {
    const branch = await prisma.branch.findUnique({
      where: { code },
      select: {
        id: true,
        priceType: true,
        code: true,
        name: true,
        phone: true,
        address: true,
        img: true,
        depreciationYear1: true,
        depreciationYear2: true,
        depreciationYear3: true,
        depreciationYear4: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return branch;
  }

  /**
   * Update branch
   */
  static async updateBranch(id: number, branchData: UpdateBranchRequest): Promise<BranchResponse> {
    // Check if branch exists
    const existingBranch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!existingBranch) {
      throw new NotFoundError('Branch not found');
    }

    // If updating code, check uniqueness and length
    if (branchData.code) {
      if (branchData.code.length !== 3) {
        throw new ValidationError('Branch code must be exactly 3 characters');
      }

      const branchWithSameCode = await prisma.branch.findUnique({
        where: { code: branchData.code },
      });

      if (branchWithSameCode && branchWithSameCode.id !== id) {
        throw new ConflictError('Branch with this code already exists');
      }
    }

    // If updating name, check uniqueness
    if (branchData.name) {
      const branchWithSameName = await prisma.branch.findUnique({
        where: { name: branchData.name },
      });

      if (branchWithSameName && branchWithSameName.id !== id) {
        throw new ConflictError('Branch with this name already exists');
      }
    }

    // If updating address, check uniqueness
    if (branchData.address) {
      const branchWithSameAddress = await prisma.branch.findUnique({
        where: { address: branchData.address },
      });

      if (branchWithSameAddress && branchWithSameAddress.id !== id) {
        throw new ConflictError('Branch with this address already exists');
      }
    }

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        ...(branchData.priceType && { priceType: branchData.priceType }),
        ...(branchData.code && { code: branchData.code.toUpperCase() }),
        ...(branchData.name && { name: branchData.name }),
        ...(branchData.phone !== undefined && { phone: branchData.phone }),
        ...(branchData.address && { address: branchData.address }),
        ...(branchData.img !== undefined && { img: branchData.img }),
        ...(branchData.depreciationYear1 !== undefined && {
          depreciationYear1: branchData.depreciationYear1,
        }),
        ...(branchData.depreciationYear2 !== undefined && {
          depreciationYear2: branchData.depreciationYear2,
        }),
        ...(branchData.depreciationYear3 !== undefined && {
          depreciationYear3: branchData.depreciationYear3,
        }),
        ...(branchData.depreciationYear4 !== undefined && {
          depreciationYear4: branchData.depreciationYear4,
        }),
      },
      select: {
        id: true,
        priceType: true,
        code: true,
        name: true,
        phone: true,
        address: true,
        img: true,
        depreciationYear1: true,
        depreciationYear2: true,
        depreciationYear3: true,
        depreciationYear4: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedBranch;
  }

  /**
   * Delete branch
   */
  static async deleteBranch(id: number): Promise<void> {
    // Check if branch exists
    const existingBranch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!existingBranch) {
      throw new NotFoundError('Branch not found');
    }

    // Check if branch is used in relations
    const expenseCategoryCount = await prisma.expenseCategory.count({
      where: { branchCode: existingBranch.code },
    });

    const memberCount = await prisma.member.count({
      where: { branchCode: existingBranch.code },
    });

    if (expenseCategoryCount > 0 || memberCount > 0) {
      throw new ConflictError('Cannot delete branch. It is referenced by other records.');
    }

    await prisma.branch.delete({ where: { id } });
  }

  /**
   * Get paginated branches list with filters
   */
  static async getBranches(query: BranchListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, priceType } = query;

    // Build where clause
    const where: Prisma.BranchWhereInput = {};

    if (priceType) {
      where.priceType = priceType;
    }

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'name',
        'code',
        'address',
      ]);
      Object.assign(where, searchFilter);
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.BranchOrderByWithRelationInput;

    // Get total count
    const total = await prisma.branch.count({ where });

    // Get branches
    const branches = await prisma.branch.findMany({
      where,
      select: {
        id: true,
        priceType: true,
        code: true,
        name: true,
        phone: true,
        address: true,
        img: true,
        depreciationYear1: true,
        depreciationYear2: true,
        depreciationYear3: true,
        depreciationYear4: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(branches, page, limit, total);
  }

  /**
   * Get branches by price type with pagination
   */
  static async getBranchesByPriceType(priceType: PriceTypeEnum, query: BranchListQuery = {}) {
    const fullQuery = { ...query, priceType };
    return this.getBranches(fullQuery);
  }

  /**
   * Get branch statistics
   */
  static async getBranchStats() {
    const totalBranches = await prisma.branch.count();
    const branchesWithMembers = await prisma.branch.count({
      where: {
        Member: {
          some: {},
        },
      },
    });

    const branchesByPriceType = await prisma.branch.groupBy({
      by: ['priceType'],
      _count: {
        id: true,
      },
    });

    return {
      totalBranches,
      branchesWithMembers,
      branchesWithoutMembers: totalBranches - branchesWithMembers,
      byPriceType: branchesByPriceType.reduce(
        (acc, item) => {
          acc[item.priceType] = item._count.id;
          return acc;
        },
        {} as Record<PriceTypeEnum, number>
      ),
    };
  }
}
