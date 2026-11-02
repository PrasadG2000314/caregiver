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
  UserCheck,
  Zap
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
                className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-xs hover-lift transition-all space-y-5 ${
                  isSelected 
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10' 
                    : app.is_backup_candidate
                    ? 'border-amber-300 bg-amber-50/15'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                        {job?.title}
                      </h3>
                      
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'shortlisted'
                          ? 'bg-teal-100 text-teal-800 border border-teal-300'
                          : isWithdrawn
                          ? 'bg-slate-100 text-slate-500'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {app.status}
                      </span>

                      {app.is_backup_candidate && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>Priority Backup Candidate</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {company?.company_name}
                      </span>
                      <span>•</span>
                      <span>{job?.location_city}, {job?.location_state}</span>
                      <span>•</span>
                      <span>Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <span className="text-xl font-black text-emerald-700">
                      {formatMYR(job?.offered_rate || 0)}
                    </span>
                    <p className="text-[11px] text-slate-400">per shift</p>
                  </div>
                </div>

                {/* Cover Note */}
                {app.cover_note && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-700 italic border-l-4 border-emerald-500">
                    &quot;{app.cover_note}&quot;
                  </div>
                )}

                {/* Shift Details Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {job?.start_date} to {job?.end_date}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job?.shift_duration_hours} hrs/shift
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job?.location_area || job?.location_city}
                  </span>
                </div>

                {/* Visual Pipeline Progress */}
                {!isWithdrawn && !isRejected && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Application Pipeline</span>
                      <span className="text-emerald-700">Stage {stageIdx} of 3</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {STAGES.map((stg, i) => {
                        const active = i <= stageIdx;
                        return (
                          <div key={stg.key} className="space-y-1">
                            <div className={`h-1.5 rounded-full transition-all ${
                              active ? 'bg-emerald-600' : 'bg-slate-200'
                            }`} />
                            <p className={`text-[10px] font-semibold truncate ${
                              active ? 'text-emerald-900 font-bold' : 'text-slate-400'
                            }`}>
                              {stg.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Status: <strong className="text-slate-700 capitalize">{app.status}</strong>
                  </span>

                  {!isWithdrawn && !isSelected && (
                    <button
                      type="button"
                      onClick={() => handleWithdraw(app.id)}
                      disabled={withdrawingId === app.id}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs hover:underline"
                    >
                      {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw Application'}
                    </button>
                  )}

                  {isSelected && (
                    <Link
                      href="/caregiver/bookings"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>View Confirmed Booking</span>
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
