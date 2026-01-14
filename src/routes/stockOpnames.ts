/**
 * StockOpname Routes
 * Handles all stock opname-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { StockOpnameController } from '~/controllers/stockOpnameController';
import { authenticate, authorize } from '~/middleware/auth';
import { stockOpnameSchemas, validate } from '~/utils/validation';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_INVENTORY
  ),
  validate(stockOpnameSchemas.create),
  StockOpnameController.createStockOpname
);

router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY
  ),
  validate(stockOpnameSchemas.list),
  StockOpnameController.getStockOpnames
);

router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  StockOpnameController.getStockOpnameStats
);

router.get(
  '/code/:code',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY
  ),
  validate(stockOpnameSchemas.getByCode),
  StockOpnameController.getStockOpnameByCode
);

router.get(
  '/branch/:branchCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY
  ),
  StockOpnameController.getStockOpnamesByBranchCode
);

router.get(
  '/:id',
  validate(stockOpnameSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY
  ),
  StockOpnameController.getStockOpnameById
);

router.put(
  '/:id',
  validate(stockOpnameSchemas.update),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_INVENTORY
  ),
  StockOpnameController.updateStockOpname
);

router.delete(
  '/:id',
  validate(stockOpnameSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  StockOpnameController.deleteStockOpname
);

export default router;
