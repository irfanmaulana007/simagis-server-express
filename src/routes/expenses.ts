/**
 * Expense Routes
 * Handles all expense-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ExpenseController } from '~/controllers/expenseController';
import { authenticate, authorize } from '~/middleware/auth';
import { expenseSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create expense
router.post(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(expenseSchemas.create),
  ExpenseController.createExpense
);

// Get all expenses with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(expenseSchemas.list),
  ExpenseController.getExpenses
);

// Get expense statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ExpenseController.getExpenseStats
);

// Get expense by code
router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  validate(expenseSchemas.getByCode),
  ExpenseController.getExpenseByCode
);

// Get expenses by branch code
router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  ExpenseController.getExpensesByBranchCode
);

// Get expenses by expense category code
router.get(
  '/category/:expenseCategoryCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  ExpenseController.getExpensesByExpenseCategoryCode
);

// Individual expense routes
router.get(
  '/:id',
  validate(expenseSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR
  ),
  ExpenseController.getExpenseById
);

router.put(
  '/:id',
  validate(expenseSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ExpenseController.updateExpense
);

router.delete(
  '/:id',
  validate(expenseSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ExpenseController.deleteExpense
);

export default router;
