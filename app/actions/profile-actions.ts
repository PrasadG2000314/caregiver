'use server';

import { db } from '@/lib/services/data-service';
import { Caregiver, Company } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth-actions';
import { sanitizeInput } from '@/lib/security/sanitize';

export async function updateCaregiverProfileAction(caregiverId: string, updates: Partial<Caregiver>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

  // Anti-IDOR: Users can only update their own profile unless platform admin
  if (currentUser.role !== 'admin' && currentUser.id !== caregiverId) {
    return { success: false, error: 'Forbidden: You cannot modify another user’s caregiver profile.' };
  }

  const sanitizedUpdates: Partial<Caregiver> = {
    ...updates,
    bio: updates.bio ? sanitizeInput(updates.bio) : updates.bio,
    availability_notes: updates.availability_notes ? sanitizeInput(updates.availability_notes) : updates.availability_notes,
    skills: updates.skills ? updates.skills.map(s => sanitizeInput(s)) : updates.skills,
    languages: updates.languages ? updates.languages.map(l => sanitizeInput(l)) : updates.languages,
    preferred_locations: updates.preferred_locations ? updates.preferred_locations.map(p => sanitizeInput(p)) : updates.preferred_locations,
  };

  try {
    const updated = db.updateCaregiver(caregiverId, sanitizedUpdates);
    if (!updated) return { success: false, error: 'Caregiver profile not found.' };

    // Audit Log
    db.auditLogs.push({
      id: crypto.randomUUID(),
      actor_id: currentUser.id,
      action: 'CAREGIVER_PROFILE_UPDATED',
      entity_type: 'caregivers',
      entity_id: caregiverId,
      metadata: { fields_updated: Object.keys(updates) },
      created_at: new Date().toISOString(),
    });

    revalidatePath('/caregiver/profile');
    return { success: true, caregiver: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update caregiver profile.' };
  }
}

export async function updateCompanyProfileAction(companyId: string, updates: Partial<Company>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

  // Anti-IDOR: Companies can only update their own organization unless platform admin
  if (currentUser.role !== 'admin' && currentUser.id !== companyId) {
    return { success: false, error: 'Forbidden: You cannot modify another organization’s profile.' };
  }

  const sanitizedUpdates: Partial<Company> = {
    ...updates,
    company_name: updates.company_name ? sanitizeInput(updates.company_name) : updates.company_name,
    description: updates.description ? sanitizeInput(updates.description) : updates.description,
    address: updates.address ? sanitizeInput(updates.address) : updates.address,
    registration_number: updates.registration_number ? sanitizeInput(updates.registration_number) : updates.registration_number,
  };

  try {
    const updated = db.updateCompany(companyId, sanitizedUpdates);
    if (!updated) return { success: false, error: 'Company profile not found.' };

    // Audit Log
    db.auditLogs.push({
      id: crypto.randomUUID(),
      actor_id: currentUser.id,
      action: 'COMPANY_PROFILE_UPDATED',
      entity_type: 'companies',
      entity_id: companyId,
      metadata: { fields_updated: Object.keys(updates) },
      created_at: new Date().toISOString(),
    });

    revalidatePath('/company/profile');
    return { success: true, company: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update company profile.' };
  }
}
