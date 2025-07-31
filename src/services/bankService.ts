/**
 * Bank Service
 * Handles bank CRUD operations and business logic
 */

import { Prisma, PrismaClient } from '@prisma/client';
import { BankListQuery, BankResponse, CreateBankRequest, UpdateBankRequest } from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class BankService {
  /**
   * Create a new bank
   */
  static async createBank(bankData: CreateBankRequest): Promise<BankResponse> {
    // Check if bank with same code already exists
    const existingBank = await prisma.bank.findUnique({
      where: { code: bankData.code },
    });

    if (existingBank) {
      throw new ConflictError('Bank with this code already exists');
    }

    // Validate code length (should be 3 characters)
    if (bankData.code.length !== 3) {
      throw new ValidationError('Bank code must be exactly 3 characters');
    }

    const newBank = await prisma.bank.create({
      data: {
        code: bankData.code.toUpperCase(),
        name: bankData.name,
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newBank;
  }

  /**
   * Get bank by ID
   */
  static async getBankById(id: number): Promise<BankResponse | null> {
    const bank = await prisma.bank.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return bank;
  }

  /**
   * Get bank by code
   */
  static async getBankByCode(code: string): Promise<BankResponse | null> {
    const bank = await prisma.bank.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return bank;
  }

  /**
   * Update bank
   */
  static async updateBank(id: number, bankData: UpdateBankRequest): Promise<BankResponse> {
    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id },
    });

    if (!existingBank) {
      throw new NotFoundError('Bank not found');
    }

    // If updating code, check uniqueness
    if (bankData.code) {
      if (bankData.code.length !== 3) {
        throw new ValidationError('Bank code must be exactly 3 characters');
      }

      const bankWithSameCode = await prisma.bank.findUnique({
        where: { code: bankData.code },
      });

      if (bankWithSameCode && bankWithSameCode.id !== id) {
        throw new ConflictError('Bank with this code already exists');
      }
    }

    const updatedBank = await prisma.bank.update({
      where: { id },
      data: {
        ...(bankData.code && { code: bankData.code.toUpperCase() }),
        ...(bankData.name && { name: bankData.name }),
      },
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedBank;
  }

  /**
   * Delete bank
   */
  static async deleteBank(id: number): Promise<void> {
    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id },
    });

    if (!existingBank) {
      throw new NotFoundError('Bank not found');
    }

    // Check if bank is used in AccountNumber (foreign key constraint)
    const accountNumberCount = await prisma.accountNumber.count({
      where: { bankCode: existingBank.code },
    });

    if (accountNumberCount > 0) {
      throw new ConflictError('Cannot delete bank. It is referenced by account numbers.');
    }

    await prisma.bank.delete({ where: { id } });
  }

  /**
   * Get paginated banks list with filters
   */
  static async getBanks(query: BankListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search } = query;

    // Build where clause
    const where: Prisma.BankWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, ['name', 'code']);
      Object.assign(where, searchFilter);
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.BankOrderByWithRelationInput;

    // Get total count
    const total = await prisma.bank.count({ where });

    // Get banks
    const banks = await prisma.bank.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return PaginationUtils.createPaginatedResult(banks, page, limit, total);
  }

  /**
   * Get bank statistics
   */
  static async getBankStats() {
    const totalBanks = await prisma.bank.count();
    const banksWithAccounts = await prisma.bank.count({
      where: {
        AccountNumber: {
          some: {},
        },
      },
    });

    return {
      totalBanks,
      banksWithAccounts,
      banksWithoutAccounts: totalBanks - banksWithAccounts,
    };
  }
}
