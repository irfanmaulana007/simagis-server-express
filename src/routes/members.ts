/**
 * Member Routes
 * Handles all member-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { MemberController } from '~/controllers/memberController';
import { authenticate, authorize } from '~/middleware/auth';
import { memberSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create member
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(memberSchemas.create),
  MemberController.createMember
);

// Get all members with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  validate(memberSchemas.list),
  MemberController.getMembers
);

// Get member statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  MemberController.getMemberStats
);

// Get member by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  validate(memberSchemas.getByCode),
  MemberController.getMemberByCode
);

// Get members by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  MemberController.getMembersByBranchCode
);

// Individual member routes
router.get(
  '/:id',
  validate(memberSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  MemberController.getMemberById
);

router.put(
  '/:id',
  validate(memberSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  MemberController.updateMember
);

router.delete(
  '/:id',
  validate(memberSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  MemberController.deleteMember
);

export default router;
