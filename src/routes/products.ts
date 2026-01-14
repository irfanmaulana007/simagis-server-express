/**
 * Product Routes
 * Handles all product-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ProductController } from '~/controllers/productController';
import { authenticate, authorize } from '~/middleware/auth';
import { productSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create product
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(productSchemas.create),
  ProductController.createProduct
);

// Get all products with pagination
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
  validate(productSchemas.list),
  ProductController.getProducts
);

// Get product statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ProductController.getProductStats
);

// Get product by code
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
  validate(productSchemas.getByCode),
  ProductController.getProductByCode
);

// Get products by branch code
router.get(
  '/branch/:branchCode',
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
  ProductController.getProductsByBranchCode
);

// Get products by product category code
router.get(
  '/category/:productCategoryCode',
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
  ProductController.getProductsByProductCategoryCode
);

// Individual product routes
router.get(
  '/:id',
  validate(productSchemas.getById),
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
  ProductController.getProductById
);

router.put(
  '/:id',
  validate(productSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  validate(productSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ProductController.deleteProduct
);

export default router;
