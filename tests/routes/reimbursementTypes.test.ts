/**
 * ReimbursementType Routes Integration Tests
 */

import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';

// Mock dependencies
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({})),
  RoleEnum: { SUPER_ADMIN: 'SUPER_ADMIN', OWNER: 'OWNER', PIMPINAN: 'PIMPINAN', HEAD_KANTOR: 'HEAD_KANTOR', ANGGOTA: 'ANGGOTA', STAFF_KANTOR: 'STAFF_KANTOR' },
}));

import { RoleEnum } from '@prisma/client';
import { errorHandler } from '../../src/middleware/errorHandler';
import reimbursementTypeRoutes from '../../src/routes/reimbursementTypes';
import { ReimbursementTypeService } from '../../src/services/reimbursementTypeService';

jest.mock('../../src/services/reimbursementTypeService');
jest.mock('../../src/middleware/auth', () => ({
  authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => {
    (req as any).user = { id: 1, role: RoleEnum.SUPER_ADMIN };
    next();
  }),
  authorize: jest.fn((...roles: RoleEnum[]) => (req: Request, res: Response, next: NextFunction) => next()),
}));

const mockReimbursementTypeService = ReimbursementTypeService as jest.Mocked<typeof ReimbursementTypeService>;
const app = express();
app.use(express.json());
app.use('/api/reimbursement-types', reimbursementTypeRoutes);
app.use(errorHandler);

describe('ReimbursementType Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  const validReimbursementTypeData = {
    code: 'REIMB01',
    name: 'Travel Expense',
  };

  const mockReimbursementType = {
    id: 1,
    ...validReimbursementTypeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedResult = {
    data: [mockReimbursementType],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
  };

  describe('POST /api/reimbursement-types', () => {
    it('should create reimbursement type successfully', async () => {
      mockReimbursementTypeService.createReimbursementType.mockResolvedValue(mockReimbursementType);

      const response = await request(app)
        .post('/api/reimbursement-types')
        .send(validReimbursementTypeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resource).toEqual(expect.objectContaining({ id: 1, name: 'Travel Expense' }));
      expect(mockReimbursementTypeService.createReimbursementType).toHaveBeenCalledWith(validReimbursementTypeData);
    });

    it('should return 400 for invalid data', async () => {
      await request(app)
        .post('/api/reimbursement-types')
        .send({ name: 'Test' })
        .expect(400);
    });
  });

  describe('GET /api/reimbursement-types', () => {
    it('should get reimbursement types with pagination', async () => {
      mockReimbursementTypeService.getReimbursementTypes.mockResolvedValue(mockPaginatedResult);

      const response = await request(app)
        .get('/api/reimbursement-types')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: mockReimbursementType.id,
          code: mockReimbursementType.code,
          name: mockReimbursementType.name,
        })
      ]));
    });
  });

  describe('GET /api/reimbursement-types/:id', () => {
    it('should get reimbursement type by ID', async () => {
      mockReimbursementTypeService.getReimbursementTypeById.mockResolvedValue(mockReimbursementType);

      const response = await request(app)
        .get('/api/reimbursement-types/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expect.objectContaining({
        id: mockReimbursementType.id,
        code: mockReimbursementType.code,
        name: mockReimbursementType.name,
      }));
    });

    it('should return 404 for non-existent reimbursement type', async () => {
      mockReimbursementTypeService.getReimbursementTypeById.mockResolvedValue(null);

      await request(app)
        .get('/api/reimbursement-types/999')
        .expect(404);
    });
  });

  describe('PUT /api/reimbursement-types/:id', () => {
    it('should update reimbursement type successfully', async () => {
      const updateData = { name: 'Updated Expense Type' };
      const updatedReimbursementType = { ...mockReimbursementType, ...updateData };
      mockReimbursementTypeService.updateReimbursementType.mockResolvedValue(updatedReimbursementType);

      const response = await request(app)
        .put('/api/reimbursement-types/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.resource.name).toBe('Updated Expense Type');
    });
  });

  describe('DELETE /api/reimbursement-types/:id', () => {
    it('should delete reimbursement type successfully', async () => {
      mockReimbursementTypeService.deleteReimbursementType.mockResolvedValue();

      const response = await request(app)
        .delete('/api/reimbursement-types/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Reimbursement type deleted successfully');
    });
  });

  describe('GET /api/reimbursement-types/stats', () => {
    it('should get reimbursement type statistics', async () => {
      const mockStats = { totalReimbursementTypes: 5, mostUsedTypes: [] };
      mockReimbursementTypeService.getReimbursementTypeStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/api/reimbursement-types/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockStats);
    });
  });
});
