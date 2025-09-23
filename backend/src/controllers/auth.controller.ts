import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/response.util';
import { Types } from 'mongoose';
import { AuthService } from '../services/auth.service';
import { User } from '../types';

export class AuthController {
  private static instance: AuthController;
  private constructor(private authService: AuthService) {
    this.authService = authService;
  }

  static getInstance(authService: AuthService): AuthController {
    if (!AuthController.instance)
      AuthController.instance = new AuthController(authService);
    return AuthController.instance;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body is now validated and transformed by Zod middleware
      await this.authService.register(req.body);

      return success(
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
      const result = await this.authService.login(email, password);

      return success(res, 'Login successful', result);
    } catch (e) {
      next(e);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body is now validated by Zod middleware
      const { refreshToken } = req.body;
      const user = req.user as User;
      const accessToken = await this.authService.getRefreshToken(user);
      const data = { user, tokens: { accessToken, refreshToken } };

      return success(res, 'Token refreshed successfully', data);
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.user!._id as Types.ObjectId);

      return success(res, 'Logout successful');
    } catch (e) {
      next(e);
    }
  };
}
