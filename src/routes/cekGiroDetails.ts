/**
 * CekGiroDetail Routes
 * Handles all cek giro detail-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { CekGiroDetailController } from '~/controllers/cekGiroDetailController';
import { authenticate, authorize } from '~/middleware/auth';
import { cekGiroDetailSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create cek giro detail
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(cekGiroDetailSchemas.create),
  CekGiroDetailController.createCekGiroDetail
);

// Get all cek giro details with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cekGiroDetailSchemas.list),
  CekGiroDetailController.getCekGiroDetails
);

// Get cek giro detail statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroDetailController.getCekGiroDetailStats
);

// Get cek giro detail by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cekGiroDetailSchemas.getByCode),
  CekGiroDetailController.getCekGiroDetailByCode
);

// Get cek giro details by cek giro code
router.get(
  '/cek-giro/:cekGiroCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(cekGiroDetailSchemas.getByCekGiroCode),
  CekGiroDetailController.getCekGiroDetailsByCekGiroCode
);

// Individual cek giro detail routes
router.get(
  '/:id',
  validate(cekGiroDetailSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  CekGiroDetailController.getCekGiroDetailById
);

router.put(
  '/:id',
  validate(cekGiroDetailSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  CekGiroDetailController.updateCekGiroDetail
);

router.delete(
  '/:id',
  validate(cekGiroDetailSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  CekGiroDetailController.deleteCekGiroDetail
);

export default router;
