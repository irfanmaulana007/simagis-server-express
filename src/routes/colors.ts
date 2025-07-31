/**
 * Color Routes
 * Handles all color-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { ColorController } from '~/controllers/colorController';
import { authenticate, authorize } from '~/middleware/auth';
import { colorSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create color
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(colorSchemas.create),
  ColorController.createColor
);

// Get all colors with pagination
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
    RoleEnum.ANGGOTA
  ),
  validate(colorSchemas.list),
  ColorController.getColors
);

// Get color statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ColorController.getColorStats
);

// Search colors
router.get(
  '/search',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.ANGGOTA
  ),
  ColorController.searchColors
);

// Get color by code
router.get(
  '/code/:code',
  validate(colorSchemas.getByCode),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.ANGGOTA
  ),
  ColorController.getColorByCode
);

// Individual color routes
router.get(
  '/:id',
  validate(colorSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.STAFF_INVENTORY,
    RoleEnum.STAFF_WAREHOUSE,
    RoleEnum.ANGGOTA
  ),
  ColorController.getColorById
);

router.put(
  '/:id',
  validate(colorSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  ColorController.updateColor
);

router.delete(
  '/:id',
  validate(colorSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  ColorController.deleteColor
);

export default router;
