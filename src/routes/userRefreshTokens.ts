/**
 * UserRefreshToken Routes
 * Handles all user refresh token-related API endpoints
 */

import { RoleEnum } from '@prisma/client';
import { Router } from 'express';
import { UserRefreshTokenController } from '~/controllers/userRefreshTokenController';
import { authenticate, authorize } from '~/middleware/auth';
import { userRefreshTokenSchemas, validate } from '~/utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all user refresh tokens with pagination (admin only)
router.get(
  '/',
  authorize(RoleEnum.SUPER_ADMIN),
  validate(userRefreshTokenSchemas.list),
  UserRefreshTokenController.getUserRefreshTokens
);

// Get user refresh token statistics (admin only)
router.get(
  '/stats',
  authorize(RoleEnum.SUPER_ADMIN),
  UserRefreshTokenController.getUserRefreshTokenStats
);

// Cleanup routes (admin only)
router.delete(
  '/cleanup/revoked',
  authorize(RoleEnum.SUPER_ADMIN),
  UserRefreshTokenController.deleteRevokedTokens
);

router.delete(
  '/cleanup/expired',
  authorize(RoleEnum.SUPER_ADMIN),
  UserRefreshTokenController.deleteExpiredTokens
);

// Get user refresh tokens by user ID
router.get(
  '/user/:userId',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  UserRefreshTokenController.getUserRefreshTokensByUserId
);

// Revoke all tokens for a user
router.put(
  '/user/:userId/revoke-all',
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  UserRefreshTokenController.revokeAllUserRefreshTokens
);

// Individual token routes
router.get(
  '/:id',
  validate(userRefreshTokenSchemas.getById),
  authorize(RoleEnum.SUPER_ADMIN),
  UserRefreshTokenController.getUserRefreshTokenById
);

router.put(
  '/:id/revoke',
  validate(userRefreshTokenSchemas.revoke),
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.OWNER, RoleEnum.PIMPINAN),
  UserRefreshTokenController.revokeUserRefreshToken
);

router.delete(
  '/:id',
  validate(userRefreshTokenSchemas.delete),
  authorize(RoleEnum.SUPER_ADMIN),
  UserRefreshTokenController.deleteUserRefreshToken
);

export default router;
