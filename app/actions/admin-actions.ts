'use server';

import { db } from '@/lib/services/data-service';
import { ComplaintStatus } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

export async function verifyCompanyAction(companyId: string, adminId: string, isVerified: boolean) {
  try {
    db.verifyCompany(companyId, adminId, isVerified);
    revalidatePath('/admin/companies');
    revalidatePath('/company/profile');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update company verification.' };
  }
}

export async function setUserAccountStatusAction(
  userId: string, 
  adminId: string, 
  status: 'active' | 'suspended' | 'flagged'
) {
  try {
    db.setUserAccountStatus(userId, adminId, status);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update account status.' };
  }
}

export async function resolveComplaintAction(
  complaintId: string, 
  adminId: string, 
  status: ComplaintStatus, 
  resolutionNotes: string
) {
  try {
    const updated = db.resolveComplaint(complaintId, adminId, status, resolutionNotes);
    revalidatePath('/admin/complaints');
    return { success: true, complaint: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to resolve complaint.' };
  }
}

