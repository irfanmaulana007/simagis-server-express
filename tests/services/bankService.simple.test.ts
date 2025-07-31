/**
 * Bank Service Tests (Simplified)
 * Simplified unit tests for bank business logic focusing on core functionality
 */

import { ConflictError, NotFoundError, ValidationError } from '../../src/utils/customErrors';

// Mock dependencies
const mockPrismaBank = {
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrismaAccountNumber = {
  count: jest.fn(),
};

const mockPrisma = {
  bank: mockPrismaBank,
  accountNumber: mockPrismaAccountNumber,
};

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Mock PaginationUtils
jest.mock('../../src/utils/pagination', () => ({
  PaginationUtils: {
    parsePaginationParams: jest.fn(() => ({
      page: 1,
      limit: 10,
      skip: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })),
    createTextSearchFilter: jest.fn(() => ({
      OR: [
        { name: { contains: 'test', mode: 'insensitive' } },
        { code: { contains: 'test', mode: 'insensitive' } },
      ],
    })),
    createOrderBy: jest.fn(() => ({ createdAt: 'desc' })),
    createPaginatedResult: jest.fn((data, page, limit, total) => ({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: false, hasPrev: false },
    })),
  },
}));

// Import the service after mocking
import { BankService } from '../../src/services/bankService';

describe('BankService (Simplified)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBank', () => {
    const validBankData = {
      code: 'BCA',
      name: 'Bank Central Asia',
    };

    const mockCreatedBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new bank successfully', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(null);
      mockPrismaBank.create.mockResolvedValue(mockCreatedBank);

      const result = await BankService.createBank(validBankData);

      expect(mockPrismaBank.findUnique).toHaveBeenCalledWith({
        where: { code: 'BCA' },
      });
      expect(mockPrismaBank.create).toHaveBeenCalledWith({
        data: {
          code: 'BCA',
          name: 'Bank Central Asia',
        },
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockCreatedBank);
    });

    it('should throw ConflictError if bank code already exists', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(mockCreatedBank);

      await expect(BankService.createBank(validBankData)).rejects.toThrow(ConflictError);
      await expect(BankService.createBank(validBankData)).rejects.toThrow(
        'Bank with this code already exists'
      );
    });

    it('should throw ValidationError if code is not 3 characters', async () => {
      const invalidBankData = {
        code: 'BC',
        name: 'Bank Central Asia',
      };

      // Make sure the mock doesn't return an existing bank (which would cause ConflictError)
      mockPrismaBank.findUnique.mockResolvedValue(null);

      await expect(BankService.createBank(invalidBankData)).rejects.toThrow(ValidationError);
      await expect(BankService.createBank(invalidBankData)).rejects.toThrow(
        'Bank code must be exactly 3 characters'
      );
    });
  });

  describe('getBankById', () => {
    const mockBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return bank when found', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(mockBank);

      const result = await BankService.getBankById(1);

      expect(mockPrismaBank.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockBank);
    });

    it('should return null when bank not found', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(null);

      const result = await BankService.getBankById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateBank', () => {
    const existingBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateData = {
      name: 'Bank Central Asia Updated',
    };

    it('should update bank successfully', async () => {
      const updatedBank = {
        ...existingBank,
        name: 'Bank Central Asia Updated',
        updatedAt: new Date(),
      };

      mockPrismaBank.findUnique.mockResolvedValue(existingBank);
      mockPrismaBank.update.mockResolvedValue(updatedBank);

      const result = await BankService.updateBank(1, updateData);

      expect(mockPrismaBank.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaBank.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Bank Central Asia Updated',
        },
        select: {
          id: true,
          code: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(updatedBank);
    });

    it('should throw NotFoundError if bank does not exist', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(null);

      await expect(BankService.updateBank(999, updateData)).rejects.toThrow(NotFoundError);
      await expect(BankService.updateBank(999, updateData)).rejects.toThrow('Bank not found');
    });
  });

  describe('deleteBank', () => {
    const existingBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
    };

    it('should delete bank successfully', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(existingBank);
      mockPrismaAccountNumber.count.mockResolvedValue(0);
      mockPrismaBank.delete.mockResolvedValue(existingBank);

      await BankService.deleteBank(1);

      expect(mockPrismaBank.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaAccountNumber.count).toHaveBeenCalledWith({
        where: { bankCode: 'BCA' },
      });
      expect(mockPrismaBank.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundError if bank does not exist', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(null);

      await expect(BankService.deleteBank(999)).rejects.toThrow(NotFoundError);
      await expect(BankService.deleteBank(999)).rejects.toThrow('Bank not found');
    });

    it('should throw ConflictError if bank is referenced by account numbers', async () => {
      mockPrismaBank.findUnique.mockResolvedValue(existingBank);
      mockPrismaAccountNumber.count.mockResolvedValue(5);

      await expect(BankService.deleteBank(1)).rejects.toThrow(ConflictError);
      await expect(BankService.deleteBank(1)).rejects.toThrow(
        'Cannot delete bank. It is referenced by account numbers.'
      );
    });
  });

  describe('getBanks', () => {
    const mockBanks = [
      {
        id: 1,
        code: 'BCA',
        name: 'Bank Central Asia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        code: 'BNI',
        name: 'Bank Negara Indonesia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return paginated banks', async () => {
      const query = { page: '1', limit: '10' };

      mockPrismaBank.count.mockResolvedValue(2);
      mockPrismaBank.findMany.mockResolvedValue(mockBanks);

      const result = await BankService.getBanks(query);

      expect(mockPrismaBank.count).toHaveBeenCalled();
      expect(mockPrismaBank.findMany).toHaveBeenCalled();
      expect(result.data).toEqual(mockBanks);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('getBankStats', () => {
    it('should return bank statistics', async () => {
      mockPrismaBank.count
        .mockResolvedValueOnce(10) // Total banks
        .mockResolvedValueOnce(6); // Banks with accounts

      const result = await BankService.getBankStats();

      expect(mockPrismaBank.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalBanks: 10,
        banksWithAccounts: 6,
        banksWithoutAccounts: 4,
      });
    });
  });
});
