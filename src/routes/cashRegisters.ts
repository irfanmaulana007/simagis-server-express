/**
 * CashRegister Routes
 * Handles all cash register-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { CashRegisterController } from '~/controllers/cashRegisterController';
import { authenticate, authorize } from '~/middleware/auth';
import { cashRegisterSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create cash register
router.post(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.KASIR
  ),
  validate(cashRegisterSchemas.create),
  CashRegisterController.createCashRegister
);

// Get all cash registers with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cashRegisterSchemas.list),
  CashRegisterController.getCashRegisters
);

// Get cash register statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CashRegisterController.getCashRegisterStats
);

// Get cash register by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cashRegisterSchemas.getByCode),
  CashRegisterController.getCashRegisterByCode
);

// Get cash registers by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CashRegisterController.getCashRegistersByBranchCode
);

// Get cash registers by user code
router.get(
  '/user/:userCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CashRegisterController.getCashRegistersByUserCode
);

// Individual cash register routes
router.get(
  '/:id',
  validate(cashRegisterSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CashRegisterController.getCashRegisterById
);

router.put(
  '/:id',
  validate(cashRegisterSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CashRegisterController.updateCashRegister
);

router.delete(
  '/:id',
  validate(cashRegisterSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  CashRegisterController.deleteCashRegister
);

export default router;
