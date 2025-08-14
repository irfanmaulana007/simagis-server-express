/**
 * CekGiroFailStatus Routes
 * Handles all cek giro fail status-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { CekGiroFailStatusController } from '~/controllers/cekGiroFailStatusController';
import { authenticate, authorize } from '~/middleware/auth';
import { cekGiroFailStatusSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create cek giro fail status
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(cekGiroFailStatusSchemas.create),
  CekGiroFailStatusController.createCekGiroFailStatus
);

// Get all cek giro fail statuses with pagination
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
  validate(cekGiroFailStatusSchemas.list),
  CekGiroFailStatusController.getCekGiroFailStatuses
);

// Get cek giro fail status statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroFailStatusController.getCekGiroFailStatusStats
);



// Get cek giro fail status by code
router.get(
  '/code/:code',
  validate(cekGiroFailStatusSchemas.getByCode),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  CekGiroFailStatusController.getCekGiroFailStatusByCode
);

// Individual cek giro fail status routes
router.get(
  '/:id',
  validate(cekGiroFailStatusSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  CekGiroFailStatusController.getCekGiroFailStatusById
);

router.put(
  '/:id',
  validate(cekGiroFailStatusSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroFailStatusController.updateCekGiroFailStatus
);

router.delete(
  '/:id',
  validate(cekGiroFailStatusSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  CekGiroFailStatusController.deleteCekGiroFailStatus
);

export default router;
