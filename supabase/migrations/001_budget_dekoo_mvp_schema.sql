-- =============================================================================
-- Migration: 001_budget_dekoo_mvp_schema.sql
-- Description: Complete Database Schema, Enums, Tables, and RLS for Budget Dekoo
-- =============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enumerations
CREATE TYPE user_role AS ENUM (
    'company',
    'caregiver',
    'admin'
);

CREATE TYPE account_status AS ENUM (
    'pending',
    'active',
    'suspended',
    'flagged',
    'deleted'
);

CREATE TYPE verification_status AS ENUM (
    'unverified',
    'pending_review',
    'verified',
    'rejected'
);

CREATE TYPE job_status AS ENUM (
    'draft',
    'open',
    'filled',
    'cancelled'
);

CREATE TYPE application_status AS ENUM (
    'applied',
    'shortlisted',
    'selected',
    'rejected',
    'withdrawn'
);

CREATE TYPE booking_status AS ENUM (
    'confirmed',
    'completed',
    'cancelled'
);

CREATE TYPE complaint_status AS ENUM (
    'open',
    'under_review',
    'resolved',
    'dismissed'
);

-- =============================================================================
-- 3. Core Tables
-- =============================================================================

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'caregiver',
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT, -- Restricted under PDPA
    account_status account_status NOT NULL DEFAULT 'active',
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    pdpa_consent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: companies
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    registration_number TEXT NOT NULL, -- SSM Number (e.g. 202301012345 (1234567-A))
    address TEXT,
    state TEXT NOT NULL, -- Malaysian State (e.g. Selangor, Kuala Lumpur, Penang, Johor)
    city TEXT NOT NULL,
    description TEXT,
    verification_document_path TEXT, -- Private bucket path to SSM cert
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: caregivers
CREATE TABLE IF NOT EXISTS public.caregivers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    years_experience INT NOT NULL DEFAULT 0,
    skills TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{}',
    availability_status BOOLEAN NOT NULL DEFAULT true,
    availability_notes TEXT,
    preferred_locations TEXT[] NOT NULL DEFAULT '{}',
    cv_storage_path TEXT, -- Private bucket path to resume
    certificates_storage_paths JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of certificate metadata & paths
    work_eligibility TEXT NOT NULL DEFAULT 'Malaysian Citizen (MyKad)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: jobs
-- Strict rule: Prohibit storing or displaying identifiable patient information
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location_state TEXT NOT NULL,
    location_city TEXT NOT NULL,
    location_area TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    shift_duration_hours NUMERIC(4,1) NOT NULL DEFAULT 8.0,
    shift_notes TEXT,
    offered_rate NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MYR',
    responsibilities TEXT NOT NULL,
    required_experience_years INT NOT NULL DEFAULT 0,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    required_languages TEXT[] NOT NULL DEFAULT '{}',
    work_eligibility_requirements TEXT,
    status job_status NOT NULL DEFAULT 'draft',
    is_reported BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Data integrity: start_date must not be after end_date
    CONSTRAINT check_dates CHECK (start_date <= end_date),
    -- Data integrity: rates must be positive
    CONSTRAINT check_rate CHECK (offered_rate > 0)
);

-- Table: applications
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
    cover_note TEXT,
    status application_status NOT NULL DEFAULT 'applied',
    is_backup_candidate BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Strict prevention of duplicate applications
    CONSTRAINT unique_job_caregiver_application UNIQUE (job_id, caregiver_id)
);

-- Table: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE RESTRICT,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE RESTRICT,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
    caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    agreed_rate NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MYR',
    status booking_status NOT NULL DEFAULT 'confirmed',
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: booking_status_history
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    old_status booking_status,
    new_status booking_status NOT NULL,
    changed_by UUID REFERENCES public.profiles(id),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: complaints
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status complaint_status NOT NULL DEFAULT 'open',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- 4. Helper Security Functions (Used in RLS Policies)
-- =============================================================================

-- Get the active user's role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND account_status = 'active'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is an active & verified company
CREATE OR REPLACE FUNCTION public.is_verified_company()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() 
          AND role = 'company' 
          AND account_status = 'active' 
          AND verification_status = 'verified'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user has permission to view caregiver's contact and documents
