import { Types } from 'mongoose';
import { IUser, IUserModel } from '../interfaces';

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
    userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<IUser> {
    const user = new this.userModel({
      ...userData,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email, isActive: true });
  }

  async findById(userId: Types.ObjectId): Promise<IUser | null> {
    return this.userModel.findById(userId);
  }

  async findByCredentials(
    email: string,
    password: string
  ): Promise<IUser | null> {
    return await this.userModel.findByCredentials(email, password);
  }

  async update(
    userId: Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }
}
