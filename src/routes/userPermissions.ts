/**
 * UserPermission Routes
 * Handles all user permission-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { UserPermissionController } from '~/controllers/userPermissionController';
import { authenticate, authorize } from '~/middleware/auth';
import { userPermissionSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create user permission
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER),
  validate(userPermissionSchemas.create),
  UserPermissionController.createUserPermission
);

// Bulk create user permissions
router.post(
  '/bulk',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER),
  UserPermissionController.bulkCreateUserPermissions
);

// Get all user permissions with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR
  ),
  validate(userPermissionSchemas.list),
  UserPermissionController.getUserPermissions
);

// Get user permission statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  UserPermissionController.getUserPermissionStats
);

// Search user permissions
router.get(
  '/search',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR
  ),
  UserPermissionController.searchUserPermissions
);

// Get user permissions by role
router.get(
  '/role/:role',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR
  ),
  UserPermissionController.getUserPermissionsByRole
);

// Get user permissions by menu
router.get(
  '/menu/:menu',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR
  ),
  UserPermissionController.getUserPermissionsByMenu
);

// Get permissions by role and menu
router.get(
  '/role/:role/menu/:menu',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR
  ),
  UserPermissionController.getPermissionsByRoleAndMenu
);

// Individual user permission routes
router.get(
  '/:id',
  validate(userPermissionSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR
  ),
  UserPermissionController.getUserPermissionById
);

router.put(
  '/:id',
  validate(userPermissionSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER),
  UserPermissionController.updateUserPermission
);

router.delete(
  '/:id',
  validate(userPermissionSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER),
  UserPermissionController.deleteUserPermission
);

export default router;
