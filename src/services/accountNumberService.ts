/**
 * AccountNumber Service
 * Handles account number CRUD operations and business logic
 */

import { ModuleEnum, Prisma, PrismaClient } from '@prisma/client';
import {
  AccountNumberListQuery,
  AccountNumberResponse,
  CreateAccountNumberRequest,
  UpdateAccountNumberRequest,
} from '~/types';
import { ConflictError, NotFoundError, ValidationError } from '~/utils/customErrors';
import { PaginationUtils } from '~/utils/pagination';

const prisma = new PrismaClient();

export class AccountNumberService {
  /**
   * Create a new account number
   */
  static async createAccountNumber(data: CreateAccountNumberRequest): Promise<AccountNumberResponse> {
    // Check if account number already exists
    const existingAccountNumber = await prisma.accountNumber.findUnique({
      where: { accountNumber: data.accountNumber },
    });

    if (existingAccountNumber) {
      throw new ConflictError('Account number already exists');
    }

    // Validate bank exists
    const bank = await prisma.bank.findUnique({
      where: { code: data.bankCode },
    });

    if (!bank) {
      throw new ValidationError('Bank not found');
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { code: data.ownerCode },
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Validate account number length
    if (data.accountNumber.length > 50) {
      throw new ValidationError('Account number must be at most 50 characters');
    }

    if (data.accountName.length > 50) {
      throw new ValidationError('Account name must be at most 50 characters');
    }

    const newAccountNumber = await prisma.accountNumber.create({
      data: {
        module: data.module,
        bankCode: data.bankCode,
        ownerCode: data.ownerCode,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
      },
      include: {
        bank: {
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

    return newAccountNumber;
  }

  /**
   * Get account number by ID
   */
  static async getAccountNumberById(id: number): Promise<AccountNumberResponse | null> {
    const accountNumber = await prisma.accountNumber.findUnique({
      where: { id },
      include: {
        bank: {
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

    return accountNumber;
  }

  /**
   * Get account number by account number
   */
  static async getAccountNumberByNumber(
    accountNumber: string
  ): Promise<AccountNumberResponse | null> {
    const record = await prisma.accountNumber.findUnique({
      where: { accountNumber },
      include: {
        bank: {
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

    return record;
  }

  /**
   * Get account numbers by owner code
   */
  static async getAccountNumbersByOwnerCode(ownerCode: string): Promise<AccountNumberResponse[]> {
    const accountNumbers = await prisma.accountNumber.findMany({
      where: { ownerCode },
      include: {
        bank: {
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

    return accountNumbers;
  }

  /**
   * Get account numbers by bank code
   */
  static async getAccountNumbersByBankCode(bankCode: string): Promise<AccountNumberResponse[]> {
    const accountNumbers = await prisma.accountNumber.findMany({
      where: { bankCode },
      include: {
        bank: {
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

    return accountNumbers;
  }

  /**
   * Get account numbers by module
   */
  static async getAccountNumbersByModule(module: string): Promise<AccountNumberResponse[]> {
    const accountNumbers = await prisma.accountNumber.findMany({
      where: { module: module as ModuleEnum },
      include: {
        bank: {
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

    return accountNumbers;
  }

  /**
   * Update account number
   */
  static async updateAccountNumber(
    id: number,
    data: UpdateAccountNumberRequest
  ): Promise<AccountNumberResponse> {
    // Check if account number exists
    const existingAccountNumber = await prisma.accountNumber.findUnique({
      where: { id },
    });

    if (!existingAccountNumber) {
      throw new NotFoundError('Account number not found');
    }

    // If updating account number, check uniqueness
    if (data.accountNumber) {
      if (data.accountNumber.length > 50) {
        throw new ValidationError('Account number must be at most 50 characters');
      }

      const accountNumberWithSameNumber = await prisma.accountNumber.findUnique({
        where: { accountNumber: data.accountNumber },
      });

      if (accountNumberWithSameNumber && accountNumberWithSameNumber.id !== id) {
        throw new ConflictError('Account number already exists');
      }
    }

    // Validate bank if updating
    if (data.bankCode) {
      const bank = await prisma.bank.findUnique({
        where: { code: data.bankCode },
      });

      if (!bank) {
        throw new ValidationError('Bank not found');
      }
    }

    // Validate user if updating
    if (data.ownerCode) {
      const user = await prisma.user.findUnique({
        where: { code: data.ownerCode },
      });

      if (!user) {
        throw new ValidationError('User not found');
      }
    }

    if (data.accountName && data.accountName.length > 50) {
      throw new ValidationError('Account name must be at most 50 characters');
    }

    const updatedAccountNumber = await prisma.accountNumber.update({
      where: { id },
      data: {
        ...(data.module && { module: data.module }),
        ...(data.bankCode && { bankCode: data.bankCode }),
        ...(data.ownerCode && { ownerCode: data.ownerCode }),
        ...(data.accountName && { accountName: data.accountName }),
        ...(data.accountNumber && { accountNumber: data.accountNumber }),
      },
      include: {
        bank: {
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

    return updatedAccountNumber;
  }

  /**
   * Delete account number
   */
  static async deleteAccountNumber(id: number): Promise<void> {
    // Check if account number exists
    const existingAccountNumber = await prisma.accountNumber.findUnique({
      where: { id },
    });

    if (!existingAccountNumber) {
      throw new NotFoundError('Account number not found');
    }

    await prisma.accountNumber.delete({ where: { id } });
  }

  /**
   * Get paginated account numbers list with filters
   */
  static async getAccountNumbers(query: AccountNumberListQuery) {
    // Parse and validate pagination parameters
    const pagination = PaginationUtils.parsePaginationParams(query, 'createdAt', 100);
    const { page, limit, skip, sortBy, sortOrder } = pagination;
    const { search, module, ownerCode, bankCode } = query;

    // Build where clause
    const where: Prisma.AccountNumberWhereInput = {};

    if (search) {
      const searchFilter = PaginationUtils.createTextSearchFilter(search, [
        'accountNumber',
        'accountName',
        'ownerCode',
      ]);
      Object.assign(where, searchFilter);
    }

    if (module) {
      where.module = module;
    }

    if (ownerCode) {
      where.ownerCode = ownerCode;
    }

    if (bankCode) {
      where.bankCode = bankCode;
    }

    // Build orderBy clause
    const orderBy = PaginationUtils.createOrderBy(
      sortBy,
      sortOrder
    ) as Prisma.AccountNumberOrderByWithRelationInput;

    // Get total count
    const total = await prisma.accountNumber.count({ where });

    // Get account numbers
    const accountNumbers = await prisma.accountNumber.findMany({
      where,
      include: {
        bank: {
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

    return PaginationUtils.createPaginatedResult(accountNumbers, page, limit, total);
  }

  /**
   * Get account number statistics
   */
  static async getAccountNumberStats() {
    const totalAccountNumbers = await prisma.accountNumber.count();

    // Get count by module
    const accountNumbersByModule = await prisma.accountNumber.groupBy({
      by: ['module'],
      _count: {
        module: true,
      },
    });

    const moduleStats = accountNumbersByModule.reduce(
      (acc, item) => {
        acc[item.module] = item._count.module;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get count by bank
    const accountNumbersByBank = await prisma.accountNumber.groupBy({
      by: ['bankCode'],
      _count: {
        bankCode: true,
      },
    });

    const bankStats = accountNumbersByBank.reduce(
      (acc, item) => {
        acc[item.bankCode] = item._count.bankCode;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalAccountNumbers,
      accountNumbersByModule: moduleStats,
      accountNumbersByBank: bankStats,
    };
  }
}
