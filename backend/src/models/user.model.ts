import mongoose, { Schema } from 'mongoose';
import { IUserModel, UserDocument } from '../types';
import { PasswordUtils } from '../utils/password/password.util';
import { User } from '@shared/types';

// User schema
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },

    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    avatar: {
      type: String,
      default: null,
    },

    // User preferences - stored as separate fields to match API structure
    favoriteGenres: {
      type: [Number], // TMDB genre IDs
      default: [],
    },

    favoriteActors: {
      type: [Number], // TMDB actor IDs
      default: [],
    },

    favoriteDirectors: {
      type: [Number], // TMDB director IDs
      default: [],
    },

    minRating: {
      type: Number,
      default: 0,
      min: [0, 'Minimum rating cannot be less than 0'],
      max: [10, 'Minimum rating cannot exceed 10'],
    },

    languages: {
      type: [String], // ISO language codes
      default: ['en'],
    },

    favorites: [
      {
        type: Number, // TMDB movie IDs are numbers
        ref: 'Movie',
      },
    ],

    watchlist: [
      {
        type: Number, // TMDB movie IDs are numbers
        ref: 'Movie',
      },
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        // Remove sensitive fields from JSON output
        const {
          password,
          passwordResetToken,
          passwordResetExpires,
          emailVerificationToken,
          ...safeRet
        } = ret;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
userSchema.index({ favorites: 1 });
userSchema.index({ watchlist: 1 });
userSchema.index({ favoriteGenres: 1 });
userSchema.index({ favoriteActors: 1 });
userSchema.index({ favoriteDirectors: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function (this: User) {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || '';
});

// Pre-save middleware to hash password
userSchema.pre<User>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!(this as any).isModified('password')) return next();

  try {
    this.password = await PasswordUtils.hash(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return PasswordUtils.compare(candidatePassword, this.password);
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = PasswordUtils.generateResetToken();

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = PasswordUtils.setResetTokenExpiry();

  return resetToken;
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function (): Partial<User> {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    avatar: this.avatar,
    favoriteGenres: this.favoriteGenres,
    favoriteActors: this.favoriteActors,
    favoriteDirectors: this.favoriteDirectors,
    minRating: this.minRating,
    languages: this.languages,
    createdAt: this.createdAt,
  };
};

// Instance method to get preferences in API format
userSchema.methods.getPreferences = function () {
  return {
    _id: this._id,
    userId: this._id,
    favoriteGenres: this.favoriteGenres || [],
    favoriteActors: this.favoriteActors || [],
    favoriteDirectors: this.favoriteDirectors || [],
    minRating: this.minRating || 0,
    languages: this.languages || ['en'],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function (
  email: string,
  password: string
): Promise<User | null> {
  const user = await this.findOne({ email, isActive: true }).select(
    '+password'
  );

  if (!user || !(await user.comparePassword(password))) {
    return null;
  }

  return user;
};

export const UserModel = mongoose.model<UserDocument, IUserModel>(
  'User',
  userSchema
);
