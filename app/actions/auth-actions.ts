'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/services/data-service';
import { RegisterSchema, LoginSchema } from '@/lib/validations';
import { Profile, UserRole } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { sanitizeInput } from '@/lib/security/sanitize';
import { SESSION_COOKIE, ROLE_COOKIE, STATUS_COOKIE } from '@/lib/security/cookies';

export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionUserId) {
    const profile = db.getProfile(sessionUserId);
    if (profile) return profile;
  }

  // Default fallback for demo exploration
  return db.profiles[1];
}

export async function switchDemoUser(userId: string) {
  const cookieStore = await cookies();
  const user = db.getProfile(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

    const cookieOptions = {
      path: '/',
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
};

cookieStore.set(SESSION_COOKIE, user.id, cookieOptions);
cookieStore.set(ROLE_COOKIE, user.role, cookieOptions);
cookieStore.set(STATUS_COOKIE, user.account_status, cookieOptions);

db.setCurrentUser(userId);
revalidatePath('/', 'layout');
return { success: true, user };
}

export async function loginAction(formData: { email: string; role?: UserRole }) {
  // 1. Rate Limiting Protection (Max 6 attempts per minute per email target)
  const rateLimit = checkRateLimit(`login_${formData.email.toLowerCase()}`, 6, 60000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'Security Warning: Too many sign-in attempts. Please wait 60 seconds before trying again.',
    };
  }

  const cleanEmail = sanitizeInput(formData.email).toLowerCase();
  const profile = db.profiles.find(p => p.email.toLowerCase() === cleanEmail);

  if (!profile) {
    return { success: false, error: 'Invalid email address or unregistered account.' };
  }

  if (profile.account_status === 'suspended' || profile.account_status === 'deleted') {
    return {
      success: false,
      error: `Your account is currently ${profile.account_status}. Please contact support@budgetdekoo.my for PDPA review.`
    };
  }

  // 2. Set Secure Session Cookies
  const cookieStore = await cookies();
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
    };

    cookieStore.set(SESSION_COOKIE, profile.id, cookieOptions);
    cookieStore.set(ROLE_COOKIE, profile.role, cookieOptions);
    cookieStore.set(STATUS_COOKIE, profile.account_status, cookieOptions);

    db.setCurrentUser(profile.id);

    // 3. Log Authentication Event in Immutable Audit Trail
    db.auditLogs.push({
      id: crypto.randomUUID(),
      actor_id: profile.id,
      action: 'USER_LOGIN_SUCCESS',
      entity_type: 'auth_session',
      entity_id: profile.id,
      metadata: { email: profile.email, role: profile.role, timestamp: new Date().toISOString() },
      created_at: new Date().toISOString(),
    });

    revalidatePath('/', 'layout');
  return { success: true, user: profile };
  }

export async function registerAction(data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    pdpaConsent: boolean;
  }) {
    // 1. Rate Limiting (Max 4 registration attempts per minute)
    const rateLimit = checkRateLimit('registration_ip_gate', 4, 60000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Registration rate limit reached. Please wait 60 seconds.',
      };
    }

    const validation = RegisterSchema.safeParse({
      ...data,
      password: 'MockSecurePassword123!',
    });

    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    const cleanEmail = sanitizeInput(data.email).toLowerCase();
    const cleanName = sanitizeInput(data.fullName);

    const exists = db.profiles.some(p => p.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newProfile: Profile = {
      id: newId,
      role: data.role,
      email: cleanEmail,
      full_name: cleanName,
      phone: data.phone,
      account_status: 'active',
      verification_status: data.role === 'company' ? 'pending_review' : 'unverified',
      pdpa_consent_at: now,
      created_at: now,
      updated_at: now,
    };

    db.profiles.push(newProfile);

    if (data.role === 'company') {
      db.companies.push({
        id: newId,
        company_name: cleanName,
        registration_number: '202401000000',
        address: 'Kuala Lumpur, Malaysia',
        state: 'Kuala Lumpur',
        city: 'Kuala Lumpur Central',
        description: 'Caregiving and healthcare service provider.',
        verification_document_path: null,
        verified_by: null,
        verified_at: null,
        created_at: now,
        updated_at: now,
      });
    } else if (data.role === 'caregiver') {
      db.caregivers.push({
        id: newId,
        bio: 'New registered caregiver on Budget Dekoo.',
        years_experience: 1,
        skills: ['General Elderly Care', 'Vital Signs Monitoring'],
        languages: ['English', 'Bahasa Melayu'],
        availability_status: true,
        availability_notes: 'Available for scheduling.',
        preferred_locations: ['Kuala Lumpur Central'],
        cv_storage_path: null,
        certificates_storage_paths: [],
        work_eligibility: 'Malaysian Citizen (MyKad)',
        created_at: now,
        updated_at: now,
      });
    }

    // Set Secure Cookies
    const cookieStore = await cookies();
      const cookieOptions = {
        path: '/',
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7,
      };

      cookieStore.set(SESSION_COOKIE, newId, cookieOptions);
      cookieStore.set(ROLE_COOKIE, data.role, cookieOptions);
      cookieStore.set(STATUS_COOKIE, 'active', cookieOptions);

      db.setCurrentUser(newId);

      // Log in Audit Trail
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: newId,
        action: 'USER_REGISTERED',
        entity_type: 'profiles',
        entity_id: newId,
        metadata: { email: cleanEmail, role: data.role, pdpa_consent: true },
        created_at: now,
      });

      revalidatePath('/', 'layout');
  return { success: true, user: newProfile };
    }

export async function logoutAction() {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE);
      cookieStore.delete(ROLE_COOKIE);
      cookieStore.delete(STATUS_COOKIE);
      revalidatePath('/', 'layout');
      return { success: true };
    }
