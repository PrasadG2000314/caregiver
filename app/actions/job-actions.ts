'use server';

import { db } from '@/lib/services/data-service';
import { JobPostSchema } from '@/lib/validations';
import { JobStatus } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth-actions';
import { sanitizeInput, checkPDPACompliance } from '@/lib/security/sanitize';

export async function createJobAction(formData: {
  companyId?: string;
  title: string;
  locationState: string;
  locationCity: string;
  locationArea?: string;
  startDate: string;
  endDate: string;
  shiftDurationHours: number;
  shiftNotes?: string;
  offeredRate: number;
  responsibilities: string;
  requiredExperienceYears: number;
  requiredSkills: string[];
  requiredLanguages: string[];
  workEligibilityRequirements?: string;
  status: JobStatus;
}) {
  // 1. Authentication & Anti-IDOR Authorization Check
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: 'Unauthorized: Active user session required.' };
  }

  if (currentUser.role !== 'company' && currentUser.role !== 'admin') {
    return { success: false, error: 'Forbidden: Only verified healthcare companies can publish shifts.' };
  }

  if (currentUser.account_status === 'suspended') {
    return { success: false, error: 'Forbidden: Account is suspended.' };
  }

  // Anti-IDOR: Force company_id to caller's authenticated ID unless caller is platform admin
  const targetCompanyId = currentUser.role === 'admin' && formData.companyId ? formData.companyId : currentUser.id;

  // 2. Input Sanitization & Anti-XSS
  const sanitizedTitle = sanitizeInput(formData.title);
  const sanitizedResponsibilities = sanitizeInput(formData.responsibilities);
  const sanitizedNotes = sanitizeInput(formData.shiftNotes || '');

  // 3. PDPA 2010 NRIC Leakage Guard
  const pdpaCheck = checkPDPACompliance(`${sanitizedTitle} ${sanitizedResponsibilities} ${sanitizedNotes}`);
  if (!pdpaCheck.compliant) {
    return { success: false, error: pdpaCheck.violation };
  }

  const validation = JobPostSchema.safeParse({
    ...formData,
    title: sanitizedTitle,
    responsibilities: sanitizedResponsibilities,
    shiftNotes: sanitizedNotes,
  });

  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const newJob = db.createJob({
      company_id: targetCompanyId,
      title: sanitizedTitle,
      location_state: formData.locationState,
      location_city: formData.locationCity,
      location_area: formData.locationArea ? sanitizeInput(formData.locationArea) : null,
      start_date: formData.startDate,
      end_date: formData.endDate,
      shift_duration_hours: Number(formData.shiftDurationHours),
      shift_notes: sanitizedNotes || null,
      offered_rate: Number(formData.offeredRate),
      currency: 'MYR',
      responsibilities: sanitizedResponsibilities,
      required_experience_years: Number(formData.requiredExperienceYears),
      required_skills: formData.requiredSkills.map(s => sanitizeInput(s)),
      required_languages: formData.requiredLanguages.map(l => sanitizeInput(l)),
      work_eligibility_requirements: formData.workEligibilityRequirements || 'Malaysian Citizen (MyKad)',
      status: formData.status || 'open',
    });

    // 4. Log in Audit Trail
    db.auditLogs.push({
      id: crypto.randomUUID(),
      actor_id: currentUser.id,
      action: 'JOB_CREATED',
      entity_type: 'jobs',
      entity_id: newJob.id,
      metadata: { title: sanitizedTitle, rate: formData.offeredRate, currency: 'MYR' },
      created_at: new Date().toISOString(),
    });

    revalidatePath('/company/jobs');
    revalidatePath('/caregiver/jobs');
    return { success: true, job: newJob };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create job.' };
  }
}

export async function updateJobStatusAction(jobId: string, status: JobStatus) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: 'Unauthorized: Please sign in.' };

  const job = db.jobs.find(j => j.id === jobId);
  if (!job) return { success: false, error: 'Job not found.' };

  // Anti-IDOR: verify caller owns the job or is admin
  if (currentUser.role !== 'admin' && job.company_id !== currentUser.id) {
    return { success: false, error: 'Forbidden: You do not own this shift posting.' };
  }

  const updated = db.updateJob(jobId, { status });
  if (!updated) return { success: false, error: 'Job not found.' };

  revalidatePath('/company/jobs');
  revalidatePath('/caregiver/jobs');
  return { success: true, job: updated };
}

  export async function reportJobAction(jobId: string, _reporterId: string, reason: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Please sign in.' };

    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return { success: false, error: 'Job not found.' };

    job.is_reported = true;
    job.updated_at = new Date().toISOString();

    const sanitizedReason = sanitizeInput(reason);

    db.createComplaint({
      reporter_id: currentUser.id,
      reported_job_id: jobId,
      category: 'Prohibited Content / Patient Privacy Violation',
      description: sanitizedReason,
    });

    revalidatePath('/admin/jobs');
    revalidatePath('/caregiver/jobs');
    return { success: true };
  }
