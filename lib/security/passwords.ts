import crypto from 'crypto';

// In-memory credential and OTP store
interface UserCredential {
  email: string;
  hash: string;
  salt: string;
}

interface OTPRecord {
  code: string;
  expiresAt: number;
}

interface ResetTokenRecord {
  token: string;
  expiresAt: number;
}

// Secret salt pepper
const PEPPER = process.env.AUTH_PEPPER || 'budget_dekoo_healthcare_salt_pepper_my_2026';

// Global stores
const credentialStore = new Map<string, UserCredential>();
const otpStore = new Map<string, OTPRecord>();
const resetTokenStore = new Map<string, ResetTokenRecord>();

/**
 * Hash a password using PBKDF2 (10,000 iterations, SHA-256)
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password + PEPPER, salt, 10000, 64, 'sha256')
    .toString('hex');
  return { hash, salt };
}

/**
 * Verify a plaintext password against stored hash & salt
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  const { hash } = hashPassword(password, storedSalt);
  const hashBuf = Buffer.from(hash, 'utf-8');
  const storedBuf = Buffer.from(storedHash, 'utf-8');
  if (hashBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, storedBuf);
}

/**
 * Initialize default password for seed users: 'password123'
 */
const DEFAULT_SEED_PASSWORD = 'password123';
const defaultHash = hashPassword(DEFAULT_SEED_PASSWORD, 'default_malaysia_salt_123');

// Pre-populate seed credentials
const SEED_EMAILS = [
  'admin@budgetdekoo.my',
  'admin@damaicare.com.my',
  'ops@silvercarepenang.com',
  'siti.nurhaliza@gmail.com',
  'priya.raman@gmail.com',
  'tan.weijian@gmail.com',
  'ahmad.faizal@gmail.com',
];

SEED_EMAILS.forEach((email) => {
  credentialStore.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    hash: defaultHash.hash,
    salt: defaultHash.salt,
  });
});

/**
 * Store user password
 */
export function saveUserPassword(email: string, password: string): void {
  const { hash, salt } = hashPassword(password);
  credentialStore.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    hash,
    salt,
  });
}

/**
 * Check if provided password is valid for an email
 */
export function checkUserPassword(email: string, password: string): boolean {
  const cred = credentialStore.get(email.toLowerCase());
  if (!cred) {
    // If not found in store, verify against default seed password for backward demo compatibility
    return password === 'password123';
  }
  return verifyPassword(password, cred.hash, cred.salt);
}

/**
 * Generate a 6-digit One-Time Password (OTP) for passwordless magic login
 * Valid for 5 minutes
 */
export function generateLoginOTP(email: string): string {
  // Generate cryptographically random 6-digit number (100000 - 999999)
  const code = (crypto.randomInt(100000, 999999)).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore.set(email.toLowerCase(), { code, expiresAt });
  return code;
}

/**
 * Verify a 6-digit OTP
 */
export function verifyLoginOTP(email: string, code: string): { valid: boolean; error?: string } {
  const record = otpStore.get(email.toLowerCase());
  if (!record) {
    return { valid: false, error: 'No active verification code found. Please request a new one.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, error: 'Verification code has expired (5-minute limit). Please request a fresh code.' };
  }

  if (record.code !== code.trim()) {
    return { valid: false, error: 'Incorrect 6-digit verification code.' };
  }

  // Consume OTP (single use)
  otpStore.delete(email.toLowerCase());
  return { valid: true };
}

/**
 * Generate a secure password reset token (valid for 15 minutes)
 */
export function generatePasswordResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  resetTokenStore.set(email.toLowerCase(), { token, expiresAt });
  return token;
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(email: string, token: string): boolean {
  const record = resetTokenStore.get(email.toLowerCase());
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    resetTokenStore.delete(email.toLowerCase());
    return false;
  }
  return record.token === token;
}

/**
 * Consume reset token and update password
 */
export function consumeResetTokenAndUpdatePassword(email: string, token: string, newPassword: string): boolean {
  if (!verifyPasswordResetToken(email, token)) {
    return false;
  }

  saveUserPassword(email, newPassword);
  resetTokenStore.delete(email.toLowerCase());
  return true;
}

