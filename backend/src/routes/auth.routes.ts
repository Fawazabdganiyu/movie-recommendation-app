import { Router } from 'express';
import { requireAuth, validateRefreshToken } from '../middleware';
import { authController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/zod-validation.middleware';
import { loginSchema, registerSchema, refreshTokenSchema } from '@shared/types';

const router = Router();

/**
 * Authentication Routes with Zod Validation
 *
 * Each route now uses appropriate Zod validation middleware
 * instead of manual validation in controllers
 */

// POST /auth/register - Register new user
router.post(
  '/register',
  validateBody(registerSchema), // Validates: name, email, password with proper constraints
  authController.register
);

// POST /auth/login - User login
router.post(
  '/login',
  validateBody(loginSchema), // Validates: email, password with proper formatting
  authController.login
);

// POST /auth/refresh - Refresh access token
router.post(
  '/refresh',
  validateBody(refreshTokenSchema), // Validates: refreshToken is present
  validateRefreshToken, // Verify the refresh token
  authController.refresh
);

// POST /auth/logout - User logout
router.post(
  '/logout',
  requireAuth, // Requires valid access token
  authController.logout
);

export default router;
