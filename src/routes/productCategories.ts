/**
 * ProductCategory Routes
 * Handles all product category-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ProductCategoryController } from '~/controllers/productCategoryController';
import { authenticate, authorize } from '~/middleware/auth';
import { productCategorySchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create product category
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(productCategorySchemas.create),
  ProductCategoryController.createProductCategory
);

// Get all product categories with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE
  ),
  validate(productCategorySchemas.list),
  ProductCategoryController.getProductCategories
);

// Get product category statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ProductCategoryController.getProductCategoryStats
);

// Get product category by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE
  ),
  validate(productCategorySchemas.getByCode),
  ProductCategoryController.getProductCategoryByCode
);

// Get product categories by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE
  ),
  ProductCategoryController.getProductCategoriesByBranchCode
);

// Individual product category routes
router.get(
  '/:id',
  validate(productCategorySchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE
  ),
  ProductCategoryController.getProductCategoryById
);

router.put(
  '/:id',
  validate(productCategorySchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ProductCategoryController.updateProductCategory
);

router.delete(
  '/:id',
  validate(productCategorySchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ProductCategoryController.deleteProductCategory
);

export default router;
