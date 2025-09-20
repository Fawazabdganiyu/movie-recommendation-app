import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IPasswordValidation } from '../../types';

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validateStrength(password: string): IPasswordValidation {
    const errors: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 20;
    else errors.push('Password must be at least 8 characters');

    if (/(?=.*[a-z])/.test(password)) score += 20;
    else errors.push('Must contain lowercase letter');

    if (/(?=.*[A-Z])/.test(password)) score += 20;
    else errors.push('Must contain uppercase letter');

    if (/(?=.*\d)/.test(password)) score += 20;
    else errors.push('Must contain number');

    if (/(?=.*[!@#$%^&*])/.test(password)) score += 20;
    else errors.push('Must contain special character');

    return { isValid: errors.length === 0, errors, score };
  }

  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static setResetTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15); // 15 minutes expiry
    return expiry;
  }
}
