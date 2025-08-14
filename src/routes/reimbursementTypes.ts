/**
 * ReimbursementType Routes
 * Handles all reimbursement type-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ReimbursementTypeController } from '~/controllers/reimbursementTypeController';
import { authenticate, authorize } from '~/middleware/auth';
import { reimbursementTypeSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create reimbursement type
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  validate(reimbursementTypeSchemas.create),
  ReimbursementTypeController.createReimbursementType
);

// Get all reimbursement types with pagination
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
  validate(reimbursementTypeSchemas.list),
  ReimbursementTypeController.getReimbursementTypes
);

// Get reimbursement type statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ReimbursementTypeController.getReimbursementTypeStats
);



// Get reimbursement type by code
router.get(
  '/code/:code',
  validate(reimbursementTypeSchemas.getByCode),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  ReimbursementTypeController.getReimbursementTypeByCode
);

// Individual reimbursement type routes
router.get(
  '/:id',
  validate(reimbursementTypeSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  ReimbursementTypeController.getReimbursementTypeById
);

router.put(
  '/:id',
  validate(reimbursementTypeSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ReimbursementTypeController.updateReimbursementType
);

router.delete(
  '/:id',
  validate(reimbursementTypeSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ReimbursementTypeController.deleteReimbursementType
);

export default router;
