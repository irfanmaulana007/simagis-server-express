/**
 * Bank Controller Tests
 * Unit tests for bank HTTP request handling
 */

import { NextFunction, Request, Response } from 'express';
import { BankController } from '../../src/controllers/bankController';
import { BankService } from '../../src/services/bankService';
import { ApiResponse } from '../../src/utils/response';

// Mock BankService
jest.mock('../../src/services/bankService');
const mockBankService = BankService as jest.Mocked<typeof BankService>;

// Mock ApiResponse
jest.mock('../../src/utils/response');
const mockApiResponse = ApiResponse as jest.Mocked<typeof ApiResponse>;

describe('BankController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Setup ApiResponse mocks
    mockApiResponse.created.mockReturnValue({
      success: true,
      data: expect.any(Object),
    } as any);
    mockApiResponse.success.mockReturnValue({
      success: true,
      data: expect.any(Object),
    } as any);
    mockApiResponse.updated.mockReturnValue({
      success: true,
      data: expect.any(Object),
    } as any);
    mockApiResponse.deleted.mockReturnValue({
      success: true,
    } as any);
    mockApiResponse.paginated.mockReturnValue({
      success: true,
      data: expect.any(Array),
      metadata: expect.any(Object),
    } as any);
  });

  describe('createBank', () => {
    const mockBankData = {
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

    it('should create bank successfully', async () => {
      mockRequest.body = mockBankData;
      mockBankService.createBank.mockResolvedValue(mockCreatedBank);

      await BankController.createBank(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBankService.createBank).toHaveBeenCalledWith(mockBankData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bank created successfully',
        data: mockCreatedBank,
      });
    });

    it('should handle service errors by calling next with error', async () => {
      mockRequest.body = mockBankData;
      const error = new Error('Service error');
      mockBankService.createBank.mockRejectedValue(error);

      try {
        await BankController.createBank(mockRequest as Request, mockResponse as Response, mockNext);
      } catch (err) {
        // asyncHandler catches and passes to next
      }

      expect(mockBankService.createBank).toHaveBeenCalledWith(mockBankData);
    });
  });

  describe('getBanks', () => {
    const mockQuery = {
      page: '1',
      limit: '10',
      search: 'Central',
    };

    const mockPaginatedResult = {
      data: [
        {
          id: 1,
          code: 'BCA',
          name: 'Bank Central Asia',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    it('should get paginated banks successfully', async () => {
      mockRequest.query = mockQuery;
      mockBankService.getBanks.mockResolvedValue(mockPaginatedResult);

      await BankController.getBanks(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBankService.getBanks).toHaveBeenCalledWith(mockQuery);
      expect(mockApiResponse.paginated).toHaveBeenCalledWith(
        mockPaginatedResult.data,
        mockPaginatedResult.pagination.page,
        mockPaginatedResult.pagination.limit,
        mockPaginatedResult.pagination.total
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
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

    it('should get bank by ID successfully', async () => {
      mockRequest.params = { id: '1' };
      mockBankService.getBankById.mockResolvedValue(mockBank);

      await BankController.getBankById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBankService.getBankById).toHaveBeenCalledWith(1);
      expect(mockApiResponse.success).toHaveBeenCalledWith(mockBank, null);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle bank not found case', async () => {
      mockRequest.params = { id: '999' };
      mockBankService.getBankById.mockResolvedValue(null);

      try {
        await BankController.getBankById(mockRequest as Request, mockResponse as Response, mockNext);
      } catch (err) {
        // asyncHandler catches NotFoundError
      }

      expect(mockBankService.getBankById).toHaveBeenCalledWith(999);
    });
  });

  describe('getBankByCode', () => {
    const mockBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get bank by code successfully', async () => {
      mockRequest.params = { code: 'BCA' };
      mockBankService.getBankByCode.mockResolvedValue(mockBank);

      await BankController.getBankByCode(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBankService.getBankByCode).toHaveBeenCalledWith('BCA');
      expect(mockApiResponse.success).toHaveBeenCalledWith(mockBank, null);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle bank not found case', async () => {
      mockRequest.params = { code: 'XYZ' };
      mockBankService.getBankByCode.mockResolvedValue(null);

      try {
        await BankController.getBankByCode(mockRequest as Request, mockResponse as Response, mockNext);
      } catch (err) {
        // asyncHandler catches NotFoundError
      }

      expect(mockBankService.getBankByCode).toHaveBeenCalledWith('XYZ');
    });
  });

  describe('updateBank', () => {
    const mockUpdateData = {
      name: 'Bank Central Asia Updated',
    };

    const mockUpdatedBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia Updated',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update bank successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = mockUpdateData;
      mockBankService.updateBank.mockResolvedValue(mockUpdatedBank);

      await BankController.updateBank(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBankService.updateBank).toHaveBeenCalledWith(1, mockUpdateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bank updated successfully',
        data: mockUpdatedBank,
      });
    });
  });

  describe('deleteBank', () => {
    it('should delete bank successfully', async () => {
      mockRequest.params = { id: '1' };
      mockBankService.deleteBank.mockResolvedValue();

      await BankController.deleteBank(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBankService.deleteBank).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bank deleted successfully',
      });
    });
  });

  describe('getBankStats', () => {
    const mockStats = {
      totalBanks: 10,
      banksWithAccounts: 6,
      banksWithoutAccounts: 4,
    };

    it('should get bank statistics successfully', async () => {
      mockBankService.getBankStats.mockResolvedValue(mockStats);

      await BankController.getBankStats(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBankService.getBankStats).toHaveBeenCalled();
      expect(mockApiResponse.success).toHaveBeenCalledWith(mockStats, null);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('searchBanks', () => {
    const mockQuery = {
      q: 'Central',
      page: '1',
      limit: '10',
    };

    const mockSearchResult = {
      data: [
        {
          id: 1,
          code: 'BCA',
          name: 'Bank Central Asia',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    it('should search banks successfully', async () => {
      mockRequest.query = mockQuery;
      mockBankService.getBanks.mockResolvedValue(mockSearchResult);

      await BankController.searchBanks(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBankService.getBanks).toHaveBeenCalledWith({
        search: 'Central',
        page: '1',
        limit: '10',
      });
      expect(mockApiResponse.paginated).toHaveBeenCalledWith(
        mockSearchResult.data,
        mockSearchResult.pagination.page,
        mockSearchResult.pagination.limit,
        mockSearchResult.pagination.total
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle search with default parameters', async () => {
      const queryWithDefaults = { q: 'test' };
      mockRequest.query = queryWithDefaults;
      mockBankService.getBanks.mockResolvedValue(mockSearchResult);

      await BankController.searchBanks(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockBankService.getBanks).toHaveBeenCalledWith({
        search: 'test',
        page: 1,
        limit: 10,
      });
    });
  });
});
