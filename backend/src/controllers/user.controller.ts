import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { Types } from 'mongoose';
import { success } from '../utils/response.util';
import { NotFoundError } from '../errors/api.error';
import { UserDocument } from '../types/user';

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

  getPreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as Types.ObjectId;
      const user = (await this.userService.getById(userId)) as UserDocument;
      if (!user) throw new NotFoundError('User not found');

      const preferences = user.getPreferences();
      success(res, 'User preferences fetched successfully', preferences);
    } catch (err) {
      next(err);
    }
  };

  updatePreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?._id as Types.ObjectId;
      const {
        favoriteGenres,
        favoriteActors,
        favoriteDirectors,
        minRating,
        languages,
      } = req.body;

      // Prepare update data
      const updateData: any = {};
      if (favoriteGenres !== undefined)
        updateData.favoriteGenres = favoriteGenres;
      if (favoriteActors !== undefined)
        updateData.favoriteActors = favoriteActors;
      if (favoriteDirectors !== undefined)
        updateData.favoriteDirectors = favoriteDirectors;
      if (minRating !== undefined) updateData.minRating = minRating;
      if (languages !== undefined) updateData.languages = languages;

      const updatedUser = (await this.userService.update(
        userId,
        updateData
      )) as UserDocument;
      if (!updatedUser) throw new NotFoundError('User not found');

      const preferences = updatedUser.getPreferences();
      success(res, 'User preferences updated successfully', preferences);
    } catch (err) {
      next(err);
    }
  };

  addFavoriteMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { movieId } = req.params;
      const userId = req.user?._id as Types.ObjectId;

      const updatedUser = await this.userService.addFavoriteMovie(
        userId,
        Number(movieId)
      );
      if (!updatedUser) throw new NotFoundError('User not found');
      return success(res, 'Movie added to favorites', updatedUser.favorites);
    } catch (error) {
      next(error);
    }
  };

  removeFavoriteMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { movieId } = req.params;
      const userId = req.user?._id as Types.ObjectId;

      const updatedUser = await this.userService.removeFavoriteMovie(
        userId,
        Number(movieId)
      );
      if (!updatedUser) throw new NotFoundError('User not found');

      return success(
        res,
        'Movie removed from favorites',
        updatedUser.favorites
      );
    } catch (error) {
      next(error);
    }
  };

  getFavoriteMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?._id as Types.ObjectId;

      const user = await this.userService.getById(userId);
      if (!user) throw new NotFoundError('User not found');

      return success(res, 'Favorite movies fetched', user.favorites);
    } catch (error) {
      next(error);
    }
  };
}
