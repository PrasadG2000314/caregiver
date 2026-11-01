'use server';

import { db } from '@/lib/services/data-service';
import { Caregiver, Company } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

export async function updateCaregiverProfileAction(caregiverId: string, updates: Partial<Caregiver>) {
  try {
    const updated = db.updateCaregiver(caregiverId, updates);
    if (!updated) return { success: false, error: 'Caregiver profile not found.' };

    revalidatePath('/caregiver/profile');
    return { success: true, caregiver: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update caregiver profile.' };
  }
}

export async function updateCompanyProfileAction(companyId: string, updates: Partial<Company>) {
  try {
    const updated = db.updateCompany(companyId, updates);
    if (!updated) return { success: false, error: 'Company profile not found.' };

    revalidatePath('/company/profile');
    return { success: true, company: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update company profile.' };
  }
}

