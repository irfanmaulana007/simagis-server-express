/**
 * User Routes
 * Defines all user management endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { UserController } from '~/controllers/userController';
import { authenticate, authorize } from '~/middleware/auth';
import { userSchemas, validate } from '~/utils/validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes (accessible by the user themselves)
router.get('/profile', UserController.getProfile);

router.put('/profile', validate(userSchemas.updateProfile), UserController.updateProfile);

// User management routes (admin only)
router.post(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  validate(userSchemas.create),
  UserController.createUser
);

router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  validate(userSchemas.list),
  UserController.getUsers
);

router.get(
  '/stats',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  UserController.getUserStats
);



router.get(
  '/role/:role',
  validate(userSchemas.getByRole),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  UserController.getUsersByRole
);

// Individual user routes
router.get(
  '/:id',
  validate(userSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  UserController.getUserById
);

router.put(
  '/:id',
  validate(userSchemas.update),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  UserController.updateUser
);

router.delete(
  '/:id',
  validate(userSchemas.delete),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.ANGGOTA
  ),
  UserController.deleteUser
);

export default router;
