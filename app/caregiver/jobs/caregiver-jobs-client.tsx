'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job, Company, Application } from '@/lib/types/database.types';
import { applyToJobAction } from '@/app/actions/application-actions';
import { reportJobAction } from '@/app/actions/job-actions';
import { formatMYR } from '@/lib/utils';
import { MALAYSIAN_STATES } from '@/lib/malaysia-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/dialog';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Flag,
  Send,
  Check,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface Props {
  jobs: (Job & { company: Company })[];
  myApplications: Application[];
  caregiverId: string;
}

const QUICK_FILTERS = [
  { label: 'All Shifts', skill: '' },
  { label: 'Palliative Care', skill: 'Palliative Care' },
  { label: 'Wound Care', skill: 'Wound Care' },
  { label: 'Dementia & Alzheimer\'s', skill: 'Dementia' },
  { label: 'Stroke Rehabilitation', skill: 'Post-Stroke' },
  { label: 'Overnight / 10+ hrs', minDuration: 10 },
  { label: 'High Rate (RM 200+)', minRateVal: 200 },
];

export function CaregiverJobsClient({ jobs, myApplications, caregiverId }: Props) {
  const router = useRouter();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [minRate, setMinRate] = useState<string>('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('All Shifts');

  // Modals
  const [applyModalJob, setApplyModalJob] = useState<(Job & { company: Company }) | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Reporting
  const [reportModalJob, setReportModalJob] = useState<Job | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  const handleQuickFilterClick = (filter: typeof QUICK_FILTERS[0]) => {
    setActiveQuickFilter(filter.label);
    if (filter.minRateVal) {
      setMinRate(filter.minRateVal.toString());
      setSearchTerm('');
    } else if (filter.skill) {
      setSearchTerm(filter.skill);
      setMinRate('');
    } else {
      setSearchTerm('');
      setMinRate('');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedState !== 'all' && job.location_state !== selectedState) return false;
    if (minRate && job.offered_rate < parseFloat(minRate)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(term);
      const matchCity = job.location_city.toLowerCase().includes(term);
      const matchSkills = job.required_skills.some(s => s.toLowerCase().includes(term));
      if (!matchTitle && !matchCity && !matchSkills) return false;
    }
    return true;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;

    setApplying(true);
    setApplyError(null);

    const res = await applyToJobAction(applyModalJob.id, caregiverId, coverNote);
    setApplying(false);

    if (res.success) {
      setApplySuccess(`Application successfully submitted for "${applyModalJob.title}". Duplicate submission is strictly locked.`);
      setApplyModalJob(null);
      setCoverNote('');
      router.refresh();
    } else {
      setApplyError(res.error || 'Failed to submit application.');
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalJob) return;

    setReporting(true);
    await reportJobAction(reportModalJob.id, caregiverId, reportReason);
    setReporting(false);
    alert('Thank you. This job posting has been reported for moderation review.');
    setReportModalJob(null);
    setReportReason('');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      
      {applySuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{applySuccess}</span>
          </div>
          <button onClick={() => setApplySuccess(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter:
        </span>
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf.label}
            onClick={() => handleQuickFilterClick(qf)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeQuickFilter === qf.label
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Search & Location Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveQuickFilter('');
            }}
            placeholder="Search procedure, skill or district (e.g. PJ, Wound)..."
            className="pl-10 text-xs bg-slate-50/50 border-slate-200 rounded-xl"
          />
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="all">📍 All Malaysian States</option>
            {MALAYSIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Input
            type="number"
            value={minRate}
            onChange={(e) => {
              setMinRate(e.target.value);
              setActiveQuickFilter('');
            }}
            placeholder="Min Rate (e.g. 180 MYR)"
            className="text-xs bg-slate-50/50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Shift Listings Feed */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs space-y-2">
          <p className="font-semibold text-slate-700 text-sm">No care shifts match your current filters</p>
          <p className="text-slate-400">Try clearing your search terms or expanding your state selection.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedState('all');
              setMinRate('');
              setActiveQuickFilter('All Shifts');
            }}
            className="mt-3 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const existingApp = myApplications.find(a => a.job_id === job.id);
            const hasApplied = !!existingApp;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover-lift transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  {/* Title & Agency */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                      {job.title}
                    </h3>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.company.company_name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> SSM Verified
                    </span>
                  </div>

                  {/* Clinical Scope Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {job.responsibilities}
                  </p>

                  {/* Schedule & Location Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location_area ? `${job.location_area}, ` : ''}{job.location_city}, {job.location_state}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {job.start_date} to {job.end_date}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.shift_duration_hours} hrs/shift
                    </span>
                  </div>

                  {job.shift_notes && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/60">
                      Logistics: {job.shift_notes}
                    </p>
                  )}

                  {/* Skills & Dialects Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {job.required_skills.map((s) => (
                      <span key={s} className="text-[11px] bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-md border border-teal-100 font-medium">
                        {s}
                      </span>
                    ))}
                    {job.required_languages.map((l) => (
                      <span key={l} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                        🗣️ {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Rates & Action Section */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-2xl font-black text-emerald-700 tracking-tight">
                      {formatMYR(job.offered_rate)}
                    </span>
                    <p className="text-[11px] font-medium text-slate-400">per shift (MYR)</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReportModalJob(job)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                      title="Report Job for Patient Privacy or Rule Violation"
                    >
                      <Flag className="w-4 h-4" />
                    </button>

                    {hasApplied ? (
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Applied ({existingApp?.status})</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setApplyModalJob(job);
                          setApplyError(null);
                        }}
                        className="text-xs font-semibold gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/20 px-5 py-2.5 rounded-xl"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply for Shift</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={!!applyModalJob}
        onClose={() => setApplyModalJob(null)}
        title={`Apply for ${applyModalJob?.title || 'Shift'}`}
        description={`Agency: ${applyModalJob?.company.company_name} • Offered Rate: ${applyModalJob ? formatMYR(applyModalJob.offered_rate) : ''}/shift`}
        className="max-w-lg"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
          {applyError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{applyError}</span>
            </div>
          )}

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 leading-relaxed space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              PDPA Consent & Disclosure Notice
            </p>
            <p className="text-[11px] text-emerald-800/90 leading-relaxed">
              By submitting this application, your verified qualifications, skills, and direct contact details will be released to <strong>{applyModalJob?.company.company_name}</strong> for this caregiving opportunity.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Cover Note & Availability Commitment (Optional)</label>
            <Textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="e.g. Certified staff nurse living in PJ. Available for all scheduled shift dates."
              className="rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setApplyModalJob(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={applying} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
              {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={!!reportModalJob}
        onClose={() => setReportModalJob(null)}
        title="Report Job Posting for Review"
        description="Flag this listing for administrative moderation"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Reason for Reporting</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              required
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 bg-white"
            >
              <option value="">Select a violation category...</option>
              <option value="Contains identifiable patient information (NRIC / MyKad, name, address)">Contains patient identifiable information (PDPA violation)</option>
              <option value="Unrealistic clinical expectations or unsafe working conditions">Unsafe clinical expectations</option>
              <option value="Misleading rate or fee discrepancy">Misleading compensation rate</option>
              <option value="Other terms violation">Other compliance violation</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setReportModalJob(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={reporting || !reportReason}>
              {reporting ? 'Reporting...' : 'Submit Report to Admin'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