CREATE OR REPLACE FUNCTION public.can_view_caregiver_contact(p_caregiver_id UUID)
RETURNS BOOLEAN AS $$
    SELECT (
        -- 1. Self access
        auth.uid() = p_caregiver_id
        OR
        -- 2. Platform admin access
        public.is_admin()
        OR
        -- 3. Verified company with active application access
        EXISTS (
            SELECT 1 
            FROM public.applications a
            JOIN public.jobs j ON a.job_id = j.id
            WHERE a.caregiver_id = p_caregiver_id
              AND j.company_id = auth.uid()
              AND public.is_verified_company()
        )
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================================================
-- 5. Row-Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5.2 Companies Policies
CREATE POLICY "Company profiles viewable by authenticated users"
    ON public.companies FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Companies can manage their own profile"
    ON public.companies FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to companies"
    ON public.companies FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5.3 Caregivers Policies
CREATE POLICY "Public caregiver details viewable by authenticated users"
    ON public.caregivers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Caregivers can update their own details"
    ON public.caregivers FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to caregivers"
    ON public.caregivers FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5.4 Jobs Policies
CREATE POLICY "Active open jobs are viewable by authenticated users"
    ON public.jobs FOR SELECT
    TO authenticated
    USING (
        status = 'open' 
        OR company_id = auth.uid() 
        OR public.is_admin()
    );

CREATE POLICY "Companies can manage their own jobs"
    ON public.jobs FOR ALL
    TO authenticated
    USING (company_id = auth.uid())
    WITH CHECK (company_id = auth.uid());

CREATE POLICY "Admins have full access to jobs"
    ON public.jobs FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5.5 Applications Policies
CREATE POLICY "Caregivers can view and manage their own applications"
    ON public.applications FOR ALL
    TO authenticated
    USING (caregiver_id = auth.uid())
    WITH CHECK (caregiver_id = auth.uid());

CREATE POLICY "Companies can view applications to their jobs"
    ON public.applications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE jobs.id = applications.job_id
              AND jobs.company_id = auth.uid()
        )
    );

CREATE POLICY "Companies can update application status for their jobs"
    ON public.applications FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE jobs.id = applications.job_id
              AND jobs.company_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE jobs.id = applications.job_id
              AND jobs.company_id = auth.uid()
        )
    );

CREATE POLICY "Admins have full access to applications"
    ON public.applications FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5.6 Bookings Policies
CREATE POLICY "Parties involved can view bookings"
    ON public.bookings FOR SELECT
    TO authenticated
    USING (
        company_id = auth.uid() 
        OR caregiver_id = auth.uid() 
        OR public.is_admin()
    );

CREATE POLICY "Companies can create and update bookings"
    ON public.bookings FOR ALL
    TO authenticated
    USING (company_id = auth.uid() OR public.is_admin())
    WITH CHECK (company_id = auth.uid() OR public.is_admin());

CREATE POLICY "Caregivers can update status of their bookings (e.g. cancel)"
    ON public.bookings FOR UPDATE
    TO authenticated
    USING (caregiver_id = auth.uid())
    WITH CHECK (caregiver_id = auth.uid());

-- 5.7 Booking Status History Policies
CREATE POLICY "Parties involved can view booking history"
    ON public.booking_status_history FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_status_history.booking_id
              AND (b.company_id = auth.uid() OR b.caregiver_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Authenticated users involved can insert status history"
    ON public.booking_status_history FOR INSERT
    TO authenticated
    WITH CHECK (changed_by = auth.uid());

-- 5.8 Complaints Policies
CREATE POLICY "Users can view complaints they filed"
    ON public.complaints FOR SELECT
    TO authenticated
    USING (reporter_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated users can submit complaints"
    ON public.complaints FOR INSERT
    TO authenticated
    WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can manage complaints"
    ON public.complaints FOR ALL
    TO authenticated
    USING (public.is_admin());

-- 5.9 Notifications Policies
CREATE POLICY "Users can view and manage their own notifications"
    ON public.notifications FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 5.10 Audit Logs Policies
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "System and authenticated actions can insert audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (actor_id = auth.uid() OR public.is_admin());

-- =============================================================================
-- 6. Storage Buckets Configuration
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('caregiver-documents', 'caregiver-documents', false),
    ('company-documents', 'company-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies: caregiver-documents
CREATE POLICY "Caregiver owns documents or admin reads"
    ON storage.objects FOR ALL
    TO authenticated
    USING (
        bucket_id = 'caregiver-documents' 
        AND (
            (storage.foldername(name))[1] = auth.uid()::text 
            OR public.is_admin()
        )
    );

-- Storage Policies: company-documents
CREATE POLICY "Company owns documents or admin reads"
    ON storage.objects FOR ALL
    TO authenticated
    USING (
        bucket_id = 'company-documents' 
        AND (
            (storage.foldername(name))[1] = auth.uid()::text 
            OR public.is_admin()
        )
    );

