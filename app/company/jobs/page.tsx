import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { db } from '@/lib/services/data-service';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { formatMYR } from '@/lib/utils';
import { 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Zap,
  ChevronRight,
  Filter
} from 'lucide-react';

export default async function CompanyJobsPage() {
  const currentUser = await getCurrentUser();
  const companyId = currentUser?.id || db.companies[0].id;
  const jobs = db.getJobs({ companyId });

  const openCount = jobs.filter(j => j.status === 'open').length;
  const filledCount = jobs.filter(j => j.status === 'filled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Title and Create Button */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Shift Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manage Care Shifts</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track applicants, assign backup candidates, and confirm shift placements across Malaysian care homes.
          </p>
        </div>

        <Link
          href="/company/jobs/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all group shrink-0"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span>Post New Shift</span>
        </Link>
      </div>

      <PDPABanner compact />

      {/* Filter Stats Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white">
          All Shifts ({jobs.length})
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Open Shifts ({openCount})
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          Filled Shifts ({filledCount})
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No care shifts posted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Publish your first caregiving or nursing requirement in Malaysia with custom shift hours and daily rates.
            </p>
          </div>
          <Link
            href="/company/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all"
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
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover-lift transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{job.title}</h3>
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
                      className={`uppercase text-[10px] font-bold tracking-wider ${
                        job.status === 'open' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''
                      }`}
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

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location_area ? `${job.location_area}, ` : ''}{job.location_city}, {job.location_state}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {job.start_date} to {job.end_date}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.shift_duration_hours} hrs/shift
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.required_skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-[11px] bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-md border border-teal-100 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-xl sm:text-2xl font-black text-emerald-700">
                      {formatMYR(job.offered_rate)}
                    </span>
                    <p className="text-[11px] font-medium text-slate-400">per shift (MYR)</p>
                  </div>

                  <Link
                    href={`/company/jobs/${job.id}/applicants`}
                    className="px-4 py-2.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold hover:bg-teal-100 flex items-center gap-2 transition-colors border border-teal-200/60"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>{applicants.length} Applicants</span>
                    {backupCount > 0 && (
                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{backupCount} backup</span>
                      </span>
                    )}
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
