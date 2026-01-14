/**
 * Promo Routes
 * Handles all promo-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { PromoController } from '~/controllers/promoController';
import { authenticate, authorize } from '~/middleware/auth';
import { promoSchemas, validate } from '~/utils/validation';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(promoSchemas.create),
  PromoController.createPromo
);

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
  validate(promoSchemas.list),
  PromoController.getPromos
);

router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  PromoController.getPromoStats
);

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
  validate(promoSchemas.getByCode),
  PromoController.getPromoByCode
);

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
  PromoController.getPromosByBranchCode
);

router.get(
  '/:id',
  validate(promoSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  PromoController.getPromoById
);

router.put(
  '/:id',
  validate(promoSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  PromoController.updatePromo
);

router.delete(
  '/:id',
  validate(promoSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  PromoController.deletePromo
);

export default router;
