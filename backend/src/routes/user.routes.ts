import { Router } from 'express';
import { requireAuth, validateParams } from '../middleware';
import { UserController } from '../controllers/user.controller';
import { getUserService } from '../container';
import { movieIdParamSchema, userIdParamSchema } from '../validation';

const router = Router();
const userController = UserController.getInstance(getUserService());

router.get('/profile', requireAuth, userController.getProfile);
router.patch('/profile', requireAuth, userController.updateProfile);

router.post(
  '/:userId/favorites/:movieId',
  validateParams(userIdParamSchema.extend(movieIdParamSchema.shape)),
  userController.addFavoriteMovie
);

router.delete(
  '/:userId/favorites/:movieId',
  requireAuth,
  validateParams(userIdParamSchema.extend(movieIdParamSchema.shape)),
  userController.removeFavoriteMovie
);

router.get(
  '/:userId/favorites',
  requireAuth,
  validateParams(userIdParamSchema),
  userController.getFavoriteMovies
);

export default router;
