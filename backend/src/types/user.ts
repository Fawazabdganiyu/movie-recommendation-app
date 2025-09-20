import { User } from '@shared/types';
import { Model } from 'mongoose';

// Document interface (instance methods)
export interface UserDocument extends User, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  getPublicProfile(): Partial<User>;
}

// Model interface (static methods)
export interface IUserModel extends Model<UserDocument> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}
