'use server';

import { db } from '@/lib/services/data-service';
import { ComplaintStatus } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth-actions';
import { sanitizeInput } from '@/lib/security/sanitize';

  export async function verifyCompanyAction(companyId: string, _adminId?: string, isVerified?: boolean) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Access Denied: Super Administrator role strictly required for SSM approvals.' };
    }

    try {
      db.verifyCompany(companyId, currentUser.id, isVerified ?? true);

      // Audit Log
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: currentUser.id,
        action: isVerified ? 'COMPANY_SSM_VERIFIED' : 'COMPANY_SSM_REVOKED',
        entity_type: 'companies',
        entity_id: companyId,
        metadata: { verified: isVerified, admin_email: currentUser.email },
        created_at: new Date().toISOString(),
      });

      revalidatePath('/admin/companies');
      revalidatePath('/company/profile');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update company verification.' };
    }
  }

  export async function setUserAccountStatusAction(
    userId: string,
  _adminId?: string,
    status: 'active' | 'suspended' | 'flagged' = 'active'
  ) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Access Denied: Super Administrator role strictly required for account moderation.' };
    }

    // Prevent admin from suspending themselves
    if (currentUser.id === userId && status === 'suspended') {
      return { success: false, error: 'Safety Guard: Administrators cannot suspend their own active accounts.' };
    }

    try {
      db.setUserAccountStatus(userId, currentUser.id, status);

      // Audit Log
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: currentUser.id,
        action: `USER_STATUS_${status.toUpperCase()}`,
        entity_type: 'profiles',
        entity_id: userId,
        metadata: { new_status: status, admin_email: currentUser.email },
        created_at: new Date().toISOString(),
      });

      revalidatePath('/admin/users');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update account status.' };
    }
  }

  export async function resolveComplaintAction(
    complaintId: string,
  _adminId?: string,
    status: ComplaintStatus = 'resolved',
    resolutionNotes: string = ''
  ) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Access Denied: Super Administrator role strictly required for complaint resolution.' };
    }

    const cleanNotes = sanitizeInput(resolutionNotes);

    try {
      const updated = db.resolveComplaint(complaintId, currentUser.id, status, cleanNotes);

      // Audit Log
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: currentUser.id,
        action: 'COMPLAINT_RESOLVED',
        entity_type: 'complaints',
        entity_id: complaintId,
        metadata: { status, resolution_notes: cleanNotes },
        created_at: new Date().toISOString(),
      });

      revalidatePath('/admin/complaints');
      return { success: true, complaint: updated };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resolve complaint.' };
    }
  }
