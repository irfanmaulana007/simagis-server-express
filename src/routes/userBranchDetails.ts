/**
 * UserBranchDetail Routes
 * Handles all user branch detail-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { UserBranchDetailController } from '~/controllers/userBranchDetailController';
import { authenticate, authorize } from '~/middleware/auth';
import { userBranchDetailSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create user branch detail
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(userBranchDetailSchemas.create),
  UserBranchDetailController.createUserBranchDetail
);

// Get all user branch details with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(userBranchDetailSchemas.list),
  UserBranchDetailController.getUserBranchDetails
);

// Get user branch detail statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  UserBranchDetailController.getUserBranchDetailStats
);

// Get user branch details by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  UserBranchDetailController.getUserBranchDetailsByBranchCode
);

// Get user branch details by user code
router.get(
  '/user/:userCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  UserBranchDetailController.getUserBranchDetailsByUserCode
);

// Individual user branch detail routes
router.get(
  '/:id',
  validate(userBranchDetailSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  UserBranchDetailController.getUserBranchDetailById
);

router.put(
  '/:id',
  validate(userBranchDetailSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  UserBranchDetailController.updateUserBranchDetail
);

router.delete(
  '/:id',
  validate(userBranchDetailSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  UserBranchDetailController.deleteUserBranchDetail
);

export default router;
