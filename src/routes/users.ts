/**
 * User Routes
 * Defines all user management endpoints
 */

import { Router } from 'express';
import { UserController } from '~/controllers/userController';
import {
  authenticate,
  requireAdmin,
  requireOwnershipOrAdmin,
  requireStaffManager,
} from '~/middleware/auth';
import { userSchemas, validate } from '~/utils/validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes (accessible by the user themselves)
router.get('/profile', UserController.getProfile);

router.put('/profile', validate(userSchemas.updateProfile), UserController.updateProfile);

// User management routes (admin only)
router.post(
  '/',
  requireStaffManager, // Only staff managers and above can create users
  validate(userSchemas.create),
  UserController.createUser
);

router.get(
  '/',
  requireStaffManager, // Only staff managers and above can list all users
  validate(userSchemas.list),
  UserController.getUsers
);

router.get(
  '/stats',
  requireAdmin, // Only admins can see user statistics
  UserController.getUserStats
);

router.get(
  '/search',
  requireStaffManager, // Only staff managers and above can search users
  UserController.searchUsers
);

router.get(
  '/role/:role',
  requireStaffManager, // Only staff managers and above can get users by role
  UserController.getUsersByRole
);

// Individual user routes
router.get(
  '/:id',
  validate(userSchemas.getById),
  requireOwnershipOrAdmin('id'), // Users can see their own profile, admins can see any
  UserController.getUserById
);

router.put(
  '/:id',
  validate(userSchemas.update),
  requireOwnershipOrAdmin('id'), // Users can update their own profile, admins can update any
  UserController.updateUser
);

router.delete(
  '/:id',
  validate(userSchemas.delete),
  requireAdmin, // Only admins can delete users
  UserController.deleteUser
);

export default router;
