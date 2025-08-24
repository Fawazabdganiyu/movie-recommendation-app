import { Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { IUser, IUserRating } from '../interfaces';
import { NotFoundError } from '../errors/api.error';

export class UserService {
  private static instance: UserService;

  private constructor(private userRepository: UserRepository) {}

  public static getInstance(userRepository: UserRepository): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(userRepository);
    }
    return UserService.instance;
  }

  async create(
    userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<IUser> {
    const user = await this.userRepository.create(userData);

    return user;
  }

  async getByCredentials(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findByCredentials(email, password);
    if (!user) {
      throw new NotFoundError('User not found or invalid credentials');
    }

    return user;
  }

  async getById(userId: Types.ObjectId): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    return user;
  }

  async getByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError(`User with email ${email} not found`);

    return user;
  }

  async getFullName(userId: Types.ObjectId): Promise<string> {
    const user = await this.getById(userId);

    if (user.firstName && user.lastName) {
      return user.fullName;
    }
    return user.firstName || user.lastName || user.username;
  }

  async getPublicProfile(userId: Types.ObjectId): Promise<Partial<IUser>> {
    const user = await this.getById(userId);

    return {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      fullName: user.fullName,
      avatar: user.avatar,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };
  }

  async update(
    userId: Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return updatedUser;
  }

  async addToFavorites(userId: Types.ObjectId, movieId: number): Promise<void> {
    const user = await this.getById(userId);
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
    }
  }

  async removeFromFavorites(
    userId: Types.ObjectId,
    movieId: number
  ): Promise<void> {
    const user = await this.getById(userId);
    if (user.favorites.includes(movieId)) {
      user.favorites = user.favorites.filter((id) => id !== movieId);
    }
  }

  async addRating(
    userId: Types.ObjectId,
    movieId: number,
    rating: number,
    review?: string
  ): Promise<void> {
    const user = await this.getById(userId);
    const existingRatingIndex = user.ratings.findIndex(
      (r) => r.movieId === movieId
    );

    const newRating: IUserRating = {
      movieId,
      rating,
      review,
      createdAt: new Date(),
    };

    if (existingRatingIndex >= 0) {
      user.ratings[existingRatingIndex] = newRating;
    } else {
      user.ratings.push(newRating);
    }
  }
  async updateRating(
    userId: Types.ObjectId,
    movieId: number,
    rating: number,
    review?: string
  ): Promise<void> {
    const user = await this.getById(userId);
    const existingRatingIndex = user.ratings.findIndex(
      (r) => r.movieId === movieId
    );

    const newRating: IUserRating = {
      movieId,
      rating,
      review,
      createdAt: new Date(),
    };

    if (existingRatingIndex >= 0) {
      user.ratings[existingRatingIndex] = newRating;
    } else {
      user.ratings.push(newRating);
    }
  }
}
