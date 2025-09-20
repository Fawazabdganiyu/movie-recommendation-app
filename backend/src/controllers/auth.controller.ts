import { Request, Response, NextFunction } from 'express';
import { getAuthService } from '../container';
import { success } from '../utils/response.util';
import { User } from '@shared/types';
import { Types } from 'mongoose';

export class AuthController {
  private static instance: AuthController;
  private constructor() {}
  static getInstance(): AuthController {
    if (!AuthController.instance)
      AuthController.instance = new AuthController();
    return AuthController.instance;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body is now validated and transformed by Zod middleware
      await getAuthService().register(req.body);
      success(
        res,
        'User registered successfully - Please check your email for verification',
        '',
        201
      );
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body is now validated by Zod middleware
      const { email, password } = req.body;
      const result = await getAuthService().login(email, password);
      success(res, 'Login successful', result);
    } catch (e) {
      next(e);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body is now validated by Zod middleware
      const { refreshToken } = req.body;
      const user = req.user as User;
      const accessToken = await getAuthService().getRefreshToken(user);
      const data = { user, tokens: { accessToken, refreshToken } };

      success(res, 'Token refreshed successfully', data);
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAuthService().logout(req.user!._id as Types.ObjectId);
      success(res, 'Logout successful');
    } catch (e) {
      next(e);
    }
  };
}

export const authController = AuthController.getInstance();
