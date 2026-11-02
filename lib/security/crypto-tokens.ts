import crypto from 'crypto';

// Server-side HMAC secret key (in production, loaded from process.env.SUPABASE_SIGNING_SECRET)
const SIGNING_SECRET = process.env.SIGNED_URL_SECRET || 'budget_dekoo_production_grade_hmac_secret_2026_pdpa_malaysia';

/**
 * Generate a cryptographically signed URL for accessing private storage files.
 * Format: /api/documents/download?bucket={bucket}&path={path}&expires={timestamp}&token={hmac}
 */
export function generateSignedDocumentUrl(
  bucket: string,
  path: string,
  callerId: string = 'system',
  ttlSeconds: number = 300
): string {
  const expires = Date.now() + ttlSeconds * 1000;
  const signaturePayload = `${bucket}:${path}:${expires}:${callerId}`;
  
  const hmac = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(signaturePayload)
    .digest('hex');

  const params = new URLSearchParams({
    bucket,
    path,
    caller: callerId,
    expires: expires.toString(),
    token: hmac,
  });

  return `/api/documents/download?${params.toString()}`;
}

/**
 * Verify HMAC signature on incoming document requests to prevent URL tampering.
 */
export function verifySignedDocumentToken(
  token: string,
  bucket: string,
  path: string,
  callerId: string,
  expires: number
): { valid: boolean; reason?: string } {
  // Check expiration
  if (Date.now() > expires) {
    return { valid: false, reason: 'Signed URL has expired. Please request a fresh link.' };
  }

  // Prevent path traversal attacks (e.g. ../../etc/passwd or ../../.env)
  if (path.includes('..') || path.startsWith('/') || path.includes('\\')) {
    return { valid: false, reason: 'Invalid path: Path traversal prohibited.' };
  }

  // Recompute HMAC
  const expectedPayload = `${bucket}:${path}:${expires}:${callerId}`;
  const expectedHmac = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(expectedPayload)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  const tokenBuf = Buffer.from(token, 'utf-8');
  const expectedBuf = Buffer.from(expectedHmac, 'utf-8');

  if (tokenBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
    return { valid: false, reason: 'Invalid cryptographic signature or tampered parameters.' };
  }

  return { valid: true };
}

