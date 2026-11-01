# Handover Documentation: Budget Dekoo (`budget-dekoo`)
**Malaysia Caregiver Matching Platform — Lean MVP**

---

## 1. System Architecture & Technical Specifications

| Component | Technical Details |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, React 19, TypeScript strict mode) |
| **Styling** | Tailwind CSS + Lucide Icons + custom accessible UI primitives |
| **Database** | PostgreSQL 15+ hosted on Supabase |
| **Security Model** | PostgreSQL Row-Level Security (RLS) on all 10 tables + Next.js Edge Middleware |
| **Storage Engine** | Supabase Private Storage (`caregiver-documents`, `company-documents`), 300s TTL signed URLs |
| **Android Shell** | Capacitor 7 (`appId: 'com.budgetdekoo.app'`, `appName: 'Budget Dekoo'`) |
| **Localization** | Malaysia context: Currency `MYR` (`RM`), `+601` mobile formats, 16 States/FT |

---

## 2. Database Schema & RLS Security Map

All migrations and seed files are under `supabase/`:
- `supabase/migrations/001_budget_dekoo_mvp_schema.sql`
- `supabase/seed.sql`

### 2.1 Table Schema Breakdown
1. **`profiles`**: Primary user registry (`auth.users`), roles (`company`, `caregiver`, `admin`), account status (`active`, `suspended`, `flagged`), verification status, and timestamped PDPA consent.
2. **`companies`**: SSM registration number (e.g. `202101099881 (1420181-T)`), address, state, city, SSM proof document path, verification metadata.
3. **`caregivers`**: Clinical bio, years experience, skills array, languages array, availability toggle, private CV path, certificates JSON array, work eligibility (MyKad).
4. **`jobs`**: Company shift posting with dates, duration (hours), offered rate (`MYR`), responsibilities, required skills. **Prohibits identifiable patient details (NRIC/names)**.
5. **`applications`**: Unique applications per job and caregiver `UNIQUE(job_id, caregiver_id)`, cover note, status (`applied`, `shortlisted`, `selected`, `rejected`, `withdrawn`), and `is_backup_candidate` flag.
6. **`bookings`**: Official confirmed engagements with agreed rate in `MYR`, start/end dates, cancellation reason, cancelled_by actor.
7. **`booking_status_history`**: Audit trail of every booking state change (`confirmed` -> `completed` / `cancelled`).
8. **`complaints`**: User dispute filing, job reporting, category, description, and admin resolution logs.
9. **`notifications`**: In-app notifications with read status and deep links.
10. **`audit_logs`**: Administrative and critical state mutation logs.

### 2.2 Row-Level Security (RLS) Access Policies
- **Caregiver Contact Protection**: `phone`, `email`, `cv_storage_path`, and `certificates_storage_paths` are protected by `can_view_caregiver_contact(p_caregiver_id UUID)`:
  - Readable only if viewer is the Caregiver themselves (`auth.uid() = id`),
  - Or an active platform administrator (`is_admin()`),
  - Or an active, verified company to whose job the caregiver has submitted an active application.
- **Private Buckets**: `caregiver-documents` and `company-documents` have `public = false`. File access is served strictly via authenticated signed URLs generated with 300-second expiry tokens.

---

## 3. Account Handover Checklist

The test environment is seeded with realistic Malaysian entities across roles:

| Entity Name | Role | Email | Password | Location & Details |
| :--- | :--- | :--- | :--- | :--- |
| **Hafiz bin Rahman** | `admin` | `admin@budgetdekoo.my` | `password123` | Kuala Lumpur • Full Moderation & Audit Access |
| **Damai Care Services Sdn Bhd** | `company` | `admin@damaicare.com.my` | `password123` | Petaling Jaya, Selangor • SSM: `202101099881` • Verified |
| **Penang SilverCare Wellness Hub** | `company` | `ops@silvercarepenang.com` | `password123` | Georgetown, Penang • SSM: `201901044552` • Verified |
| **Siti Nurhaliza binti Ishak** | `caregiver` | `siti.nurhaliza@gmail.com` | `password123` | Petaling Jaya • Staff Nurse, 6 yrs exp • Palliative/Wound Care |
| **Tan Mei Ling** | `caregiver` | `meiling.tan@yahoo.com` | `password123` | Cheras, KL • Dementia Care Specialist, 4 yrs exp |
| **Kavitha a/p Rajendran** | `caregiver` | `kavitha.raj@outlook.com` | `password123` | Klang, Selangor • Stroke Rehab Assistant, 3 yrs exp |
| **Ahmad Fadhil bin Zakaria** | `caregiver` | `fadhil.zakaria@gmail.com` | `password123` | Bayan Lepas, Penang • Post-Operative Healthcare Assistant |

> **Pro-Tip**: Use the **"Test Account Switcher"** widget in the top navigation bar to toggle between these identities in 1-click.

---

## 4. Acceptance Testing Guide (Mapped to 9 Acceptance Criteria)

