import { Router } from 'express';
import { authService } from '../services';
import {
  optionalAuth,
  requireAuth,
  requireOwnership,
  validateRefreshToken,
} from '../middleware';

const router = Router();

// Public routes
router.post('/register', async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token route
router.post('/refresh', validateRefreshToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.getRefreshToken(refreshToken);
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    await authService.logout(req.user!._id);
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', requireAuth, (_req, res) => {
  res.json({
    success: true,
    data: {
      // user: req.user!.getPublicProfile(),
    },
  });
});

// Route with optional authentication
router.get('/movies/popular', optionalAuth, (req, res) => {
  const userId = req.user?._id.toString();
  // Get popular movies, personalized if user is authenticated
  res.json({
    success: true,
    data: {
      movies: [], // Your movie data
      personalized: !!userId,
    },
  });
});

// Route requiring ownership
router.put(
  '/users/:userId/profile',
  requireAuth,
  requireOwnership('userId'),
  (_req, res) => {
    // Only the user themselves can update their profile
    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  }
);

export default router;
