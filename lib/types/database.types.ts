export type UserRole = 'company' | 'caregiver' | 'admin';

export type AccountStatus = 'pending' | 'active' | 'suspended' | 'flagged' | 'deleted';

export type VerificationStatus = 'unverified' | 'pending_review' | 'verified' | 'rejected';

export type JobStatus = 'draft' | 'open' | 'filled' | 'cancelled';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'selected' | 'rejected' | 'withdrawn';

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export type ComplaintStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  full_name: string;
  phone: string | null;
  account_status: AccountStatus;
  verification_status: VerificationStatus;
  pdpa_consent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string; // References profiles.id
  company_name: string;
  registration_number: string; // SSM
  address: string | null;
  state: string;
  city: string;
  description: string | null;
  verification_document_path: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface CaregiverCertificate {
  name: string;
  issuer: string;
  year: number;
  path: string;
}

export interface Caregiver {
  id: string; // References profiles.id
  bio: string | null;
  years_experience: number;
  skills: string[];
  languages: string[];
  availability_status: boolean;
  availability_notes: string | null;
  preferred_locations: string[];
  cv_storage_path: string | null;
  certificates_storage_paths: CaregiverCertificate[];
  work_eligibility: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  location_state: string;
  location_city: string;
  location_area: string | null;
  start_date: string;
  end_date: string;
  shift_duration_hours: number;
  shift_notes: string | null;
  offered_rate: number;
  currency: string;
  responsibilities: string;
  required_experience_years: number;
  required_skills: string[];
  required_languages: string[];
  work_eligibility_requirements: string | null;
  status: JobStatus;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Application {
  id: string;
  job_id: string;
  caregiver_id: string;
  cover_note: string | null;
  status: ApplicationStatus;
  is_backup_candidate: boolean;
  created_at: string;
  updated_at: string;
  job?: Job;
  caregiver?: Caregiver;
}

export interface Booking {
  id: string;
  job_id: string;
  application_id: string;
  company_id: string;
  caregiver_id: string;
  start_date: string;
  end_date: string;
  agreed_rate: number;
  currency: string;
  status: BookingStatus;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
  job?: Job;
  company?: Company;
  caregiver?: Caregiver;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  old_status: BookingStatus | null;
  new_status: BookingStatus;
  changed_by: string | null;
  reason: string | null;
  created_at: string;
}

export interface Complaint {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  reported_job_id: string | null;
  category: string;
  description: string;
  status: ComplaintStatus;
  resolution_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  reporter?: Profile;
  reported_user?: Profile;
  reported_job?: Job;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  actor?: Profile;
}

