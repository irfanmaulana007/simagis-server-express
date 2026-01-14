/**
 * ExpenseCategory Routes
 * Handles all expense category-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ExpenseCategoryController } from '~/controllers/expenseCategoryController';
import { authenticate, authorize } from '~/middleware/auth';
import { expenseCategorySchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create expense category
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(expenseCategorySchemas.create),
  ExpenseCategoryController.createExpenseCategory
);

// Get all expense categories with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR
  ),
  validate(expenseCategorySchemas.list),
  ExpenseCategoryController.getExpenseCategories
);

// Get expense category statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ExpenseCategoryController.getExpenseCategoryStats
);

// Get expense category by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR
  ),
  validate(expenseCategorySchemas.getByCode),
  ExpenseCategoryController.getExpenseCategoryByCode
);

// Get expense categories by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR
  ),
  ExpenseCategoryController.getExpenseCategoriesByBranchCode
);

// Individual expense category routes
router.get(
  '/:id',
  validate(expenseCategorySchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.KASIR
  ),
  ExpenseCategoryController.getExpenseCategoryById
);

router.put(
  '/:id',
  validate(expenseCategorySchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ExpenseCategoryController.updateExpenseCategory
);

router.delete(
  '/:id',
  validate(expenseCategorySchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ExpenseCategoryController.deleteExpenseCategory
);

export default router;
