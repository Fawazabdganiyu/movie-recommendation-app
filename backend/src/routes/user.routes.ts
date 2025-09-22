import { Router } from 'express';
import { requireAuth, validateParams } from '../middleware';
import { UserController } from '../controllers/user.controller';
import { getUserService } from '../container';
import { movieIdParamSchema } from '../validation';

const router = Router();
const userController = UserController.getInstance(getUserService());

router.get('/profile', requireAuth, userController.getProfile);
router.patch('/profile', requireAuth, userController.updateProfile);

router.get('/preferences', requireAuth, userController.getPreferences);
router.put('/preferences', requireAuth, userController.updatePreferences);

router.post(
  '/favorites/:movieId',
  requireAuth,
  validateParams(movieIdParamSchema),
  userController.addFavoriteMovie
);

router.delete(
  '/favorites/:movieId',
  requireAuth,
  requireAuth,
  validateParams(movieIdParamSchema),
  userController.removeFavoriteMovie
);

router.get('/favorites', requireAuth, userController.getFavoriteMovies);

export default router;
