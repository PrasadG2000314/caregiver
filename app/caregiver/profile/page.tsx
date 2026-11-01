'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCaregiverProfileAction } from '@/app/actions/profile-actions';
import { CAREGIVER_SKILLS, LANGUAGES, MALAYSIAN_STATES, WORK_ELIGIBILITY_OPTIONS } from '@/lib/malaysia-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  Check, 
  CheckCircle2, 
  Clock, 
  Download,
  AlertCircle,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  Award
} from 'lucide-react';

export default function CaregiverProfilePage() {
  const router = useRouter();

  // Initial State matching Siti Nurhaliza (Seed Caregiver 1)
  const [caregiverId] = useState('20000000-0000-0000-0000-000000000001');
  const [bio, setBio] = useState(
    'Certified staff nurse with 6 years experience in hospital palliative wards and private home care in Klang Valley.'
  );
  const [yearsExperience, setYearsExperience] = useState('6');
  const [skills, setSkills] = useState<string[]>([
    'Palliative Care',
    'Wound Care & Dressing',
    'Tracheostomy Care',
    'Vital Signs Monitoring',
  ]);
  const [languages, setLanguages] = useState<string[]>(['English', 'Bahasa Melayu']);
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
  const [availabilityNotes, setAvailabilityNotes] = useState('Available Monday to Friday day shifts. Has own transport.');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['Petaling Jaya', 'Subang Jaya', 'Shah Alam']);
  const [workEligibility, setWorkEligibility] = useState('Malaysian Citizen (MyKad)');

  // Document states
  const [cvPath] = useState('caregiver-documents/cg1/cv_siti.pdf');
  const [certificates] = useState([
    { name: 'Malaysian Nursing Board Certificate', issuer: 'Lembaga Jururawat Malaysia', year: 2018, path: 'caregiver-documents/cg1/mnb_cert.pdf' },
    { name: 'Basic Life Support (BLS)', issuer: 'National Heart Association of Malaysia', year: 2023, path: 'caregiver-documents/cg1/bls.pdf' },
  ]);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const res = await updateCaregiverProfileAction(caregiverId, {
      bio,
      years_experience: parseInt(yearsExperience, 10),
      skills,
      languages,
      availability_status: availabilityStatus,
      availability_notes: availabilityNotes,
      preferred_locations: preferredLocations,
      work_eligibility: workEligibility,
    });

    setSaving(false);
    if (res.success) {
      setSuccess(true);
      router.refresh();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20 shrink-0">
            SN
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Siti Nurhaliza binti Ishak</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Staff Nurse
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{yearsExperience} Years Experience</span>
              <span>•</span>
              <span>{workEligibility}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Petaling Jaya, Selangor</span>
            </p>
          </div>
        </div>

        {/* Availability Toggle Switch */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="block text-xs font-bold text-slate-900">Shift Availability</span>
            <span className={`text-[10px] font-bold ${availabilityStatus ? 'text-emerald-700' : 'text-slate-400'}`}>
              {availabilityStatus ? 'Accepting Shift Requests' : 'Paused / Unavailable'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAvailabilityStatus(!availabilityStatus)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              availabilityStatus ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                availabilityStatus ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <PDPABanner compact />

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Your professional caregiver profile has been successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Professional Bio & Scheduling */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Healthcare Experience & Scheduling</h2>
            <p className="text-xs text-slate-500 mt-0.5">Summary of clinical background, years in practice, and availability terms</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Years of Clinical Experience</label>
              <Input
                type="number"
                min="0"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="rounded-xl h-11 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Work Eligibility (Malaysia)</label>
              <select
                value={workEligibility}
                onChange={(e) => setWorkEligibility(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {WORK_ELIGIBILITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Professional Bio & Scope</label>
            <Textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Schedule & Mobility Notes</label>
            <Input
              value={availabilityNotes}
              onChange={(e) => setAvailabilityNotes(e.target.value)}
              placeholder="e.g. Available weekdays 9AM-5PM in Klang Valley. Own car available."
              className="rounded-xl h-11 text-xs"
            />
          </div>
        </div>

        {/* Section 2: Clinical Competencies Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">2. Care Procedures & Dialects</h2>
            <p className="text-xs text-slate-500 mt-0.5">Toggle clinical procedures and languages you are certified to handle</p>
          </div>

          {/* Skills checklist */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Care Skills ({skills.length} Selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {CAREGIVER_SKILLS.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages checklist */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Spoken Languages & Dialects</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const selected = languages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-teal-50 text-teal-900 border-teal-300 font-bold shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Private Document Vault */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>3. Verified Credentials (Private Storage)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Stored securely in bucket `caregiver-documents`. Served via 300s signed URLs only to verified agencies.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* CV */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Curriculum Vitae (Nursing & Caregiving CV)</p>
                  <p className="text-[11px] text-slate-400 font-mono">{cvPath}</p>
                </div>
              </div>

              <a
                href={`/api/documents/download?bucket=caregiver-documents&path=${encodeURIComponent(cvPath)}&token=auth_demo&expires=${Date.now() + 300000}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-emerald-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View PDF</span>
              </a>
            </div>

            {/* Certs */}
            {certificates.map((cert) => (
              <div key={cert.name} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-xs text-slate-900">{cert.name}</p>
                  <p className="text-[11px] text-slate-500">{cert.issuer} • Issued {cert.year}</p>
                </div>

                <a
                  href={`/api/documents/download?bucket=caregiver-documents&path=${encodeURIComponent(cert.path)}&token=auth_demo&expires=${Date.now() + 300000}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-emerald-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Verify Credential</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>

      </form>

    </div>
  );
}
