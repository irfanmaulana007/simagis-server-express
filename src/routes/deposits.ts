/**
 * Deposit Routes
 * Handles all deposit-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { DepositController } from '~/controllers/depositController';
import { authenticate, authorize } from '~/middleware/auth';
import { depositSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create deposit
router.post(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(depositSchemas.create),
  DepositController.createDeposit
);

// Get all deposits with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(depositSchemas.list),
  DepositController.getDeposits
);

// Get deposit statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  DepositController.getDepositStats
);

// Get deposit by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(depositSchemas.getByCode),
  DepositController.getDepositByCode
);

// Get deposits by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  DepositController.getDepositsByBranchCode
);

// Get deposits by status
router.get(
  '/status/:status',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  DepositController.getDepositsByStatus
);

// Individual deposit routes
router.get(
  '/:id',
  validate(depositSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  DepositController.getDepositById
);

router.put(
  '/:id',
  validate(depositSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  DepositController.updateDeposit
);

router.delete(
  '/:id',
  validate(depositSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  DepositController.deleteDeposit
);

export default router;
