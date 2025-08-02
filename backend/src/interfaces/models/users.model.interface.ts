import { Model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  fullName: string; // Virtual property
  avatar?: string;
  preferences: IUserPreferences;
  favorites: number[];
  watchlist: number[];
  ratings: IUserRating[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPreferences {
  genres: string[];
  languages: string[];
  minRating: number;
}

export interface IUserRating {
  movieId: number;
  rating: number;
  review?: string;
  createdAt: Date;
}

// Document interface (instance methods)
export interface UserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  getPublicProfile(): Partial<IUser>;
}

// Model interface (static methods)
export interface IUserModel extends Model<UserDocument> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}
