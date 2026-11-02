import { NextResponse, type NextRequest } from 'next/server';

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

  // 2. Read Secure Session Cookies
  const sessionUserId = request.cookies.get('budget_dekoo_session_user')?.value;
  const sessionRole = request.cookies.get('budget_dekoo_session_role')?.value;
  const sessionStatus = request.cookies.get('budget_dekoo_session_status')?.value;

  // 3. Account Status Enforcement (Suspended / Flagged Accounts)
  if (sessionStatus === 'suspended' || sessionStatus === 'deleted') {
    const redirectUrl = new URL(`/auth/account-status?status=${sessionStatus}`, request.url);
    const res = NextResponse.redirect(redirectUrl);
    applySecurityHeaders(res);
    return res;
  }

  // 4. Role-Based Access Control (RBAC) Hardening
  const isAdminRoute = pathname.startsWith('/admin');
  const isCompanyRoute = pathname.startsWith('/company');
  const isProtectedCaregiverRoute =
    pathname.startsWith('/caregiver/profile') ||
    pathname.startsWith('/caregiver/applications') ||
    pathname.startsWith('/caregiver/bookings');

    // If user has no session, redirect to login
    if (!sessionUserId) {
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
