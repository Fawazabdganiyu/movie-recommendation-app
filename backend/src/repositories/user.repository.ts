import { Types } from 'mongoose';
import { IUserModel } from '../types';
import { User } from '@shared/types';

export class UserRepository {
  private static instance: UserRepository;

  private constructor(private userModel: IUserModel) {}

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
}
