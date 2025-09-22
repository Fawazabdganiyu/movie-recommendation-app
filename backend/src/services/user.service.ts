import { Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@shared/types';
import { UserDocument } from '../types/user';
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
    userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    const user = await this.userRepository.create(userData);

    return user;
  }

  async getByCredentials(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByCredentials(email, password);
    if (!user) {
      throw new NotFoundError('User not found or invalid credentials');
    }

    return user;
  }

  async getById(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

    return user as UserDocument;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError(`User with email ${email} not found`);

    return user;
  }

  async getFullName(userId: Types.ObjectId): Promise<string> {
    const user = await this.getById(userId);

    if (user.firstName && user.lastName) {
      return user.fullName;
    }
    return user.firstName || user.lastName;
  }

  async getPublicProfile(userId: Types.ObjectId): Promise<Partial<User>> {
    const user = await this.getById(userId);

    return {
      _id: user._id,
      firstName: user.firstName,
      fullName: user.fullName,
      avatar: user.avatar,
      favoriteGenres: user.favoriteGenres,
      favoriteActors: user.favoriteActors,
      favoriteDirectors: user.favoriteDirectors,
      minRating: user.minRating,
      languages: user.languages,
      createdAt: user.createdAt,
    };
  }

  async update(
    userId: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<UserDocument> {
    // Remove sensitive fields from update data
    if (updateData.email) delete updateData.email;
    if (updateData.password) delete updateData.password;

    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    return updatedUser as UserDocument;
  }

  /**
   * Add a movie to user's favorites.
   */
  async addFavoriteMovie(
    userId: Types.ObjectId,
    movieId: number
  ): Promise<User | null> {
    const updatedUser = await this.userRepository.addFavoriteMovie(
      userId,
      movieId
    );
    if (!updatedUser)
      throw new NotFoundError(`User with ID ${userId} not found`);

    return updatedUser;
  }

  /**
   * Remove a movie from user's favorites.
   */
  async removeFavoriteMovie(
    userId: Types.ObjectId,
    movieId: number
  ): Promise<User | null> {
    const updatedUser = await this.userRepository.removeFavoriteMovie(
      userId,
      movieId
    );
    if (!updatedUser)
      throw new NotFoundError(`User with ID ${userId} not found`);

    return updatedUser;
  }
}
