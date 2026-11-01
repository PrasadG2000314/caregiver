'use server';

import { db } from '@/lib/services/data-service';
import { ApplicationStatus } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

export async function applyToJobAction(jobId: string, caregiverId: string, coverNote?: string) {
  try {
    const app = db.applyToJob(jobId, caregiverId, coverNote);
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
  try {
    const updated = db.updateApplicationStatus(applicationId, status, isBackupCandidate);
    if (!updated) return { success: false, error: 'Application not found.' };

    revalidatePath('/company/jobs');
    revalidatePath('/caregiver/applications');
    return { success: true, application: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update application.' };
  }
}

export async function withdrawApplicationAction(applicationId: string, caregiverId: string) {
  try {
    const success = db.withdrawApplication(applicationId, caregiverId);
    if (!success) return { success: false, error: 'Application not found or could not be withdrawn.' };

    revalidatePath('/caregiver/applications');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to withdraw application.' };
  }
}

