import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { Types } from 'mongoose';
import { success } from '../utils/response.util';

export class UserController {
  private static instance: UserController;
  private constructor(private userService: UserService) {
    this.userService = userService;
  }

  static getInstance(userService: UserService): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController(userService);
    }
    return UserController.instance;
  }

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as Types.ObjectId;
      const user = await this.userService.getById(userId);

      success(res, 'Profile retrieved successfully', user);
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as Types.ObjectId;
      const updatedUser = await this.userService.update(userId, req.body);

      success(res, 'Profile updated successfully', updatedUser);
    } catch (err) {
      next(err);
    }
  };
}
