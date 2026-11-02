import { UserRole } from '../types/database.types';

export interface SessionPayload {
  userId: string;
  role: UserRole;
  status: string;
  email: string;
  expiresAt: number;
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'budget_dekoo_production_grade_session_hmac_secret_2026';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

let cachedKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  cachedKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  return cachedKey;
}

/**
 * Creates a cryptographically signed, tamper-proof session token using standard Web Crypto API.
 * Format: base64(payload).hmac_sha256(payload)
 * Fully compatible with Next.js Edge Runtime and Server Actions.
 */
export async function createSignedSessionToken(
  payload: Omit<SessionPayload, 'expiresAt'>,
  ttlDays: number = 7
): Promise<string> {
  const fullPayload: SessionPayload = {
    ...payload,
    expiresAt: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  };

  const payloadJson = JSON.stringify(fullPayload);
  const payloadBytes = encoder.encode(payloadJson);
  const payloadB64 = bytesToBase64Url(payloadBytes);

  const key = await getCryptoKey();
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  const signature = bytesToBase64Url(new Uint8Array(sigBuffer));

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC signature and expiration of a session token via Web Crypto API.
 * Immune to client-side cookie tampering and privilege escalation.
 */
export async function verifySignedSessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; payload?: SessionPayload; reason?: string }> {
  if (!token) return { valid: false, reason: 'No token provided' };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token structure' };

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getCryptoKey();
    const sigBytes = base64UrlToBytes(signatureB64);
    const dataBytes = encoder.encode(payloadB64);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as unknown as BufferSource, dataBytes as unknown as BufferSource);
    if (!isValid) {
      return { valid: false, reason: 'Invalid signature: Session token was tampered with.' };
    }

    const payloadBytes = base64UrlToBytes(payloadB64);
    const payloadJson = decoder.decode(payloadBytes);
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.expiresAt) {
      return { valid: false, reason: 'Session token has expired' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'Invalid session signature or format' };
  }
}
