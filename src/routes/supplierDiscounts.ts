/**
 * SupplierDiscount Routes
 * Handles all supplier discount-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { SupplierDiscountController } from '~/controllers/supplierDiscountController';
import { authenticate, authorize } from '~/middleware/auth';
import { supplierDiscountSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create supplier discount
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(supplierDiscountSchemas.create),
  SupplierDiscountController.createSupplierDiscount
);

// Get all supplier discounts with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(supplierDiscountSchemas.list),
  SupplierDiscountController.getSupplierDiscounts
);

// Get supplier discount statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  SupplierDiscountController.getSupplierDiscountStats
);

// Get supplier discount by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(supplierDiscountSchemas.getByCode),
  SupplierDiscountController.getSupplierDiscountByCode
);

// Get supplier discounts by supplier code
router.get(
  '/supplier/:supplierCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  SupplierDiscountController.getSupplierDiscountsBySupplierCode
);

// Individual supplier discount routes
router.get(
  '/:id',
  validate(supplierDiscountSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  SupplierDiscountController.getSupplierDiscountById
);

router.put(
  '/:id',
  validate(supplierDiscountSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  SupplierDiscountController.updateSupplierDiscount
);

router.delete(
  '/:id',
  validate(supplierDiscountSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  SupplierDiscountController.deleteSupplierDiscount
);

export default router;
