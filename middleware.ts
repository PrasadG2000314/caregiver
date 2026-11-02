import { NextResponse, type NextRequest } from 'next/server';
import { 
  SESSION_COOKIE, 
  ROLE_COOKIE, 
  STATUS_COOKIE, 
  SESSION_TOKEN_COOKIE 
} from '@/lib/security/cookies';
import { verifySignedSessionToken } from '@/lib/security/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static and Public Assets whitelist
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/' ||
    pathname.startsWith('/auth')
  ) {
    const res = NextResponse.next();
    applySecurityHeaders(res);
    return res;
  }

  // 2. Read Session Cookies
  const signedToken = request.cookies.get(SESSION_TOKEN_COOKIE)?.value;
  const sessionUserId = request.cookies.get(SESSION_COOKIE)?.value;
  let sessionRole = request.cookies.get(ROLE_COOKIE)?.value;
  let sessionStatus = request.cookies.get(STATUS_COOKIE)?.value;

  // 3. Cryptographic Signature Verification
  // If signed token is present, extract authoritative verified claims
  if (signedToken) {
    const verification = await verifySignedSessionToken(signedToken);
    if (verification.valid && verification.payload) {
      sessionRole = verification.payload.role;
      sessionStatus = verification.payload.status;
    } else {
      // If token is invalid or tampered with, force clean sign-in
      const loginUrl = new URL('/auth/login?error=session_tampered_or_expired', request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(SESSION_TOKEN_COOKIE);
      res.cookies.delete(SESSION_COOKIE);
      applySecurityHeaders(res);
      return res;
    }
  }

  // 4. Account Status Enforcement (Suspended / Flagged Accounts)
  if (sessionStatus === 'suspended' || sessionStatus === 'deleted') {
    const redirectUrl = new URL(`/auth/account-status?status=${sessionStatus}`, request.url);
    const res = NextResponse.redirect(redirectUrl);
    applySecurityHeaders(res);
    return res;
  }

  // 5. Role-Based Access Control (RBAC) Hardening
  const isAdminRoute = pathname.startsWith('/admin');
  const isCompanyRoute = pathname.startsWith('/company');
  const isProtectedCaregiverRoute = 
    pathname.startsWith('/caregiver/profile') ||
    pathname.startsWith('/caregiver/applications') ||
    pathname.startsWith('/caregiver/bookings');

  // If user has no session, redirect to login
  if (!sessionUserId && !signedToken) {
    if (isAdminRoute || isCompanyRoute || isProtectedCaregiverRoute) {
      const loginUrl = new URL('/auth/login?error=session_required', request.url);
      const res = NextResponse.redirect(loginUrl);
      applySecurityHeaders(res);
      return res;
    }
  }

  // Enforce Admin Access Barrier
  if (isAdminRoute && sessionRole && sessionRole !== 'admin') {
    const loginUrl = new URL('/auth/login?error=admin_privilege_required', request.url);
    const res = NextResponse.redirect(loginUrl);
    applySecurityHeaders(res);
    return res;
  }

  // Enforce Company Portal Barrier
  if (isCompanyRoute && sessionRole && sessionRole !== 'company' && sessionRole !== 'admin') {
    const loginUrl = new URL('/auth/login?error=employer_account_required', request.url);
    const res = NextResponse.redirect(loginUrl);
    applySecurityHeaders(res);
    return res;
  }

  // Enforce Caregiver Protected Portal Barrier
  if (isProtectedCaregiverRoute && sessionRole && sessionRole !== 'caregiver' && sessionRole !== 'admin') {
    const loginUrl = new URL('/auth/login?error=caregiver_account_required', request.url);
    const res = NextResponse.redirect(loginUrl);
    applySecurityHeaders(res);
    return res;
  }

  const res = NextResponse.next();
  applySecurityHeaders(res);
  return res;
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
