import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { db } from '@/lib/services/data-service';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { formatMYR } from '@/lib/utils';
import { Plus, Users, MapPin, Clock, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

export default async function CompanyJobsPage() {
  const currentUser = await getCurrentUser();
  const companyId = currentUser?.id || db.companies[0].id;
  const jobs = db.getJobs({ companyId });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manage Care Shifts</h1>
          <p className="text-sm text-slate-500">Track and review applications across your posted shifts</p>
        </div>

        <Link
          href="/company/jobs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Shift</span>
        </Link>
      </div>

      <PDPABanner compact />

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No shifts posted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Publish your first caregiving or nursing requirement in Malaysia with custom shift hours and daily rates.
          </p>
          <Link
            href="/company/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Create Shift Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => {
            const applicants = db.applications.filter(a => a.job_id === job.id);
            const backupCount = applicants.filter(a => a.is_backup_candidate).length;

            return (
              <div 
                key={job.id} 
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                    <Badge 
                      variant={
                        job.status === 'open' 
                          ? 'default' 
                          : job.status === 'filled' 
                          ? 'secondary' 
                          : job.status === 'cancelled'
                          ? 'destructive'
                          : 'outline'
                      }
                      className="uppercase text-[10px] font-bold tracking-wider"
                    >
                      {job.status}
                    </Badge>
                    {job.is_reported && (
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <AlertCircle className="w-3 h-3" /> Flagged for Review
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.responsibilities}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location_area ? `${job.location_area}, ` : ''}{job.location_city}, {job.location_state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {job.start_date} to {job.end_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.shift_duration_hours} hrs/shift
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.required_skills.map((s) => (
                      <span key={s} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-base font-black text-emerald-700">
                      {formatMYR(job.offered_rate)}
                    </span>
                    <p className="text-[11px] text-slate-400">per shift ({job.currency})</p>
                  </div>

                  <Link
                    href={`/company/jobs/${job.id}/applicants`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-semibold border border-teal-200 transition-colors"
                  >
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{applicants.length} Applicants</span>
                    {backupCount > 0 && (
                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                        {backupCount} backup
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

