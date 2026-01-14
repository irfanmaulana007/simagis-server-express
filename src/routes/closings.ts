/**
 * Closing Routes
 * Handles all closing-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ClosingController } from '~/controllers/closingController';
import { authenticate, authorize } from '~/middleware/auth';
import { closingSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create closing
router.post(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.KASIR
  ),
  validate(closingSchemas.create),
  ClosingController.createClosing
);

// Get all closings with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(closingSchemas.list),
  ClosingController.getClosings
);

// Get closing statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ClosingController.getClosingStats
);

// Get closing by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(closingSchemas.getByCode),
  ClosingController.getClosingByCode
);

// Get closings by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  ClosingController.getClosingsByBranchCode
);

// Individual closing routes
router.get(
  '/:id',
  validate(closingSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  ClosingController.getClosingById
);

router.put(
  '/:id',
  validate(closingSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ClosingController.updateClosing
);

router.delete(
  '/:id',
  validate(closingSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ClosingController.deleteClosing
);

export default router;
