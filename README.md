# Budget Dekoo (`budget-dekoo`)
> **Malaysia Caregiver Matching Platform — Lean MVP**
> Designed for the Malaysian healthcare & homecare market with strict PDPA 2010 privacy compliance, SSM registration verification, backup candidate workflows, and native Android delivery via Capacitor.

---

## 1. Overview & Key Capabilities

- **Malaysia Tailored**: All shift rates quoted in Ringgit Malaysia (`MYR` / `RM`), location pickers covering 16 Malaysian States & Federal Territories, phone validation for `+601` format, and strict PDPA privacy safeguards.
- **SSM Verification Gate**: Care agencies and healthcare centers must upload and prove Suruhanjaya Syarikat Malaysia (SSM) registration. Unverified agencies cannot view direct caregiver contacts.
- **Caregiver Privacy & Masking**: Direct phone numbers, emails, and credentials (CVs, nursing board certificates) are shielded by PostgreSQL Row-Level Security (RLS). They are accessible only by the caregiver, platform administrators, or active verified companies whose job the caregiver has applied to.
- **Strict Patient Privacy Safeguards**: Identifiable patient data (NRIC / MyKad numbers, patient full names, medical file notes) is strictly prohibited in public job postings. Validations scan and reject submissions containing NRIC formats.
- **Shortlisted Backup Candidate Fallback**: When shortlisting applicants, companies can flag candidates as "Priority Backup Candidates". If a primary booking is cancelled, the company is instantly prompted with an **"Invite Backup Candidate"** workflow to confirm an alternate candidate immediately without re-advertising.
- **Native Android Packaging**: Powered by Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`) with `appId: 'com.budgetdekoo.app'` and `appName: 'Budget Dekoo'`.

---

## 2. Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript strict mode)
- **Styling**: Tailwind CSS + shadcn/ui design patterns + Lucide React icons
- **State & Forms**: React Hook Form + Zod schema validation
- **Backend & Database**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`), PostgreSQL 15+
- **Row-Level Security**: 100% RLS-enabled on all 10 schema tables
- **File Storage**: Supabase Private Buckets (`caregiver-documents`, `company-documents`) with 300-second short-lived signed URLs
- **Mobile Native Shell**: Capacitor 7 (Android platform configured in `/android`)

---

## 3. Database Architecture & Migrations

The database migration and seed files are located in `supabase/`:
- `supabase/migrations/001_budget_dekoo_mvp_schema.sql`: Full DDL, custom PostgreSQL enums, tables, check constraints, helper functions, and RLS policies.
- `supabase/seed.sql`: Realistic Malaysian test dataset (1 Admin, 2 Companies in Selangor/Penang, 4 Caregivers with nursing backgrounds, 4 Jobs, applications, confirmed and cancelled bookings, complaints, and audit logs).

### Core Tables
1. `profiles`: Central user accounts, roles (`company`, `caregiver`, `admin`), account status, PDPA consent timestamps.
2. `companies`: SSM registration number, address, state, city, verified_at, private SSM document path.
3. `caregivers`: Bio, experience, skills array, languages array, availability toggle, private CV and certificates storage paths.
4. `jobs`: Location, dates, shift duration, rate in MYR, responsibilities (patient NRIC prohibited), required skills/languages.
5. `applications`: Caregiver applications per job, cover note, status, `is_backup_candidate` flag, unique constraint on `(job_id, caregiver_id)`.
6. `bookings`: Confirmed shifts, agreed rate, dates, cancellation reason, cancelled_by.
7. `booking_status_history`: Complete audit trail of all booking status transitions.
8. `complaints`: Content moderation, reported jobs, dispute categories, official resolutions.
9. `notifications`: In-app notification center for status changes and reminders.
10. `audit_logs`: Immutable administrative audit trail.

---

## 4. Getting Started & Running Locally

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm 9+

### Installation
```bash
# Clone or navigate to the repository
cd "budget-deko"

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Android Build (Capacitor)

The project includes an initialized Android native project in `android/`:

```bash
# Sync web build assets with Capacitor
npm run build
npx cap sync android

# Open project in Android Studio
npx cap open android
```

Configuration is defined in `capacitor.config.ts`:
- **App ID**: `com.budgetdekoo.app`
- **App Name**: `Budget Dekoo`

---

## 6. Demo Account Switcher
For rapid evaluation and testing, the top navbar includes a built-in **"Test Account Switcher"** to toggle seamlessly between:
- **Datin Shireen Razak** (Damai Care Services Sdn Bhd — Verified Company, Selangor)
- **Marcus Lee** (Penang SilverCare — Verified Company, Penang)
- **Siti Nurhaliza** (Certified Staff Nurse, Petaling Jaya)
- **Tan Mei Ling** (Geriatric Caregiver, Cheras KL)
- **Hafiz bin Rahman** (Platform Admin, Full Access)

# caregiver
