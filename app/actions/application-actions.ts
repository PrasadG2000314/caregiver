'use server';

import { db } from '@/lib/services/data-service';
import { ApplicationStatus } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth-actions';
import { sanitizeInput } from '@/lib/security/sanitize';

  export async function applyToJobAction(jobId: string, _caregiverId?: string, coverNote?: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

    if (currentUser.role !== 'caregiver' && currentUser.role !== 'admin') {
      return { success: false, error: 'Forbidden: Only registered caregivers/nurses can apply to shifts.' };
    }

    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found.' };

    if (job.status !== 'open') {
      return { success: false, error: 'This shift is no longer open for applications.' };
    }

    // Anti-IDOR: Always use the authenticated caller's caregiver profile ID
    const caregiverId = currentUser.id;

    // Strict Duplicate Application Prevention
    const existingApp = db.applications.find(a => a.job_id === jobId && a.caregiver_id === caregiverId);
    if (existingApp) {
      return { success: false, error: 'You have already submitted an application for this shift.' };
    }

    const cleanCoverNote = coverNote ? sanitizeInput(coverNote) : null;

    try {
      const app = db.applyToJob(jobId, caregiverId, cleanCoverNote || undefined);

      // Audit Log
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: currentUser.id,
        action: 'APPLICATION_SUBMITTED',
        entity_type: 'applications',
        entity_id: app.id,
        metadata: { job_id: jobId, caregiver_id: caregiverId },
        created_at: new Date().toISOString(),
      });

      revalidatePath('/caregiver/applications');
      revalidatePath(`/company/jobs/${jobId}/applicants`);
      return { success: true, application: app };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit application.' };
    }
  }

  export async function updateApplicationStatusAction(
    applicationId: string,
    status: ApplicationStatus,
    isBackupCandidate?: boolean
  ) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

    const app = db.applications.find(a => a.id === applicationId);
    if (!app) return { success: false, error: 'Application not found.' };

    const job = db.jobs.find(j => j.id === app.job_id);
    if (!job) return { success: false, error: 'Job not found.' };

    // Anti-IDOR: Caller must own the job or be admin
    if (currentUser.role !== 'admin' && job.company_id !== currentUser.id) {
      return { success: false, error: 'Forbidden: You do not own the job listing for this application.' };
    }

    try {
      const updated = db.updateApplicationStatus(applicationId, status, isBackupCandidate);
      if (!updated) return { success: false, error: 'Application not found.' };

      // Audit Log
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: currentUser.id,
        action: 'APPLICATION_STATUS_UPDATED',
        entity_type: 'applications',
        entity_id: applicationId,
        metadata: { new_status: status, is_backup: isBackupCandidate },
        created_at: new Date().toISOString(),
      });

      revalidatePath('/company/jobs');
      revalidatePath('/caregiver/applications');
      return { success: true, application: updated };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update application.' };
    }
  }

    export async function withdrawApplicationAction(applicationId: string, _caregiverId?: string) {
      const currentUser = await getCurrentUser();
      if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

      const app = db.applications.find(a => a.id === applicationId);
      if (!app) return { success: false, error: 'Application not found.' };

      // Anti-IDOR: Caller must be the applicant or admin
      if (currentUser.role !== 'admin' && app.caregiver_id !== currentUser.id) {
        return { success: false, error: 'Forbidden: You cannot withdraw an application that is not yours.' };
      }

      try {
        const success = db.withdrawApplication(applicationId, currentUser.id);
        if (!success) return { success: false, error: 'Application not found or could not be withdrawn.' };

        revalidatePath('/caregiver/applications');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to withdraw application.' };
      }
    }
