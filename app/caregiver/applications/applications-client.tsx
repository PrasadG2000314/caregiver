'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Application, Job, Company } from '@/lib/types/database.types';
import { withdrawApplicationAction } from '@/app/actions/application-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMYR } from '@/lib/utils';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface Props {
  initialApplications: (Application & { job: Job & { company: Company } })[];
  caregiverId: string;
}

const STAGES = [
  { key: 'applied', label: 'Submitted' },
  { key: 'under_review', label: 'Screening' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'selected', label: 'Confirmed Booking' },
];

export function CaregiverApplicationsClient({ initialApplications, caregiverId }: Props) {
  const router = useRouter();
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const handleWithdraw = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw this application? The hiring agency will be notified.')) {
      return;
    }

    setWithdrawingId(appId);
    const res = await withdrawApplicationAction(appId, caregiverId);
    setWithdrawingId(null);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to withdraw application.');
    }
  };

  const getStageIndex = (status: string, isBackup: boolean) => {
    if (status === 'selected') return 3;
    if (status === 'shortlisted' || isBackup) return 2;
    if (status === 'applied') return 1;
    return 0;
  };

  return (
    <div className="space-y-6">
      {initialApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Send className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">No Active Applications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore available home nursing, palliative care, and stroke rehabilitation shifts across Malaysia.
            </p>
          </div>
          <Link
            href="/caregiver/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            <span>Browse Open Care Shifts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {initialApplications.map((app) => {
            const job = app.job;
            const company = job?.company;
            const isSelected = app.status === 'selected';
            const isWithdrawn = app.status === 'withdrawn';
            const isRejected = app.status === 'rejected';
            const stageIdx = getStageIndex(app.status, app.is_backup_candidate);

            return (
              <div
                key={app.id}
                className={`bg-white rounded-3xl border p-6 shadow-xs hover-lift transition-all space-y-5 ${
                  isSelected 
                    ? 'border-emerald-300 ring-1 ring-emerald-500/20 bg-emerald-50/10' 
                    : app.is_backup_candidate
                    ? 'border-amber-300/80 bg-amber-50/15'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Header Information */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-1">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                        {job?.title}
                      </h3>
                      
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60' 
                          : app.is_backup_candidate
                          ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                          : isWithdrawn || isRejected
                          ? 'bg-rose-100 text-rose-800 border border-rose-300/60'
                          : 'bg-teal-100 text-teal-800 border border-teal-300/60'
                      }`}>
                        {app.status}
                      </span>

                      {app.is_backup_candidate && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Priority Backup Candidate
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {company?.company_name}
                      </span>
                      <span>•</span>
                      <span>{job?.location_city}, {job?.location_state}</span>
                      <span>•</span>
                      <span className="font-black text-emerald-700">{formatMYR(job?.offered_rate || 0)}/shift</span>
                    </p>
                  </div>

                  {/* Top Right Action Button */}
                  <div className="shrink-0">
                    {isSelected ? (
                      <Link
                        href="/caregiver/bookings"
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow hover:bg-emerald-700 flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>View Confirmed Booking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : !isWithdrawn && !isRejected ? (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawingId === app.id}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors"
                      >
                        {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw Application'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No further action</span>
                    )}
                  </div>
                </div>

                {/* Visual Pipeline Milestone Stepper */}
                {!isWithdrawn && !isRejected && (
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Application Pipeline Status</p>
                    <div className="grid grid-cols-4 gap-2 relative">
                      {STAGES.map((stage, idx) => {
                        const isReached = idx <= stageIdx;
                        const isCurrent = idx === stageIdx;
                        return (
                          <div key={stage.key} className="flex flex-col items-center text-center space-y-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isReached 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : 'bg-slate-200 text-slate-500'
                            } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                              {isReached ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[11px] font-semibold ${isReached ? 'text-slate-900' : 'text-slate-400'}`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Details Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {job?.start_date} to {job?.end_date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job?.shift_duration_hours} hrs/shift
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Applied on: {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Backup candidate info callout */}
                {app.is_backup_candidate && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Priority Backup Designation:</strong>
                      <span>The agency has designated you as the priority fallback nurse. If the primary caregiver faces an emergency, you will immediately receive an instant booking confirmation.</span>
                    </div>
                  </div>
                )}

                {app.cover_note && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                    &quot;{app.cover_note}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
