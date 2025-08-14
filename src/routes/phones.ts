/**
 * Phone Routes
 * Handles all phone-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { PhoneController } from '~/controllers/phoneController';
import { authenticate, authorize } from '~/middleware/auth';
import { phoneSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Create phone
router.post(
  '/',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  validate(phoneSchemas.create),
  PhoneController.createPhone
);

// Get all phones with pagination
router.get(
  '/',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  validate(phoneSchemas.list),
  PhoneController.getPhones
);

// Get phone statistics
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  PhoneController.getPhoneStats
);



// Get phone by phone number
router.get(
  '/number/:phone',
  validate(phoneSchemas.getByPhone),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  PhoneController.getPhoneByNumber
);

// Get phones by owner code
router.get(
  '/owner/:ownerCode',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  PhoneController.getPhonesByOwnerCode
);

// Get phones by module
router.get(
  '/module/:module',
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  PhoneController.getPhonesByModule
);

// Individual phone routes
router.get(
  '/:id',
  validate(phoneSchemas.getById),
  authorize(
    RoleEnum.SUPER_ADMIN,
    RoleEnum.OWNER,
    RoleEnum.PIMPINAN,
    RoleEnum.HEAD_KANTOR,
    RoleEnum.STAFF_KANTOR,
    RoleEnum.ANGGOTA
  ),
  PhoneController.getPhoneById
);

router.put(
  '/:id',
  validate(phoneSchemas.update),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN, RoleEnum.HEAD_KANTOR),
  PhoneController.updatePhone
);

router.delete(
  '/:id',
  validate(phoneSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  PhoneController.deletePhone
);

export default router;
