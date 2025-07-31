/**
 * Bank Routes Integration Tests
 * Tests for bank API endpoints and middleware integration
 */

import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';

// Mock dependencies first before importing
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    bank: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  })),
  RoleEnum: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    OWNER: 'OWNER',
    PIMPINAN: 'PIMPINAN',
    HEAD_KANTOR: 'HEAD_KANTOR',
    ANGGOTA: 'ANGGOTA',
    STAFF_KANTOR: 'STAFF_KANTOR',
    STAFF_INVENTORY: 'STAFF_INVENTORY',
    STAFF_WAREHOUSE: 'STAFF_WAREHOUSE',
    SALES: 'SALES',
    KASIR: 'KASIR',
  },
}));

import { RoleEnum } from '@prisma/client';
import { errorHandler } from '../../src/middleware/errorHandler';
import bankRoutes from '../../src/routes/banks';
import { BankService } from '../../src/services/bankService';

// Mock dependencies
jest.mock('../../src/services/bankService');
jest.mock('../../src/middleware/auth', () => ({
  authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => {
    // Mock authenticated user
    (req as any).user = {
      id: 1,
      code: 'USR001',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      phone: '1234567890',
      address: 'Test Address',
      role: RoleEnum.SUPER_ADMIN,
      expenseLimit: 1000000,
      discountLimit: 50000,
      point: 0,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    next();
  }),
  authorize: jest.fn((...roles: RoleEnum[]) => (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (userRole && roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden' });
    }
  }),
}));

const mockBankService = BankService as jest.Mocked<typeof BankService>;

// Create test app
const app = express();
app.use(express.json());
app.use('/api/banks', bankRoutes);
app.use(errorHandler);

describe('Bank Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/banks', () => {
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

    it('should create bank successfully with valid data', async () => {
      mockBankService.createBank.mockResolvedValue(mockCreatedBank);

      const response = await request(app)
        .post('/api/banks')
        .send(validBankData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bank created successfully');
      expect(response.body.data).toEqual(expect.objectContaining({
        id: 1,
        code: 'BCA',
        name: 'Bank Central Asia',
      }));
      expect(mockBankService.createBank).toHaveBeenCalledWith(validBankData);
    });

    it('should return 400 for invalid bank data', async () => {
      const invalidData = {
        code: 'BC', // Too short
        name: '', // Empty name
      };

      const response = await request(app)
        .post('/api/banks')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'Bank Central Asia',
        // Missing code
      };

      const response = await request(app)
        .post('/api/banks')
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/banks', () => {
    const mockPaginatedResult = {
      data: [
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
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    it('should get banks with default pagination', async () => {
      mockBankService.getBanks.mockResolvedValue(mockPaginatedResult);

      const response = await request(app)
        .get('/api/banks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.metadata).toEqual(expect.objectContaining({
        page: 1,
        limit: 10,
        total: 2,
      }));
    });

    it('should get banks with custom pagination parameters', async () => {
      mockBankService.getBanks.mockResolvedValue(mockPaginatedResult);

      const response = await request(app)
        .get('/api/banks')
        .query({
          page: '1',
          limit: '5',
          sortBy: 'name',
          sortOrder: 'asc',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockBankService.getBanks).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('should get banks with search filter', async () => {
      mockBankService.getBanks.mockResolvedValue(mockPaginatedResult);

      const response = await request(app)
        .get('/api/banks')
        .query({ search: 'Central' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockBankService.getBanks).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Central',
        })
      );
    });
  });

  describe('GET /api/banks/:id', () => {
    const mockBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get bank by valid ID', async () => {
      mockBankService.getBankById.mockResolvedValue(mockBank);

      const response = await request(app)
        .get('/api/banks/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expect.objectContaining({
        id: 1,
        code: 'BCA',
        name: 'Bank Central Asia',
      }));
      expect(mockBankService.getBankById).toHaveBeenCalledWith(1);
    });

    it('should return 404 for non-existent bank', async () => {
      mockBankService.getBankById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/banks/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bank not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/banks/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/banks/code/:code', () => {
    const mockBank = {
      id: 1,
      code: 'BCA',
      name: 'Bank Central Asia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get bank by valid code', async () => {
      mockBankService.getBankByCode.mockResolvedValue(mockBank);

      const response = await request(app)
        .get('/api/banks/code/BCA')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expect.objectContaining({
        code: 'BCA',
        name: 'Bank Central Asia',
      }));
      expect(mockBankService.getBankByCode).toHaveBeenCalledWith('BCA');
    });

    it('should return 404 for non-existent bank code', async () => {
      mockBankService.getBankByCode.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/banks/code/XYZ')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid code format', async () => {
      const response = await request(app)
        .get('/api/banks/code/INVALID')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/banks/:id', () => {
    const updateData = {
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
      mockBankService.updateBank.mockResolvedValue(mockUpdatedBank);

      const response = await request(app)
        .put('/api/banks/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bank updated successfully');
      expect(response.body.data.name).toBe('Bank Central Asia Updated');
      expect(mockBankService.updateBank).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        code: 'BC', // Too short
      };

      const response = await request(app)
        .put('/api/banks/1')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/banks/:id', () => {
    it('should delete bank successfully', async () => {
      mockBankService.deleteBank.mockResolvedValue();

      const response = await request(app)
        .delete('/api/banks/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Bank deleted successfully');
      expect(mockBankService.deleteBank).toHaveBeenCalledWith(1);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/banks/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/banks/stats', () => {
    const mockStats = {
      totalBanks: 10,
      banksWithAccounts: 6,
      banksWithoutAccounts: 4,
    };

    it('should get bank statistics', async () => {
      mockBankService.getBankStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/api/banks/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStats);
      expect(mockBankService.getBankStats).toHaveBeenCalled();
    });
  });

  describe('GET /api/banks/search', () => {
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

    it('should search banks with query parameter', async () => {
      mockBankService.getBanks.mockResolvedValue(mockSearchResult);

      const response = await request(app)
        .get('/api/banks/search')
        .query({ q: 'Central' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(mockBankService.getBanks).toHaveBeenCalledWith({
        search: 'Central',
        page: 1,
        limit: 10,
      });
    });

    it('should search banks with custom pagination', async () => {
      mockBankService.getBanks.mockResolvedValue(mockSearchResult);

      const response = await request(app)
        .get('/api/banks/search')
        .query({
          q: 'Bank',
          page: '2',
          limit: '5',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockBankService.getBanks).toHaveBeenCalledWith({
        search: 'Bank',
        page: '2',
        limit: '5',
      });
    });
  });

  describe('Authorization', () => {
    beforeEach(() => {
      // Mock different user roles for authorization tests
      jest.mock('../../src/middleware/auth', () => ({
        authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => {
          (req as any).user = {
            id: 2,
            code: 'USR002',
            name: 'Test User 2',
            email: 'test2@example.com',
            username: 'testuser2',
            phone: '1234567891',
            address: 'Test Address 2',
            role: RoleEnum.ANGGOTA, // Lower privilege role
            expenseLimit: 500000,
            discountLimit: 25000,
            point: 0,
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          next();
        }),
        authorize: jest.fn((...roles: RoleEnum[]) => (req: Request, res: Response, next: NextFunction) => {
          const userRole = (req as any).user?.role;
          if (userRole && roles.includes(userRole)) {
            next();
          } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
          }
        }),
      }));
    });

    it('should allow read operations for ANGGOTA role', async () => {
      mockBankService.getBanks.mockResolvedValue({
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });

      const response = await request(app)
        .get('/api/banks')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
