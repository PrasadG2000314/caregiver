-- =============================================================================
-- Seed: supabase/seed.sql
-- Description: Realistic Fictional Malaysian Seed Data for Budget Dekoo
-- =============================================================================

-- Deterministic UUIDs for reference
DO $$
DECLARE
    -- Admin
    admin_id UUID := '00000000-0000-0000-0000-000000000001';

    -- Companies
    comp1_id UUID := '10000000-0000-0000-0000-000000000001';
    comp2_id UUID := '10000000-0000-0000-0000-000000000002';

    -- Caregivers
    cg1_id UUID := '20000000-0000-0000-0000-000000000001';
    cg2_id UUID := '20000000-0000-0000-0000-000000000002';
    cg3_id UUID := '20000000-0000-0000-0000-000000000003';
    cg4_id UUID := '20000000-0000-0000-0000-000000000004';

    -- Jobs
    job1_id UUID := '30000000-0000-0000-0000-000000000001';
    job2_id UUID := '30000000-0000-0000-0000-000000000002';
    job3_id UUID := '30000000-0000-0000-0000-000000000003';
    job4_id UUID := '30000000-0000-0000-0000-000000000004';

    -- Applications
    app1_id UUID := '40000000-0000-0000-0000-000000000001';
    app2_id UUID := '40000000-0000-0000-0000-000000000002';
    app3_id UUID := '40000000-0000-0000-0000-000000000003';
    app4_id UUID := '40000000-0000-0000-0000-000000000004';

    -- Bookings
    booking1_id UUID := '50000000-0000-0000-0000-000000000001';
    booking2_id UUID := '50000000-0000-0000-0000-000000000002';

