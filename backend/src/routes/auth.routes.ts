import { Router } from 'express';
import {
  optionalAuth,
  requireAuth,
  requireOwnership,
  validateRefreshToken,
} from '../middleware';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', authController.register);

router.post('/login', authController.login);

// Refresh token route
router.post('/refresh', validateRefreshToken, authController.refresh);

// Protected routes
router.post('/logout', requireAuth, authController.logout);

router.get('/profile', requireAuth, authController.profile);

// Route with optional authentication
router.get('/movies/popular', optionalAuth, authController.popularMovies);

// Route requiring ownership
router.put(
  '/users/:userId/profile',
  requireAuth,
  requireOwnership('userId'),
  authController.updateProfile
);

export default router;
