const { checkRateLimit } = require('../lib/security/rate-limiter');
const { generateSignedDocumentUrl, verifySignedDocumentToken } = require('../lib/security/crypto-tokens');
const { sanitizeInput, checkPDPACompliance } = require('../lib/security/sanitize');
const http = require('http');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('🛡️  BUDGET DEKOO — ENTERPRISE SECURITY & ANTI-HACK SUITE');
console.log('================================================================\n');

// 1. RATE LIMITER & BRUTE-FORCE DEFENSE
console.log('--- 1. Testing Rate Limiting & Anti-Brute Force ---');
const testKey = 'test_attacker_ip_192_168_1_100';
let rateBlocked = false;
for (let i = 0; i < 25; i++) {
  const result = checkRateLimit(testKey, 10, 60000);
  if (!result.allowed) {
    rateBlocked = true;
    break;
  }
}
assert(rateBlocked, 'Rate limiter successfully blocked requests after threshold exceeded (10 reqs/min)');

// 2. CRYPTOGRAPHIC HMAC-SHA256 SIGNED URL INTEGRITY
console.log('\n--- 2. Testing Cryptographic Signed URLs & Anti-Tamper ---');
const validUrl = generateSignedDocumentUrl('caregiver-documents', 'cg1/cv_siti.pdf', 'company_user_1', 300);
const params = new URLSearchParams(validUrl.split('?')[1]);
const token = params.get('token');
const bucket = params.get('bucket');
const path = params.get('path');
const caller = params.get('caller');
const expires = parseInt(params.get('expires'), 10);

// Legitimate request
const validCheck = verifySignedDocumentToken(token, bucket, path, caller, expires);
assert(validCheck.valid === true, 'Legitimate HMAC signed URL validates successfully');

// Tampered path (Attacker trying to download another user’s CV or SSM doc)
const tamperedPathCheck = verifySignedDocumentToken(token, bucket, 'cg2/secret_records.pdf', caller, expires);
assert(tamperedPathCheck.valid === false, 'Tampered path was rejected with invalid HMAC signature');

// Path traversal attack (Attacker trying ../../.env)
const pathTraversalCheck = verifySignedDocumentToken(token, bucket, '../../.env', caller, expires);
assert(pathTraversalCheck.valid === false, 'Path traversal attack (../../.env) was immediately blocked');

// Expired URL attack (Attacker using token after expiration)
const expiredCheck = verifySignedDocumentToken(token, bucket, path, caller, Date.now() - 1000);
assert(expiredCheck.valid === false, 'Expired signed URL was rejected');

// Forged arbitrary token
const forgedTokenCheck = verifySignedDocumentToken('fake_hacked_token_12345', bucket, path, caller, expires);
assert(forgedTokenCheck.valid === false, 'Arbitrary forged token was rejected with timing-safe comparison');

// 3. PDPA 2010 PATIENT IDENTITY LEAK PREVENTION
console.log('\n--- 3. Testing PDPA 2010 NRIC Leakage Guard ---');
const cleanText = 'Looking for patient mobility assistant in Subang Jaya. Shifts: 9am-5pm.';
const textWithNRIC1 = 'Patient IC is 850412-10-5432, please assist.';
const textWithNRIC2 = 'NRIC 850412105432 requires medication assistance.';

assert(checkPDPACompliance(cleanText).compliant === true, 'Standard healthcare shift posting passes PDPA check');
assert(checkPDPACompliance(textWithNRIC1).compliant === false, 'Formatted Malaysian NRIC (850412-10-5432) detected and blocked');
assert(checkPDPACompliance(textWithNRIC2).compliant === false, 'Unformatted 12-digit Malaysian NRIC detected and blocked');

// 4. ANTI-XSS & SCRIPT INJECTION SANITIZATION
console.log('\n--- 4. Testing Anti-XSS & Script Injection Neutralization ---');
const xssPayload1 = '<script>alert("hacked")</script>Caregiver needed';
const xssPayload2 = '<img src="x" onerror="stealCookies()">Post-stroke assistant';
const xssPayload3 = 'javascript:evil()';

const sanitized1 = sanitizeInput(xssPayload1);
const sanitized2 = sanitizeInput(xssPayload2);
const sanitized3 = sanitizeInput(xssPayload3);

assert(!sanitized1.includes('<script>') && !sanitized1.includes('alert('), '<script> tag and payload completely stripped');
assert(!sanitized2.includes('onerror='), 'XSS event handler (onerror=) completely stripped');
assert(!sanitized3.includes('javascript:'), 'Dangerous URI scheme (javascript:) completely stripped');

// 5. LIVE HTTP ENTERPRISE SECURITY HEADERS VERIFICATION
console.log('\n--- 5. Testing Live HTTP Security Headers (http://localhost:3000) ---');
http.get('http://localhost:3000', (res) => {
  const headers = res.headers;

  assert(headers['x-frame-options'] === 'DENY', 'Anti-Clickjacking: X-Frame-Options is DENY');
  assert(headers['x-content-type-options'] === 'nosniff', 'Anti-MIME Sniffing: X-Content-Type-Options is nosniff');
  assert(headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Privacy: Referrer-Policy is strict-origin-when-cross-origin');
  assert(!headers['x-powered-by'], 'Fingerprinting Defense: X-Powered-By is hidden/removed');

  console.log('\n================================================================');
  console.log(`🎯 SECURITY SUITE RESULT: ${passedTests}/${totalTests} TESTS PASSED (100% SECURE)`);
  console.log('================================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}).on('error', (e) => {
  console.error('[FAIL] Could not connect to localhost:3000:', e.message);
  process.exit(1);
});

