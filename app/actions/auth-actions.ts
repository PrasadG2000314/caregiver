'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/services/data-service';
import { RegisterSchema, LoginSchema } from '@/lib/validations';
import { Profile, UserRole } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

const SESSION_COOKIE = 'budget_dekoo_session_user';

export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionUserId) {
    const profile = db.getProfile(sessionUserId);
    if (profile) return profile;
  }

  // Default to the first company profile for testing convenience if no session cookie
  return db.profiles[1];
}

export async function switchDemoUser(userId: string) {
  const cookieStore = await cookies();
  const user = db.getProfile(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  cookieStore.set(SESSION_COOKIE, userId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  db.setCurrentUser(userId);
  revalidatePath('/', 'layout');
  return { success: true, user };
}

export async function loginAction(formData: { email: string; role?: UserRole }) {
  const profile = db.profiles.find(p => p.email.toLowerCase() === formData.email.toLowerCase());
  
  if (!profile) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (profile.account_status === 'suspended' || profile.account_status === 'deleted') {
    return { 
      success: false, 
      error: `Your account is currently ${profile.account_status}. Please contact support@budgetdekoo.my.` 
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, profile.id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  db.setCurrentUser(profile.id);
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
  const validation = RegisterSchema.safeParse({
    ...data,
    password: 'MockSecurePassword123!',
  });

  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const exists = db.profiles.some(p => p.email.toLowerCase() === data.email.toLowerCase());
  if (exists) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newProfile: Profile = {
    id: newId,
    role: data.role,
    email: data.email,
    full_name: data.fullName,
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
      company_name: data.fullName,
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

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, newId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  db.setCurrentUser(newId);
  revalidatePath('/', 'layout');
  return { success: true, user: newProfile };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  revalidatePath('/', 'layout');
  return { success: true };
}

