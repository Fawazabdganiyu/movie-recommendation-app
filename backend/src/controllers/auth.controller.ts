import { Request, Response, NextFunction } from 'express';
import { getAuthService } from '../container';
import { success } from '../utils/response.util';

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
      const result = await getAuthService().register(req.body);
      success(res, 'User registered successfully', result, 201);
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await getAuthService().login(email, password);
      success(res, 'Login successful', result);
    } catch (e) {
      next(e);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await getAuthService().getRefreshToken(refreshToken);
      success(res, 'Token refreshed successfully', result);
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAuthService().logout(req.user!._id);
      success(res, 'Logout successful');
    } catch (e) {
      next(e);
    }
  };

  profile = async (_req: Request, res: Response) => {
    // Extend to map user public profile when implemented
    return success(res, 'Profile fetched', {
      // user: req.user!.getPublicProfile(),
    });
  };

  popularMovies = async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    return success(res, 'Popular movies fetched', {
      movies: [],
      personalized: !!userId,
    });
  };

  updateProfile = async (_req: Request, res: Response) => {
    // Placeholder; implement update logic using user service
    return success(res, 'Profile updated successfully');
  };
}

export const authController = AuthController.getInstance();
