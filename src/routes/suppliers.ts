/**
 * Supplier Routes
 * Handles all supplier-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { SupplierController } from '~/controllers/supplierController';
import { authenticate, authorize } from '~/middleware/auth';
import { supplierSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create supplier
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(supplierSchemas.create),
  SupplierController.createSupplier
);

// Get all suppliers with pagination
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
  validate(supplierSchemas.list),
  SupplierController.getSuppliers
);

// Get supplier statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  SupplierController.getSupplierStats
);

// Get supplier by code
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
  validate(supplierSchemas.getByCode),
  SupplierController.getSupplierByCode
);

// Get suppliers by branch code
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
  SupplierController.getSuppliersByBranchCode
);

// Individual supplier routes
router.get(
  '/:id',
  validate(supplierSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE
  ),
  SupplierController.getSupplierById
);

router.put(
  '/:id',
  validate(supplierSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  SupplierController.updateSupplier
);

router.delete(
  '/:id',
  validate(supplierSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  SupplierController.deleteSupplier
);

export default router;
