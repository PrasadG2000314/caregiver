'use server';

import { db } from '@/lib/services/data-service';
import { JobPostSchema } from '@/lib/validations';
import { JobStatus } from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

export async function createJobAction(formData: {
  companyId: string;
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
  const validation = JobPostSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const newJob = db.createJob({
      company_id: formData.companyId,
      title: formData.title,
      location_state: formData.locationState,
      location_city: formData.locationCity,
      location_area: formData.locationArea || null,
      start_date: formData.startDate,
      end_date: formData.endDate,
      shift_duration_hours: Number(formData.shiftDurationHours),
      shift_notes: formData.shiftNotes || null,
      offered_rate: Number(formData.offeredRate),
      currency: 'MYR',
      responsibilities: formData.responsibilities,
      required_experience_years: Number(formData.requiredExperienceYears),
      required_skills: formData.requiredSkills,
      required_languages: formData.requiredLanguages,
      work_eligibility_requirements: formData.workEligibilityRequirements || 'Malaysian Citizen (MyKad)',
      status: formData.status || 'open',
    });

    revalidatePath('/company/jobs');
    revalidatePath('/caregiver/jobs');
    return { success: true, job: newJob };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create job.' };
  }
}

export async function updateJobStatusAction(jobId: string, status: JobStatus) {
  const updated = db.updateJob(jobId, { status });
  if (!updated) return { success: false, error: 'Job not found.' };

  revalidatePath('/company/jobs');
  revalidatePath('/caregiver/jobs');
  return { success: true, job: updated };
}

export async function reportJobAction(jobId: string, reporterId: string, reason: string) {
  const job = db.jobs.find(j => j.id === jobId);
  if (!job) return { success: false, error: 'Job not found.' };

  job.is_reported = true;
  job.updated_at = new Date().toISOString();

  db.createComplaint({
    reporter_id: reporterId,
    reported_job_id: jobId,
    category: 'Prohibited Content / Patient Privacy Violation',
    description: reason,
  });

  revalidatePath('/admin/jobs');
  revalidatePath('/caregiver/jobs');
  return { success: true };
}

