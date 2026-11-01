'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createJobAction } from '@/app/actions/job-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PatientPrivacyWarning, PDPABanner } from '@/components/pdpa-banner';
import { 
  MALAYSIAN_STATES, 
  MALAYSIAN_CITIES, 
  CAREGIVER_SKILLS, 
  LANGUAGES, 
  WORK_ELIGIBILITY_OPTIONS 
} from '@/lib/malaysia-data';
import { JobStatus } from '@/lib/types/database.types';
import { 
  ArrowLeft, 
  Plus, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  Calculator, 
  Sparkles,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { formatMYR } from '@/lib/utils';

export default function NewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [locationState, setLocationState] = useState<string>('Selangor');
  const [locationCity, setLocationCity] = useState<string>('Petaling Jaya');
  const [locationArea, setLocationArea] = useState('Ara Damansara');
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [shiftDurationHours, setShiftDurationHours] = useState('8.0');
  const [shiftNotes, setShiftNotes] = useState('Day shift: 9:00 AM - 5:00 PM. Meals provided on site.');
  const [offeredRate, setOfferedRate] = useState('180');
  const [responsibilities, setResponsibilities] = useState('Administer daily prescribed oral medication, perform dressing changes, monitor and record vital signs twice daily, assist with assisted mobility.');
  const [requiredExperienceYears, setRequiredExperienceYears] = useState('2');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Palliative Care', 'Vital Signs Monitoring']);
  const [requiredLanguages, setRequiredLanguages] = useState<string[]>(['English', 'Bahasa Melayu']);
  const [workEligibility, setWorkEligibility] = useState('Malaysian Citizen (MyKad)');
  const [status, setStatus] = useState<JobStatus>('open');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live PDPA NRIC check
  const hasNricViolation = /\b\d{6}-\d{2}-\d{4}\b|\b\d{12}\b/.test(
    `${title} ${responsibilities} ${shiftNotes}`
  );

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleLanguage = (lang: string) => {
    setRequiredLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleStateChange = (newState: string) => {
    setLocationState(newState);
    const cities = MALAYSIAN_CITIES[newState] || [];
    setLocationCity(cities[0] || '');
  };

  // Hourly rate preview calculation
  const numericRate = parseFloat(offeredRate) || 0;
  const numericHours = parseFloat(shiftDurationHours) || 8;
  const hourlyRate = numericHours > 0 ? (numericRate / numericHours).toFixed(2) : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const companyId = '10000000-0000-0000-0000-000000000001';

    const res = await createJobAction({
      companyId,
      title,
      locationState,
      locationCity,
      locationArea,
      startDate,
      endDate,
      shiftDurationHours: parseFloat(shiftDurationHours),
      shiftNotes,
      offeredRate: parseFloat(offeredRate),
      responsibilities,
      requiredExperienceYears: parseInt(requiredExperienceYears, 10),
      requiredSkills,
      requiredLanguages,
      workEligibilityRequirements: workEligibility,
      status,
    });

    setLoading(false);

    if (res.success) {
      router.push('/company/jobs');
      router.refresh();
    } else {
      setError(res.error || 'Failed to publish job posting');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <Link href="/company/jobs" className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Caregiving Shift Posting</h1>
          <p className="text-xs text-slate-500">Reach verified Malaysian caregivers with transparent shift parameters</p>
        </div>
      </div>

      <PatientPrivacyWarning />

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Card 1: Shift Title & Location */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Shift Title & Location</h2>
              <p className="text-xs text-slate-500 mt-0.5">Specify clinical role title and Malaysian district</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Step 1 of 3
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Home Nurse for Palliative Care"
              className="rounded-xl h-11 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Malaysian State</label>
              <select
                value={locationState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                {MALAYSIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">City / District</label>
              <select
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                {(MALAYSIAN_CITIES[locationState] || []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Area / Neighborhood</label>
              <Input
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                placeholder="e.g. Ara Damansara / SS15"
                className="rounded-xl h-11 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Schedule & Real-Time Rate Calculator */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Schedule & Rate Calculator</h2>
              <p className="text-xs text-slate-500 mt-0.5">Define shift duration and offered Ringgit compensation</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Step 2 of 3
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Start Date <span className="text-rose-500">*</span></label>
              <Input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl h-11 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">End Date <span className="text-rose-500">*</span></label>
              <Input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl h-11 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Duration per Shift (Hours) <span className="text-rose-500">*</span></label>
              <Input
                type="number"
                step="0.5"
                min="1"
                max="24"
                required
                value={shiftDurationHours}
                onChange={(e) => setShiftDurationHours(e.target.value)}
                className="rounded-xl h-11 text-xs"
              />
            </div>
          </div>

          {/* Rate + Real-Time Rate Calculator Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="font-bold text-emerald-950 text-xs">
                Offered Rate per Shift (MYR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-3 font-bold text-slate-400">RM</span>
                <Input
                  type="number"
                  min="50"
                  required
                  value={offeredRate}
                  onChange={(e) => setOfferedRate(e.target.value)}
                  className="pl-12 rounded-xl h-11 text-sm font-bold text-emerald-900 bg-white"
                />
              </div>
            </div>

            <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200/80 text-right sm:self-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Breakdown</span>
              <p className="text-sm font-black text-emerald-700">
                RM {hourlyRate} <span className="text-[10px] text-slate-500 font-normal">/ hour</span>
              </p>
              <p className="text-[10px] text-slate-400">Based on {numericHours} hrs per shift</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Shift Notes & Logistics</label>
            <Input
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              placeholder="e.g. Day shift: 9:00 AM - 5:00 PM. Meals provided on site."
              className="rounded-xl h-11 text-xs"
            />
          </div>
        </div>

        {/* Card 3: Clinical Duties & Live PDPA Compliance Indicator */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Care Responsibilities & Skills</h2>
              <p className="text-xs text-slate-500 mt-0.5">Describe clinical procedures and required languages</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Step 3 of 3
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">
                Clinical Responsibilities <span className="text-rose-500">*</span>
              </label>
              
              {/* Live PDPA compliance check indicator */}
              <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                hasNricViolation 
                  ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{hasNricViolation ? '⚠️ Patient NRIC detected (prohibited)' : '✓ PDPA Compliant (no patient IC)'}</span>
              </div>
            </div>

            <Textarea
              required
              rows={4}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="rounded-2xl text-xs"
            />
          </div>

          {/* Skills checklist */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700">
              Required Care Skills ({requiredSkills.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {CAREGIVER_SKILLS.map((skill) => {
                const selected = requiredSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
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
            <label className="font-bold text-slate-700">Required Spoken Dialects</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const selected = requiredLanguages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-teal-50 text-teal-800 border-teal-300 font-bold shadow-2xs'
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

          {/* Work Eligibility & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Required Work Eligibility</label>
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

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Publication Status</label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'open'}
                    onChange={() => setStatus('open')}
                    className="text-emerald-600"
                  />
                  <span>Publish Immediately (Open)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="text-emerald-600"
                  />
                  <span>Save Draft</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/company/jobs"
            className="px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-xs"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={loading || hasNricViolation}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            {loading ? 'Publishing Shift...' : 'Publish Care Shift'}
          </Button>
        </div>
      </form>

    </div>
  );
}
