/**
 * AccountNumber Routes
 * Handles all account number-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { AccountNumberController } from '~/controllers/accountNumberController';
import { authenticate, authorize } from '~/middleware/auth';
import { accountNumberSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create account number
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(accountNumberSchemas.create),
  AccountNumberController.createAccountNumber
);

// Get all account numbers with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(accountNumberSchemas.list),
  AccountNumberController.getAccountNumbers
);

// Get account number statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  AccountNumberController.getAccountNumberStats
);

// Get account number by account number
router.get(
  '/number/:accountNumber',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(accountNumberSchemas.getByAccountNumber),
  AccountNumberController.getAccountNumberByNumber
);

// Get account numbers by owner code
router.get(
  '/owner/:ownerCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  AccountNumberController.getAccountNumbersByOwnerCode
);

// Get account numbers by bank code
router.get(
  '/bank/:bankCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  AccountNumberController.getAccountNumbersByBankCode
);

// Get account numbers by module
router.get(
  '/module/:module',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  AccountNumberController.getAccountNumbersByModule
);

// Individual account number routes
router.get(
  '/:id',
  validate(accountNumberSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  AccountNumberController.getAccountNumberById
);

router.put(
  '/:id',
  validate(accountNumberSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  AccountNumberController.updateAccountNumber
);

router.delete(
  '/:id',
  validate(accountNumberSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  AccountNumberController.deleteAccountNumber
);

export default router;
