/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

import { Router } from 'express';
import { AuthController } from '~/controllers/authController';
import { authenticate } from '~/middleware/auth';
import { authSchemas, validate } from '~/utils/validation';

const router = Router();

// Public routes (no authentication required)
router.post('/register', validate(authSchemas.register), AuthController.register);

router.post('/login', validate(authSchemas.login), AuthController.login);

router.post('/refresh', validate(authSchemas.refreshToken), AuthController.refreshToken);

// Protected routes (authentication required)
router.post('/logout', authenticate, AuthController.logout);

router.post('/change-password', authenticate, AuthController.changePassword);

router.get('/me', authenticate, AuthController.getCurrentUser);

router.post('/revoke-all', authenticate, AuthController.revokeAllTokens);

router.get('/validate', authenticate, AuthController.validateToken);

export default router;
