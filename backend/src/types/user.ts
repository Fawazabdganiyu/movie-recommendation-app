import { User } from '@shared/types';
import { Model } from 'mongoose';

// Document interface (instance methods)
export interface UserDocument extends User, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  getPublicProfile(): Partial<User>;
  getPreferences(): {
    _id: string;
    userId: string;
    favoriteGenres: number[];
    favoriteActors?: number[];
    favoriteDirectors?: number[];
    minRating?: number;
    languages?: string[];
    createdAt: string;
    updatedAt: string;
  };
}

// Model interface (static methods)
export interface IUserModel extends Model<UserDocument> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}
