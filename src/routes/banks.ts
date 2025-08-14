/**
 * Bank Routes
 * Handles all bank-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { BankController } from '~/controllers/bankController';
import { authenticate, authorize } from '~/middleware/auth';
import { bankSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create bank
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(bankSchemas.create),
  BankController.createBank
);

// Get all banks with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  validate(bankSchemas.list),
  BankController.getBanks
);

// Get bank statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  BankController.getBankStats
);



// Get bank by code
router.get(
  '/code/:code',
  validate(bankSchemas.getByCode),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  BankController.getBankByCode
);

// Individual bank routes
router.get(
  '/:id',
  validate(bankSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  BankController.getBankById
);

router.put(
  '/:id',
  validate(bankSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  BankController.updateBank
);

router.delete(
  '/:id',
  validate(bankSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  BankController.deleteBank
);

export default router;
