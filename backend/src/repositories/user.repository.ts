import { Types } from 'mongoose';
import { IUserModel } from '../types';
import { User } from '@shared/types';

export class UserRepository {
  private static instance: UserRepository;

  private constructor(private userModel: IUserModel) {
    this.userModel = userModel;
  }

  public static getInstance(userModel: IUserModel): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(userModel);
    }
    return UserRepository.instance;
  }

  async create(
    userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    const user = new this.userModel({
      ...userData,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isActive: true });
  }

  async findById(userId: Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async findByCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    return await this.userModel.findByCredentials(email, password);
  }

  async update(
    userId: Types.ObjectId,
    updateData: Partial<User>
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  /**
   * Add a movie to user's favorites.
   */
  async addFavoriteMovie(
    userId: Types.ObjectId,
    movieId: number
  ): Promise<User | null> {
    // Use $addToSet to avoid duplicates
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true }
    );
    return updatedUser;
  }

  /**
   * Remove a movie from user's favorites.
   */
  async removeFavoriteMovie(
    userId: Types.ObjectId,
    movieId: number
  ): Promise<User | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } },
      { new: true }
    );
    return updatedUser;
  }
}
