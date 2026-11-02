import {
  hashPassword,
  verifyPassword,
  saveUserPassword,
  checkUserPassword,
  generateLoginOTP,
  verifyLoginOTP,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  consumeResetTokenAndUpdatePassword,
} from '../lib/security/passwords';

import {
  createSignedSessionToken,
  verifySignedSessionToken
} from '../lib/security/session';

import { checkRateLimit } from '../lib/security/rate-limiter';

async function runAuthTests() {
  console.log('====================================================');
  console.log('BUDGET DEKOO — CLINICAL-GRADE AUTH SUITE VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Password Hashing (PBKDF2 + Salt + Pepper)
  console.log('--- 1. Cryptographic Password Hashing (PBKDF2) ---');
  const rawSecret = 'SecureKualaLumpur#2026!';
  const { hash, salt } = hashPassword(rawSecret);
  assert(typeof hash === 'string' && hash.length === 128, 'Hash is a 512-bit SHA-256 derived hex string (128 chars)');
  assert(typeof salt === 'string' && salt.length === 32, 'Salt is a 16-byte random hex string (32 chars)');

  const correctMatch = verifyPassword(rawSecret, hash, salt);
  assert(correctMatch === true, 'Correct password verifies successfully against PBKDF2 hash + salt');

  const incorrectMatch = verifyPassword('WrongPassword123!', hash, salt);
  assert(incorrectMatch === false, 'Incorrect password correctly rejected by timing-safe comparator');

  // Pre-seeded accounts verification via checkUserPassword
  const adminMatch = checkUserPassword('admin@budgetdekoo.my', 'password123');
  assert(adminMatch === true, 'Admin default password ("password123") verifies against seeded PBKDF2 hash');

  const agencyMatch = checkUserPassword('admin@damaicare.com.my', 'password123');
  assert(agencyMatch === true, 'SSM Agency default password verifies against seeded PBKDF2 hash');

  const caregiverMatch = checkUserPassword('siti.nurhaliza@gmail.com', 'password123');
  assert(caregiverMatch === true, 'Caregiver default password verifies against seeded PBKDF2 hash');

  // 2. Dual-Mode 6-Digit Magic Passcode (OTP)
  console.log('\n--- 2. Dual-Mode 6-Digit OTP Lifecycle ---');
  const otpEmail = 'caregiver.test@budgetdekoo.my';
  const generatedOTP = generateLoginOTP(otpEmail);
  assert(/^\d{6}$/.test(generatedOTP), `Generated OTP is a 6-digit numeric code: ${generatedOTP}`);

  const wrongOtpResult = verifyLoginOTP(otpEmail, '000000');
  assert(wrongOtpResult.valid === false, 'Wrong OTP PIN correctly rejected');

  const validOtpResult = verifyLoginOTP(otpEmail, generatedOTP);
  assert(validOtpResult.valid === true, 'Valid OTP PIN successfully verified');

  const replayOtpResult = verifyLoginOTP(otpEmail, generatedOTP);
  assert(replayOtpResult.valid === false, 'Single-use OTP cannot be replayed (consumed immediately)');

  // 3. Password Reset Workflow (32-byte Cryptographic Token)
  console.log('\n--- 3. Password Recovery Token & Reset Flow ---');
  const resetEmail = 'siti.nurhaliza@gmail.com';
  const resetToken = generatePasswordResetToken(resetEmail);
  assert(typeof resetToken === 'string' && resetToken.length === 64, 'Generated 32-byte hex reset token (64 hex chars)');

  const isTokenValid = verifyPasswordResetToken(resetEmail, resetToken);
  assert(isTokenValid === true, 'Token successfully resolves and validates for registered email');

  const isWrongEmailValid = verifyPasswordResetToken('other@user.com', resetToken);
  assert(isWrongEmailValid === false, 'Token rejected for non-matching email address');

  const newPassword = 'NewSecretPassword2026@!';
  const updated = consumeResetTokenAndUpdatePassword(resetEmail, resetToken, newPassword);
  assert(updated === true, 'Password update successfully committed and token consumed');

  const reVerify = verifyPasswordResetToken(resetEmail, resetToken);
  assert(reVerify === false, 'Consumed reset token is invalidated immediately');

  const verifyNew = checkUserPassword(resetEmail, newPassword);
  assert(verifyNew === true, 'New password successfully authenticates user');

  // Restore original password for ongoing test suite consistency
  saveUserPassword(resetEmail, 'password123');

  // 4. HMAC-SHA256 Signed Session Token Tamper-Resistance
  console.log('\n--- 4. Session Security & Tamper Detection ---');
  const validPayload = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'siti.nurhaliza@gmail.com',
    role: 'caregiver' as const,
    status: 'active',
  };

  const sessionToken = await createSignedSessionToken(validPayload);
  assert(sessionToken.includes('.'), 'Session token is formatted as payload.signature');

  const verification = await verifySignedSessionToken(sessionToken);
  assert(verification.valid === true && verification.payload?.role === 'caregiver', 'Authentic session token verified successfully');

  // Simulate Privilege Escalation Attack (tampering payload from 'caregiver' to 'admin')
  const [b64Payload, sig] = sessionToken.split('.');
  const decodedJson = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
  decodedJson.role = 'admin'; // Attacker attempts to forge admin access
  const tamperedB64Payload = Buffer.from(JSON.stringify(decodedJson)).toString('base64url');
  const forgedToken = `${tamperedB64Payload}.${sig}`;

  const attackResult = await verifySignedSessionToken(forgedToken);
  assert(attackResult.valid === false, 'CRITICAL: HMAC verification blocks forged payload / privilege escalation attack');

  // Simulate Invalid Signature
  const corruptedToken = `${b64Payload}.invalidSignatureHexHere12345`;
  const corruptResult = await verifySignedSessionToken(corruptedToken);
  assert(corruptResult.valid === false, 'Corrupted HMAC signature rejected');

  // 5. Rate Limiter & Brute-Force Shielding
  console.log('\n--- 5. Brute Force Protection & Rate Limiting ---');
  const attackerIp = '192.168.1.99';

  // Make 5 requests (allowed)
  let lastCheck = { allowed: false, remaining: 0, resetMs: 0 };
  for (let i = 0; i < 5; i++) {
    lastCheck = checkRateLimit(attackerIp, 5, 60000);
    assert(lastCheck.allowed === true, `Login attempt ${i + 1} within threshold allowed`);
  }

  // 6th attempt should be blocked
  const blockedCheck = checkRateLimit(attackerIp, 5, 60000);
  assert(blockedCheck.allowed === false, 'Rate limiter locks out IP on 6th attempt exceeding 5/minute threshold');
  assert(blockedCheck.remaining === 0, 'Remaining allowance drops to 0');
  assert(blockedCheck.resetMs > 0, `Lockout cooldown period active (${Math.ceil(blockedCheck.resetMs / 1000)}s remaining)`);

  console.log('\n====================================================');
  console.log(`AUTH TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
