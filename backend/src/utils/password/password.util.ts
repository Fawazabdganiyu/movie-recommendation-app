import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hash);
    return hash;
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    console.log('Comparing password:', password, hash);
    return bcrypt.compare(password, hash);
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
