import mongoose, { Schema } from 'mongoose';
import { IUserModel, UserDocument } from '../types';
import { PasswordUtils } from '../utils/password/password.util';
import { User } from '@shared/types';

// User schema
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },

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

    preferences: {
      genres: {
        type: [String],
        default: [],
      },
      languages: {
        type: [String],
        default: ['en'],
      },
      minRating: {
        type: Number,
        default: 0,
        min: [0, 'Minimum rating cannot be less than 0'],
        max: [10, 'Minimum rating cannot exceed 10'],
      },
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
// userSchema.index({ 'ratings.movieId': 1 });
// userSchema.index({ favorites: 1 });
// userSchema.index({ watchlist: 1 });

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
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    avatar: this.avatar,
    preferences: this.preferences,
    createdAt: this.createdAt,
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