### Criterion 1: Authentication & Role-Based Access Control (RBAC)
- **Test Steps**:
  1. Navigate to `/auth/login`. Sign in using `admin@damaicare.com.my` (Company). Verify automatic redirection to `/company/dashboard`.
  2. Switch to `siti.nurhaliza@gmail.com` (Caregiver). Verify navigation updates with Caregiver tabs (`/caregiver/jobs`, `/caregiver/applications`, `/caregiver/bookings`, `/caregiver/profile`).
  3. Attempt to access `/admin/dashboard` as a Caregiver. Verify middleware access controls.
- **Expected Result**: Clean RBAC routing and proper role separation.

### Criterion 2: Company Profile & SSM Verification
- **Test Steps**:
  1. As Damai Care, navigate to `/company/profile`.
  2. Verify SSM Number `202101099881 (1420181-T)` and "SSM Verified Agency" badge.
  3. Click "View Stored PDF".
- **Expected Result**: Secure signed URL endpoint (`/api/documents/download?bucket=company-documents...`) serves the verified file.

### Criterion 3: Job Posting with PDPA Patient Privacy Safeguards
- **Test Steps**:
  1. Navigate to `/company/jobs/new`.
  2. Review the prominent patient privacy warning banner.
  3. Fill out job details. In the responsibilities field, attempt to enter a Malaysian NRIC number (e.g. `850101-14-5555`).
  4. Submit the form.
- **Expected Result**: Validation actively blocks submission and highlights: *"PDPA Violation: Identifiable patient NRIC / MyKad numbers are strictly prohibited in public job postings."*

### Criterion 4: Caregiver Job Discovery & Duplicate Application Prevention
- **Test Steps**:
  1. Switch to Caregiver **Siti Nurhaliza**.
  2. Navigate to `/caregiver/jobs`. Filter by State: "Selangor" or search "Wound Care".
  3. Locate "Night Shift Elderly Companion & Monitor". Notice button state if already applied.
  4. Click "Apply for Shift" on an open job. Add an optional cover note and confirm.
- **Expected Result**: Application succeeds. The button immediately shifts to "Applied" with duplicate submission locked.

### Criterion 5: Applicant Review, Shortlisting & Backup Candidate Flagging
- **Test Steps**:
  1. Switch to **Damai Care Services**.
  2. Go to `/company/jobs/30000000-0000-0000-0000-000000000001/applicants`.
  3. View applicants. Click "View Full Profile & Documents" to inspect unmasked phone/email (accessible under PDPA because of active application) and test the 300s signed CV download.
  4. Click **"Flag as Backup Candidate"** on a shortlisted candidate.
- **Expected Result**: The applicant is flagged with the badge `Priority Backup Candidate` and added to the fallback pool.

### Criterion 6: Booking Confirmation & Job Status Transition
- **Test Steps**:
  1. In the applicant list, click **"Confirm & Book Caregiver"** on selected applicant.
  2. Confirm the prompt.
- **Expected Result**: Job status shifts to `Filled`, a confirmed record is created in `/company/bookings`, and the caregiver receives an in-app notification.

### Criterion 7: Booking Cancellation & Instant Backup Candidate Workflow
- **Test Steps**:
  1. Navigate to `/company/bookings`.
  2. On an active confirmed booking, click **"Cancel Booking"**.
  3. Submit with mandatory cancellation reason: *"Client schedule changed; inviting priority backup nurse."*
- **Expected Result**:
  - Booking is marked `Cancelled` with reason saved.
  - An instant **"Invite Backup Candidate Immediately"** dialog pops up displaying pre-flagged backup candidates.
  - Clicking "Confirm Backup" immediately issues a new booking for the backup candidate.

### Criterion 8: Admin Moderation, SSM Approval & Complaint Resolution
- **Test Steps**:
  1. Switch to **Hafiz bin Rahman (Platform Admin)**.
  2. Navigate to `/admin/companies`. Test approving or revoking company verification.
  3. Navigate to `/admin/users`. Test toggling user status between `Active`, `Flagged`, and `Suspended`.
  4. Navigate to `/admin/complaints`. Click "Review & Resolve Complaint", enter resolution notes, and mark `Resolved`.
- **Expected Result**: All administrative updates reflect immediately and append immutable entries into `/admin/audit-logs`.

### Criterion 9: Capacitor Android Native Packaging
- **Test Steps**:
  1. Inspect `capacitor.config.ts`. Verify `appId: 'com.budgetdekoo.app'` and `appName: 'Budget Dekoo'`.
  2. Inspect `/android/app/src/main/AndroidManifest.xml`.
  3. Run `npm run build` and `npx cap sync android`.
- **Expected Result**: Build succeeds with 0 errors; assets sync directly into the Android native project.

---

## 5. Deployment Instructions

### Deploying Next.js to Vercel / Cloud Container
1. Connect git repository.
2. Configure environment variables in dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Execute deploy.

### Applying Supabase Migrations to Cloud Instance
Using Supabase CLI:
```bash
supabase link --project-ref <your-project-id>
supabase db push
supabase db seed
```
Or execute `supabase/migrations/001_budget_dekoo_mvp_schema.sql` and `supabase/seed.sql` directly inside the Supabase SQL Editor.

