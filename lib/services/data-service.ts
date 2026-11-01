import { 
  Profile, 
  Company, 
  Caregiver, 
  Job, 
  Application, 
  Booking, 
  BookingStatusHistory, 
  Complaint, 
  Notification, 
  AuditLog,
  UserRole,
  JobStatus,
  ApplicationStatus,
  BookingStatus,
  ComplaintStatus
} from '../types/database.types';
import { 
  MOCK_PROFILES, 
  MOCK_COMPANIES, 
  MOCK_CAREGIVERS, 
  MOCK_JOBS, 
  MOCK_APPLICATIONS, 
  MOCK_BOOKINGS, 
  MOCK_BOOKING_HISTORY, 
  MOCK_COMPLAINTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_AUDIT_LOGS 
} from './mock-db';
import { maskPhone, maskEmail } from '../utils';

// Global in-memory mutable store for development & client testing
class DataStore {
  profiles: Profile[] = [...MOCK_PROFILES];
  companies: Company[] = [...MOCK_COMPANIES];
  caregivers: Caregiver[] = [...MOCK_CAREGIVERS];
  jobs: Job[] = [...MOCK_JOBS];
  applications: Application[] = [...MOCK_APPLICATIONS];
  bookings: Booking[] = [...MOCK_BOOKINGS];
  bookingHistory: BookingStatusHistory[] = [...MOCK_BOOKING_HISTORY];
  complaints: Complaint[] = [...MOCK_COMPLAINTS];
  notifications: Notification[] = [...MOCK_NOTIFICATIONS];
  auditLogs: AuditLog[] = [...MOCK_AUDIT_LOGS];

  // Current active session user (defaults to Damai Care or Admin for demo)
  currentUser: Profile = this.profiles[1]; // Damai Care

  setCurrentUser(userId: string) {
    const found = this.profiles.find(p => p.id === userId);
    if (found) {
      this.currentUser = found;
    }
  }

  // --- Profile & PDPA Security ---
  getProfile(id: string): Profile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  getAllProfiles(): Profile[] {
    return [...this.profiles];
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.profiles[idx] = { ...this.profiles[idx], ...updates, updated_at: new Date().toISOString() };
    return this.profiles[idx];
  }

  // --- Caregiver & PDPA Access Control ---
  getCaregiver(id: string, viewerId?: string): (Caregiver & { profile: Profile }) | undefined {
    const cg = this.caregivers.find(c => c.id === id);
    const profile = this.profiles.find(p => p.id === id);
    if (!cg || !profile) return undefined;

    const currentViewerId = viewerId || this.currentUser.id;
    const viewerProfile = this.profiles.find(p => p.id === currentViewerId);

    // Evaluate PDPA permissions
    let hasFullAccess = false;
    if (viewerProfile?.role === 'admin') {
      hasFullAccess = true;
    } else if (currentViewerId === id) {
      hasFullAccess = true;
    } else if (viewerProfile?.role === 'company' && viewerProfile.verification_status === 'verified') {
      // Check if caregiver applied to one of company's jobs
      const hasApplied = this.applications.some(app => {
        const job = this.jobs.find(j => j.id === app.job_id);
        return app.caregiver_id === id && job?.company_id === currentViewerId;
      });
      if (hasApplied) hasFullAccess = true;
    }

    const secureProfile: Profile = hasFullAccess
      ? profile
      : {
          ...profile,
          phone: maskPhone(profile.phone),
          email: maskEmail(profile.email),
        };

    const secureCaregiver: Caregiver = hasFullAccess
      ? cg
      : {
          ...cg,
          cv_storage_path: cg.cv_storage_path ? '[RESTRICTED_ACCESS_SIGNED_URL_REQUIRED]' : null,
          certificates_storage_paths: cg.certificates_storage_paths.map(cert => ({
            ...cert,
            path: '[RESTRICTED_ACCESS_SIGNED_URL_REQUIRED]',
          })),
        };

    return { ...secureCaregiver, profile: secureProfile };
  }

