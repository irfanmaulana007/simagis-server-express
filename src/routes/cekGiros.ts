/**
 * CekGiro Routes
 * Handles all cek giro-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { CekGiroController } from '~/controllers/cekGiroController';
import { authenticate, authorize } from '~/middleware/auth';
import { cekGiroSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create cek giro
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(cekGiroSchemas.create),
  CekGiroController.createCekGiro
);

// Get all cek giros with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cekGiroSchemas.list),
  CekGiroController.getCekGiros
);

// Get cek giro statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroController.getCekGiroStats
);

// Get cek giro by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cekGiroSchemas.getByCode),
  CekGiroController.getCekGiroByCode
);

// Get cek giros by type
router.get(
  '/type/:type',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CekGiroController.getCekGirosByType
);

// Individual cek giro routes
router.get(
  '/:id',
  validate(cekGiroSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CekGiroController.getCekGiroById
);

router.put(
  '/:id',
  validate(cekGiroSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroController.updateCekGiro
);

router.delete(
  '/:id',
  validate(cekGiroSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  CekGiroController.deleteCekGiro
);

export default router;
