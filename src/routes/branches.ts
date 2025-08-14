/**
 * Branch Routes
 * Handles all branch-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { BranchController } from '~/controllers/branchController';
import { authenticate, authorize } from '~/middleware/auth';
import { branchSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create branch
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  validate(branchSchemas.create),
  BranchController.createBranch
);

// Get all branches with pagination
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
  validate(branchSchemas.list),
  BranchController.getBranches
);

// Get branch statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  BranchController.getBranchStats
);



// Get branches by price type
router.get(
  '/price-type/:priceType',
  validate(branchSchemas.getByPriceType),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  BranchController.getBranchesByPriceType
);

// Get branch by code
router.get(
  '/code/:code',
  validate(branchSchemas.getByCode),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  BranchController.getBranchByCode
);

// Individual branch routes
router.get(
  '/:id',
  validate(branchSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  BranchController.getBranchById
);

router.put(
  '/:id',
  validate(branchSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  BranchController.updateBranch
);

router.delete(
  '/:id',
  validate(branchSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  BranchController.deleteBranch
);

export default router;