  getAllCaregivers(): (Caregiver & { profile: Profile })[] {
    return this.caregivers.map(cg => {
      const profile = this.profiles.find(p => p.id === cg.id)!;
      return { ...cg, profile };
    });
  }

  updateCaregiver(id: string, updates: Partial<Caregiver>): Caregiver | undefined {
    const idx = this.caregivers.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.caregivers[idx] = { ...this.caregivers[idx], ...updates, updated_at: new Date().toISOString() };
    return this.caregivers[idx];
  }

  // --- Company ---
  getCompany(id: string): (Company & { profile: Profile }) | undefined {
    const comp = this.companies.find(c => c.id === id);
    const profile = this.profiles.find(p => p.id === id);
    if (!comp || !profile) return undefined;
    return { ...comp, profile };
  }

  getAllCompanies(): (Company & { profile: Profile })[] {
    return this.companies.map(c => {
      const profile = this.profiles.find(p => p.id === c.id)!;
      return { ...c, profile };
    });
  }

  updateCompany(id: string, updates: Partial<Company>): Company | undefined {
    const idx = this.companies.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.companies[idx] = { ...this.companies[idx], ...updates, updated_at: new Date().toISOString() };
    return this.companies[idx];
  }

  // --- Jobs (with Patient Privacy Safeguards) ---
  getJobs(filters?: { status?: JobStatus; state?: string; companyId?: string }): (Job & { company: Company })[] {
    return this.jobs
      .filter(job => {
        if (filters?.status && job.status !== filters.status) return false;
        if (filters?.state && job.location_state !== filters.state) return false;
        if (filters?.companyId && job.company_id !== filters.companyId) return false;
        return true;
      })
      .map(job => {
        const company = this.companies.find(c => c.id === job.company_id)!;
        return { ...job, company };
      });
  }

  getJob(id: string): (Job & { company: Company; applicationsCount: number }) | undefined {
    const job = this.jobs.find(j => j.id === id);
    if (!job) return undefined;
    const company = this.companies.find(c => c.id === job.company_id)!;
    const applicationsCount = this.applications.filter(a => a.job_id === id).length;
    return { ...job, company, applicationsCount };
  }

  createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'is_reported'>): Job {
    // Patient Privacy Safeguard: Validate that no IC numbers or patient markers are present
    const contentToScan = `${jobData.title} ${jobData.responsibilities} ${jobData.shift_notes || ''}`;
    const icPattern = /\b\d{6}-\d{2}-\d{4}\b|\b\d{12}\b/;
    if (icPattern.test(contentToScan)) {
      throw new Error('PDPA Compliance Error: Job posting contains prohibited NRIC / IC identifiers.');
    }

    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      is_reported: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);

    // Audit log
    this.logAudit(jobData.company_id, 'CREATE_JOB', 'jobs', newJob.id, { title: newJob.title });

    return newJob;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;

    const contentToScan = `${updates.title || ''} ${updates.responsibilities || ''} ${updates.shift_notes || ''}`;
    const icPattern = /\b\d{6}-\d{2}-\d{4}\b|\b\d{12}\b/;
    if (icPattern.test(contentToScan)) {
      throw new Error('PDPA Compliance Error: Job posting contains prohibited NRIC / IC identifiers.');
    }

    this.jobs[idx] = { ...this.jobs[idx], ...updates, updated_at: new Date().toISOString() };
    return this.jobs[idx];
  }

  deleteJob(id: string): boolean {
    const initialLen = this.jobs.length;
    this.jobs = this.jobs.filter(j => j.id !== id);
    return this.jobs.length < initialLen;
  }

  // --- Applications (Duplicate Prevention & Status Lifecycle) ---
  getApplicationsByJob(jobId: string): (Application & { caregiver: Caregiver & { profile: Profile } })[] {
    return this.applications
      .filter(a => a.job_id === jobId)
      .map(app => {
        const cg = this.getCaregiver(app.caregiver_id)!;
        return { ...app, caregiver: cg };
      });
  }

  getApplicationsByCaregiver(caregiverId: string): (Application & { job: Job & { company: Company } })[] {
    return this.applications
      .filter(a => a.caregiver_id === caregiverId)
      .map(app => {
        const job = this.jobs.find(j => j.id === app.job_id)!;
        const company = this.companies.find(c => c.id === job.company_id)!;
        return { ...app, job: { ...job, company } };
      });
  }

  applyToJob(jobId: string, caregiverId: string, coverNote?: string): Application {
    // 1. Strict Duplicate Check
    const exists = this.applications.some(a => a.job_id === jobId && a.caregiver_id === caregiverId);
    if (exists) {
      throw new Error('You have already submitted an application for this caregiving job.');
    }

    const job = this.jobs.find(j => j.id === jobId);
    if (!job || job.status !== 'open') {
      throw new Error('This job listing is currently not open for new applications.');
    }

    const newApp: Application = {
      id: crypto.randomUUID(),
      job_id: jobId,
      caregiver_id: caregiverId,
      cover_note: coverNote || null,
      status: 'applied',
      is_backup_candidate: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.applications.unshift(newApp);

    // Notify company
    this.notify(
      job.company_id,
      'New Caregiver Application',
      `A new caregiver has applied for "${job.title}".`,
      `/company/jobs/${job.id}/applicants`
    );

    return newApp;
  }

  updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    isBackupCandidate?: boolean
  ): Application | undefined {
    const idx = this.applications.findIndex(a => a.id === applicationId);
    if (idx === -1) return undefined;

    const current = this.applications[idx];
    const job = this.jobs.find(j => j.id === current.job_id);

    const updated: Application = {
      ...current,
      status,
      is_backup_candidate: isBackupCandidate !== undefined ? isBackupCandidate : current.is_backup_candidate,
      updated_at: new Date().toISOString(),
    };
    this.applications[idx] = updated;

    // Send notification to Caregiver
    let notifTitle = 'Application Status Updated';
    let notifMsg = `Your application for "${job?.title || 'Care Job'}" is now marked as ${status}.`;
    if (isBackupCandidate) {
      notifTitle = 'Shortlisted as Priority Backup Candidate';
      notifMsg = `You have been selected as the priority backup candidate for "${job?.title}".`;
    }

    this.notify(current.caregiver_id, notifTitle, notifMsg, '/caregiver/applications');

    return updated;
  }

  withdrawApplication(applicationId: string, caregiverId: string): boolean {
    const idx = this.applications.findIndex(a => a.id === applicationId && a.caregiver_id === caregiverId);
    if (idx === -1) return false;
    this.applications[idx].status = 'withdrawn';
    this.applications[idx].updated_at = new Date().toISOString();
    return true;
  }

  // --- Bookings & Backup Candidate Fallback Workflow ---
  getBookings(viewerId?: string): (Booking & { job: Job; company: Company; caregiver: Caregiver & { profile: Profile } })[] {
    const currentViewerId = viewerId || this.currentUser.id;
    const viewerProfile = this.profiles.find(p => p.id === currentViewerId);

    return this.bookings
      .filter(b => {
        if (viewerProfile?.role === 'admin') return true;
        return b.company_id === currentViewerId || b.caregiver_id === currentViewerId;
      })
      .map(b => {
        const job = this.jobs.find(j => j.id === b.job_id)!;
        const company = this.companies.find(c => c.id === b.company_id)!;
        const caregiver = this.getCaregiver(b.caregiver_id, currentViewerId)!;
        return { ...b, job, company, caregiver };
      });
  }

  confirmBooking(applicationId: string, companyId: string): Booking {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) throw new Error('Application not found.');
    const job = this.jobs.find(j => j.id === app.job_id);
    if (!job) throw new Error('Job not found.');

    // 1. Mark application as selected
    app.status = 'selected';
    app.updated_at = new Date().toISOString();

    // 2. Mark job as filled
    job.status = 'filled';
    job.updated_at = new Date().toISOString();

    // 3. Create Booking
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      job_id: job.id,
      application_id: app.id,
      company_id: companyId,
      caregiver_id: app.caregiver_id,
      start_date: job.start_date,
      end_date: job.end_date,
      agreed_rate: job.offered_rate,
      currency: job.currency,
      status: 'confirmed',
      cancellation_reason: null,
      cancelled_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.bookings.unshift(newBooking);

    // 4. Record History
    this.bookingHistory.unshift({
      id: crypto.randomUUID(),
      booking_id: newBooking.id,
      old_status: null,
      new_status: 'confirmed',
      changed_by: companyId,
      reason: 'Caregiver application confirmed by company.',
      created_at: new Date().toISOString(),
    });

    // 5. Notify Caregiver
    this.notify(
      app.caregiver_id,
      '🎉 Booking Confirmed!',
      `Congratulations! Your booking for "${job.title}" has been confirmed at RM ${job.offered_rate}/shift.`,
      '/caregiver/bookings'
    );

    // 6. Audit Log
    this.logAudit(companyId, 'CONFIRM_BOOKING', 'bookings', newBooking.id, {
      caregiver_id: app.caregiver_id,
      rate: job.offered_rate,
    });

    return newBooking;
  }

  cancelBooking(bookingId: string, cancelledByUserId: string, reason: string): { booking: Booking; backupCandidates: (Application & { caregiver: Caregiver & { profile: Profile } })[] } {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Mandatory cancellation reason required.');
    }

    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found.');

    const oldStatus = booking.status;
    booking.status = 'cancelled';
    booking.cancellation_reason = reason;
    booking.cancelled_by = cancelledByUserId;
    booking.updated_at = new Date().toISOString();

    // Reopen job or keep open
    const job = this.jobs.find(j => j.id === booking.job_id);
    if (job) {
      job.status = 'open';
      job.updated_at = new Date().toISOString();
    }

    // Log status history
    this.bookingHistory.unshift({
      id: crypto.randomUUID(),
      booking_id: booking.id,
      old_status: oldStatus,
      new_status: 'cancelled',
      changed_by: cancelledByUserId,
      reason,
      created_at: new Date().toISOString(),
    });

    // Notify Caregiver
    this.notify(
      booking.caregiver_id,
      'Booking Cancellation Notice',
      `Booking for "${job?.title || 'Care Job'}" was cancelled. Reason: ${reason}`,
      '/caregiver/bookings'
    );

    // Find any shortlisted backup candidates for this job
    const backupCandidates = this.applications
      .filter(a => a.job_id === booking.job_id && a.is_backup_candidate && a.status !== 'selected' && a.status !== 'withdrawn')
      .map(app => {
        const cg = this.getCaregiver(app.caregiver_id)!;
        return { ...app, caregiver: cg };
      });

    return { booking, backupCandidates };
  }

  inviteBackupCandidate(bookingId: string, backupApplicationId: string, companyId: string): Booking {
    const oldBooking = this.bookings.find(b => b.id === bookingId);
    if (!oldBooking) throw new Error('Original booking not found.');

    const backupApp = this.applications.find(a => a.id === backupApplicationId);
    if (!backupApp) throw new Error('Backup candidate application not found.');

    const job = this.jobs.find(j => j.id === oldBooking.job_id);
    if (!job) throw new Error('Job not found.');

    // Confirm new booking with backup candidate
    return this.confirmBooking(backupApp.id, companyId);
  }

  completeBooking(bookingId: string, completedByUserId: string): Booking {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found.');

    const oldStatus = booking.status;
    booking.status = 'completed';
    booking.updated_at = new Date().toISOString();

    this.bookingHistory.unshift({
      id: crypto.randomUUID(),
      booking_id: booking.id,
      old_status: oldStatus,
      new_status: 'completed',
      changed_by: completedByUserId,
      reason: 'Care duration successfully completed.',
      created_at: new Date().toISOString(),
    });

    return booking;
  }

  getBookingHistory(bookingId: string): BookingStatusHistory[] {
    return this.bookingHistory.filter(h => h.booking_id === bookingId);
  }

  // --- Complaints & Moderation ---
  getComplaints(): (Complaint & { reporter: Profile; reportedUser?: Profile; reportedJob?: Job })[] {
    return this.complaints.map(c => {
      const reporter = this.profiles.find(p => p.id === c.reporter_id)!;
      const reportedUser = c.reported_user_id ? this.profiles.find(p => p.id === c.reported_user_id) : undefined;
      const reportedJob = c.reported_job_id ? this.jobs.find(j => j.id === c.reported_job_id) : undefined;
      return { ...c, reporter, reportedUser, reportedJob };
    });
  }

  createComplaint(data: { reporter_id: string; category: string; description: string; reported_user_id?: string; reported_job_id?: string }): Complaint {
    const newComplaint: Complaint = {
      id: crypto.randomUUID(),
      reporter_id: data.reporter_id,
      reported_user_id: data.reported_user_id || null,
      reported_job_id: data.reported_job_id || null,
      category: data.category,
      description: data.description,
      status: 'open',
      resolution_notes: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
    };
    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  resolveComplaint(complaintId: string, adminId: string, status: ComplaintStatus, resolutionNotes: string): Complaint {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) throw new Error('Complaint not found.');

    complaint.status = status;
    complaint.resolution_notes = resolutionNotes;
    complaint.resolved_by = adminId;
    complaint.resolved_at = new Date().toISOString();

    this.logAudit(adminId, 'RESOLVE_COMPLAINT', 'complaints', complaintId, { status, resolutionNotes });

    return complaint;
  }

  // --- Admin Verification & Moderation ---
  verifyCompany(companyId: string, adminId: string, isVerified: boolean): void {
    const comp = this.companies.find(c => c.id === companyId);
    const profile = this.profiles.find(p => p.id === companyId);
    if (!comp || !profile) throw new Error('Company not found.');

    profile.verification_status = isVerified ? 'verified' : 'rejected';
    comp.verified_by = isVerified ? adminId : null;
    comp.verified_at = isVerified ? new Date().toISOString() : null;

    this.logAudit(adminId, isVerified ? 'VERIFY_COMPANY' : 'REJECT_COMPANY', 'companies', companyId, {});
  }

  setUserAccountStatus(userId: string, adminId: string, status: 'active' | 'suspended' | 'flagged'): void {
    const profile = this.profiles.find(p => p.id === userId);
    if (!profile) throw new Error('User not found.');

    profile.account_status = status;
    this.logAudit(adminId, `SET_ACCOUNT_STATUS_${status.toUpperCase()}`, 'profiles', userId, {});
  }

  // --- Notifications ---
  getUserNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.user_id === userId);
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.is_read = true;
  }

  notify(userId: string, title: string, message: string, link?: string): Notification {
    const notif: Notification = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      message,
      link: link || null,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  // --- Audit Logs ---
  getAuditLogs(): (AuditLog & { actor?: Profile })[] {
    return this.auditLogs.map(l => {
      const actor = l.actor_id ? this.profiles.find(p => p.id === l.actor_id) : undefined;
      return { ...l, actor };
    });
  }

  logAudit(actorId: string | null, action: string, entityType: string, entityId: string | null, metadata: Record<string, any>): void {
    this.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      created_at: new Date().toISOString(),
    });
  }

  // --- Signed URL Generation (300 seconds TTL for private buckets) ---
  generateSignedUrl(bucket: 'caregiver-documents' | 'company-documents', filePath: string, viewerId: string): string {
    const viewer = this.profiles.find(p => p.id === viewerId);
    if (!viewer) throw new Error('Unauthorized');

    // Simulate 300-second token
    const token = Math.random().toString(36).substring(2, 10);
    const expiresAt = Date.now() + 300 * 1000;
    return `/api/documents/download?bucket=${bucket}&path=${encodeURIComponent(filePath)}&token=${token}&expires=${expiresAt}`;
  }
}

// Global Singleton
const globalStore = new DataStore();
export const db = globalStore;

