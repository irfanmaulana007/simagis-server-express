/**
 * ProductDetail Routes
 * Handles all product detail-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ProductDetailController } from '~/controllers/productDetailController';
import { authenticate, authorize } from '~/middleware/auth';
import { productDetailSchemas, validate } from '~/utils/validation';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(productDetailSchemas.create),
  ProductDetailController.createProductDetail
);

router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  validate(productDetailSchemas.list),
  ProductDetailController.getProductDetails
);

router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ProductDetailController.getProductDetailStats
);

router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  validate(productDetailSchemas.getByCode),
  ProductDetailController.getProductDetailByCode
);

router.get(
  '/product/:productCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  ProductDetailController.getProductDetailsByProductCode
);

router.get(
  '/:id',
  validate(productDetailSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.KASIR,
    RoleEnum.SALES
  ),
  ProductDetailController.getProductDetailById
);

router.put(
  '/:id',
  validate(productDetailSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ProductDetailController.updateProductDetail
);

router.delete(
  '/:id',
  validate(productDetailSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ProductDetailController.deleteProductDetail
);

export default router;
