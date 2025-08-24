import { Router } from 'express';
import { requireAuth, validateRefreshToken } from '../middleware';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', authController.register);

router.post('/login', authController.login);

// Refresh token route
router.post('/refresh', validateRefreshToken, authController.refresh);

// Protected routes
router.post('/logout', requireAuth, authController.logout);

export default router;
