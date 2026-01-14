/**
 * CekGiroOwner Routes
 * Handles all cek giro owner-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { CekGiroOwnerController } from '~/controllers/cekGiroOwnerController';
import { authenticate, authorize } from '~/middleware/auth';
import { cekGiroOwnerSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create cek giro owner
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(cekGiroOwnerSchemas.create),
  CekGiroOwnerController.createCekGiroOwner
);

// Get all cek giro owners with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cekGiroOwnerSchemas.list),
  CekGiroOwnerController.getCekGiroOwners
);

// Get cek giro owner statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroOwnerController.getCekGiroOwnerStats
);

// Get cek giro owners by cek giro code
router.get(
  '/cek-giro/:cekGiroCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CekGiroOwnerController.getCekGiroOwnersByCekGiroCode
);

// Get cek giro owners by user code
router.get(
  '/user/:userCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CekGiroOwnerController.getCekGiroOwnersByUserCode
);

// Individual cek giro owner routes
router.get(
  '/:id',
  validate(cekGiroOwnerSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CekGiroOwnerController.getCekGiroOwnerById
);

router.put(
  '/:id',
  validate(cekGiroOwnerSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroOwnerController.updateCekGiroOwner
);

router.delete(
  '/:id',
  validate(cekGiroOwnerSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  CekGiroOwnerController.deleteCekGiroOwner
);

export default router;
