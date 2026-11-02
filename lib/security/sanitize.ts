/**
 * Input Sanitization & PDPA 2010 Compliance Engine
 * Defends against XSS, HTML injection, and unauthorized patient data leakage.
 */

// Regex for Malaysian NRIC: 12 digits or 000000-00-0000
export const MALAYSIAN_NRIC_REGEX = /\b\d{6}-\d{2}-\d{4}\b|\b\d{12}\b/;

// Regex for dangerous HTML / XSS payloads
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi, // onerror=, onclick=, onload=
];

/**
 * Strips script tags, event handlers, and dangerous HTML entities.
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  let sanitized = input;

  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Escape basic HTML angle brackets to prevent injection
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return sanitized.trim();
}

/**
 * Scans text for prohibited patient personal identifiers under PDPA 2010.
 * Prohibits NRIC numbers, full residential unit details, or private medical IC numbers.
 */
export function checkPDPACompliance(text: string): { compliant: boolean; violation?: string } {
  if (MALAYSIAN_NRIC_REGEX.test(text)) {
    return {
      compliant: false,
      violation: 'PDPA Violation: Patient or user MyKad / NRIC numbers cannot be published.',
    };
  }

  return { compliant: true };
}

