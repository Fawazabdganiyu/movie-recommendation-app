import { Router } from 'express';
import { requireAuth } from '../middleware';
import { UserController } from '../controllers/user.controller';
import { getUserService } from '../container';

const router = Router();
const userController = UserController.getInstance(getUserService());

router.get('/profile', requireAuth, userController.getProfile);
router.patch('/profile', requireAuth, userController.updateProfile);

export default router;