BEGIN
    -- 1. Create Profiles
    -- Admin
    INSERT INTO public.profiles (id, role, email, full_name, phone, account_status, verification_status, pdpa_consent_at)
    VALUES (admin_id, 'admin', 'admin@budgetdekoo.my', 'Hafiz bin Rahman (Platform Admin)', '+60129998888', 'active', 'verified', now())
    ON CONFLICT (id) DO NOTHING;

    -- Companies
    INSERT INTO public.profiles (id, role, email, full_name, phone, account_status, verification_status, pdpa_consent_at)
    VALUES 
        (comp1_id, 'company', 'admin@damaicare.com.my', 'Datin Shireen Razak (Damai Care)', '+60378881234', 'active', 'verified', now()),
        (comp2_id, 'company', 'ops@silvercarepenang.com', 'Marcus Lee (Penang SilverCare)', '+6042228999', 'active', 'verified', now())
    ON CONFLICT (id) DO NOTHING;

    -- Caregivers
    INSERT INTO public.profiles (id, role, email, full_name, phone, account_status, verification_status, pdpa_consent_at)
    VALUES 
        (cg1_id, 'caregiver', 'siti.nurhaliza@gmail.com', 'Siti Nurhaliza binti Ishak', '+60123456781', 'active', 'verified', now()),
        (cg2_id, 'caregiver', 'meiling.tan@yahoo.com', 'Tan Mei Ling', '+60123456782', 'active', 'verified', now()),
        (cg3_id, 'caregiver', 'kavitha.raj@outlook.com', 'Kavitha a/p Rajendran', '+60123456783', 'active', 'verified', now()),
        (cg4_id, 'caregiver', 'fadhil.zakaria@gmail.com', 'Ahmad Fadhil bin Zakaria', '+60123456784', 'active', 'verified', now())
    ON CONFLICT (id) DO NOTHING;

    -- 2. Create Company Details
    INSERT INTO public.companies (id, company_name, registration_number, address, state, city, description, verification_document_path, verified_by, verified_at)
    VALUES 
        (comp1_id, 'Damai Care Services Sdn Bhd', '202101099881 (1420181-T)', 'Level 5, Oasis Square, Ara Damansara', 'Selangor', 'Petaling Jaya', 'Premier home caregiving and hospice nursing agency serving the Klang Valley.', 'company-documents/comp1/ssm_cert.pdf', admin_id, now()),
        (comp2_id, 'Penang SilverCare Wellness Hub', '201901044552 (1350022-P)', '18 Jalan Kelawai, Pulau Tikus', 'Penang', 'Georgetown', 'Specialized geriatric care, dementia support, and stroke rehabilitation provider in Northern Malaysia.', 'company-documents/comp2/ssm_cert.pdf', admin_id, now())
    ON CONFLICT (id) DO NOTHING;

    -- 3. Create Caregiver Details
    INSERT INTO public.caregivers (id, bio, years_experience, skills, languages, availability_status, availability_notes, preferred_locations, cv_storage_path, work_eligibility)
    VALUES 
        (cg1_id, 'Certified staff nurse with 6 years experience in hospital palliative wards and private home care.', 6, ARRAY['Palliative Care', 'Wound Care', 'Tracheostomy Care', 'Vital Signs Monitoring'], ARRAY['English', 'Bahasa Melayu'], true, 'Available Monday to Friday day shifts.', ARRAY['Petaling Jaya', 'Subang Jaya', 'Shah Alam'], 'caregiver-documents/cg1/cv_siti.pdf', 'Malaysian Citizen (MyKad)'),
        (cg2_id, 'Dedicated senior companion and dementia care specialist. Trained in sensory therapy and nutritional meal prep.', 4, ARRAY['Dementia & Alzheimer''s Care', 'Medication Administration', 'Elderly Companion', 'Meal Preparation'], ARRAY['English', 'Mandarin', 'Cantonese', 'Bahasa Melayu'], true, 'Available for weekends and overnight shifts.', ARRAY['Kuala Lumpur', 'Cheras', 'Petaling Jaya'], 'caregiver-documents/cg2/cv_meiling.pdf', 'Malaysian Citizen (MyKad)'),
        (cg3_id, 'Physical therapy assistant specializing in post-stroke recovery, bed-to-chair transfers, and range of motion.', 3, ARRAY['Post-Stroke Rehabilitation', 'Physical Mobility Assistance', 'Feeding Assistance', 'Vital Signs Monitoring'], ARRAY['English', 'Bahasa Melayu', 'Tamil'], true, 'Available for full-time 8-hour daily shifts.', ARRAY['Klang', 'Shah Alam', 'Subang Jaya'], 'caregiver-documents/cg3/cv_kavitha.pdf', 'Malaysian Citizen (MyKad)'),
        (cg4_id, 'Compassionate male healthcare assistant focused on post-operative recuperation and vital sign logs.', 2, ARRAY['General Elderly Care', 'Post-Operative Recovery', 'Bedside Nursing'], ARRAY['Bahasa Melayu', 'English'], false, 'Currently committed to private case until end of month.', ARRAY['Georgetown', 'Bayan Lepas'], 'caregiver-documents/cg4/cv_fadhil.pdf', 'Malaysian Citizen (MyKad)')
    ON CONFLICT (id) DO NOTHING;

    -- 4. Create Jobs
    INSERT INTO public.jobs (id, company_id, title, location_state, location_city, location_area, start_date, end_date, shift_duration_hours, shift_notes, offered_rate, responsibilities, required_experience_years, required_skills, required_languages, work_eligibility_requirements, status)
    VALUES 
        (job1_id, comp1_id, 'Senior Palliative Home Care Assistant', 'Selangor', 'Petaling Jaya', 'Ara Damansara', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '10 days', 8.0, 'Day shift: 9:00 AM - 5:00 PM. Lunch provided on site.', 180.00, 'Administer daily prescribed oral medication, perform dressing changes, monitor and record vital signs twice daily, assist with assisted mobility.', 3, ARRAY['Palliative Care', 'Wound Care', 'Vital Signs Monitoring'], ARRAY['English', 'Bahasa Melayu'], 'Malaysian Citizen (MyKad)', 'open'),
        (job2_id, comp1_id, 'Night Shift Elderly Companion & Monitor', 'Selangor', 'Subang Jaya', 'SS15', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '5 days', 10.0, 'Overnight shift: 9:00 PM - 7:00 AM. Private caregiver bedroom provided.', 150.00, 'Bedside overnight monitoring, assisting with bathroom trips, morning vitals logging.', 2, ARRAY['Dementia & Alzheimer''s Care', 'Elderly Companion'], ARRAY['English', 'Mandarin'], 'Malaysian Citizen (MyKad)', 'filled'),
        (job3_id, comp2_id, 'Post-Stroke Mobility & Therapy Care Assistant', 'Penang', 'Georgetown', 'Pulau Tikus', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '21 days', 8.0, 'Daily sessions: 10:00 AM - 6:00 PM. Close coordination with family physiotherapist.', 220.00, 'Guide stroke recovery exercises, assist wheelchair transfers, record daily mobility milestones, meal assistance.', 3, ARRAY['Post-Stroke Rehabilitation', 'Physical Mobility Assistance'], ARRAY['English', 'Bahasa Melayu'], 'Malaysian Citizen (MyKad)', 'open'),
        (job4_id, comp2_id, 'Weekend Respite Caregiver', 'Penang', 'Bayan Lepas', 'Bayan Baru', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', 6.0, 'Weekend respite: Saturday and Sunday 1:00 PM - 7:00 PM.', 160.00, 'Provide companionship, prepare afternoon tea and medication, engage in light cognitive games.', 1, ARRAY['General Elderly Care', 'Elderly Companion'], ARRAY['English', 'Mandarin'], 'Malaysian Citizen (MyKad)', 'draft')
    ON CONFLICT (id) DO NOTHING;

    -- 5. Create Applications
    INSERT INTO public.applications (id, job_id, caregiver_id, cover_note, status, is_backup_candidate)
    VALUES 
        (app1_id, job1_id, cg1_id, 'I have extensive palliative nursing experience in Petaling Jaya and live 10 minutes away from Ara Damansara.', 'shortlisted', true),
        (app2_id, job1_id, cg2_id, 'Experienced in palliative companion care and nutritional support. Flexible to start immediately.', 'selected', false),
        (app3_id, job2_id, cg3_id, 'Ready for night shift care. Proven track record with overnight monitoring.', 'selected', false),
        (app4_id, job3_id, cg4_id, 'Penang-based healthcare assistant. Excited to assist with post-stroke rehabilitation program.', 'applied', false)
    ON CONFLICT (id) DO NOTHING;

    -- 6. Create Bookings
    -- Active confirmed booking for Job 2
    INSERT INTO public.bookings (id, job_id, application_id, company_id, caregiver_id, start_date, end_date, agreed_rate, currency, status)
    VALUES 
        (booking1_id, job2_id, app3_id, comp1_id, cg3_id, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '5 days', 150.00, 'MYR', 'confirmed')
    ON CONFLICT (id) DO NOTHING;

    -- Previously cancelled booking showing backup flow audit
    INSERT INTO public.bookings (id, job_id, application_id, company_id, caregiver_id, start_date, end_date, agreed_rate, currency, status, cancellation_reason, cancelled_by)
    VALUES 
        (booking2_id, job1_id, app1_id, comp1_id, cg1_id, CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '10 days', 180.00, 'MYR', 'cancelled', 'Client family requested female caregiver fluent in Mandarin; Siti retained in priority backup candidate pool.', comp1_id)
    ON CONFLICT (id) DO NOTHING;

    -- 7. Booking Status History
    INSERT INTO public.booking_status_history (booking_id, old_status, new_status, changed_by, reason)
    VALUES 
        (booking1_id, NULL, 'confirmed', comp1_id, 'Application confirmed by Damai Care operations manager.'),
        (booking2_id, 'confirmed', 'cancelled', comp1_id, 'Language requirement adjustment; backup candidate selection triggered.')
    ON CONFLICT DO NOTHING;

    -- 8. Sample Complaint
    INSERT INTO public.complaints (reporter_id, reported_user_id, reported_job_id, category, description, status, resolution_notes, resolved_by, resolved_at)
    VALUES 
        (cg4_id, comp2_id, job3_id, 'Job Specifications Inquiry', 'Initial job description did not specify need for personal transport between therapy clinic and residence.', 'under_review', 'Admin contacted SilverCare; mileage compensation clause added to shift notes.', admin_id, now())
    ON CONFLICT DO NOTHING;

    -- 9. Notifications
    INSERT INTO public.notifications (user_id, title, message, link)
    VALUES 
        (cg1_id, 'Status Update: Shortlisted as Backup Candidate', 'Damai Care has designated you as the priority backup candidate for Senior Palliative Home Care Assistant.', '/caregiver/applications'),
        (cg3_id, 'Booking Confirmed!', 'Your booking for Night Shift Companion in Subang Jaya has been confirmed at RM150/shift.', '/caregiver/bookings'),
        (comp1_id, 'New Application Received', 'Tan Mei Ling has applied to Senior Palliative Home Care Assistant.', '/company/jobs')
    ON CONFLICT DO NOTHING;

    -- 10. Audit Log
    INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
    VALUES 
        (admin_id, 'VERIFY_COMPANY', 'companies', comp1_id, '{"notes": "SSM document verified against Suruhanjaya Syarikat Malaysia registry."}'::jsonb),
        (admin_id, 'VERIFY_COMPANY', 'companies', comp2_id, '{"notes": "SSM registration and health license verified."}'::jsonb),
        (comp1_id, 'CONFIRM_BOOKING', 'bookings', booking1_id, '{"caregiver_id": "20000000-0000-0000-0000-000000000003", "rate": 150.00}'::jsonb)
    ON CONFLICT DO NOTHING;

END $$;

