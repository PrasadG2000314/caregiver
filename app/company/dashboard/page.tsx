import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { db } from '@/lib/services/data-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { formatMYR } from '@/lib/utils';
import { 
  Building2, 
  Briefcase, 
  Users, 
  CalendarCheck, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  MapPin,
  Calendar,
  Lock,
  FileText
} from 'lucide-react';

export default async function CompanyDashboardPage() {
  const currentUser = await getCurrentUser();
  const companyId = currentUser?.id || db.companies[0].id;
  const company = db.getCompany(companyId);

  const jobs = db.getJobs({ companyId });
  const openJobs = jobs.filter(j => j.status === 'open');
  const filledJobs = jobs.filter(j => j.status === 'filled');

  // Applications across company's jobs
  const jobIds = jobs.map(j => j.id);
  const applications = db.applications.filter(a => jobIds.includes(a.job_id));
  const pendingApplicants = applications.filter(a => a.status === 'applied');
  const backupCandidates = applications.filter(a => a.is_backup_candidate);

  // Bookings
  const bookings = db.getBookings(companyId);
  const activeBookings = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Agency Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start sm:items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-600/20 shrink-0">
            {company?.company_name ? company.company_name.substring(0, 2).toUpperCase() : 'CO'}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {company?.company_name || 'Care Agency Portal'}
              </h1>
              {company?.profile?.verification_status === 'verified' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> SSM Verified Operator
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Pending SSM Review
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                SSM: {company?.registration_number}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {company?.city}, {company?.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <Link
            href="/company/profile"
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all text-center"
          >
            Manage SSM Docs
          </Link>
          <Link
            href="/company/jobs/new"
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2 group shrink-0"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>Post New Shift</span>
          </Link>
        </div>
      </div>

      <PDPABanner compact />

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Open Shifts</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{openJobs.length}</h3>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{filledJobs.length} shifts filled</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Applicants</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{pendingApplicants.length}</h3>
            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Awaiting agency review</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Confirmed Bookings</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{activeBookings.length}</h3>
            <p className="text-[11px] text-blue-700 font-semibold mt-0.5">Active shift schedules</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Backup Candidate Pool</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{backupCandidates.length}</h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>&lt; 2 mins fallback ready</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Shift Management & Fallback Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Posted Shifts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Posted Care Shifts</h2>
              <p className="text-xs text-slate-500">Manage shift requirements, review applicants, and confirm backups</p>
            </div>
            <Link href="/company/jobs" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group">
              <span>View all ({jobs.length})</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => {
              const jobApps = applications.filter(a => a.job_id === job.id);
              const backups = jobApps.filter(a => a.is_backup_candidate);

              return (
                <div 
                  key={job.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                      <Badge 
                        variant={job.status === 'open' ? 'default' : job.status === 'filled' ? 'secondary' : 'outline'}
                        className={`text-[10px] uppercase font-bold ${
                          job.status === 'open' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''
                        }`}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location_city}, {job.location_state}
                      </span>
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                        {formatMYR(job.offered_rate)} / shift
                      </span>
                      <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {job.shift_duration_hours} hrs
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Schedule: {job.start_date} to {job.end_date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link
                      href={`/company/jobs/${job.id}/applicants`}
                      className="px-4 py-2.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold hover:bg-teal-100 flex items-center gap-2 transition-colors border border-teal-200/60"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>{jobApps.length} Applicants</span>
                      {backups.length > 0 && (
                        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>{backups.length} backup</span>
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Security Profile & Backup Fallback Explainer */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Agency Security Profile</h2>
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">SSM Registry Compliance</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified agencies unlock unrestricted direct contact access with applied caregivers.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Entity</span>
              <p className="font-bold text-slate-900">{company?.company_name}</p>
              <p className="text-slate-500 font-mono text-[11px]">{company?.registration_number}</p>
            </div>

            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SSM Certificate verified by Platform Admin. Private storage signed URL active.</span>
            </div>

            <Link
              href="/company/profile"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              <span>Manage Profile & SSM Proof</span>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-teal-500/10 rounded-2xl border border-amber-200/80 p-5 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Instant Backup Fallback Pool</span>
            </div>
            <p className="leading-relaxed">
              When screening candidates, mark secondary profiles with <strong>&quot;Flag as Backup Candidate&quot;</strong>. If an unexpected cancellation occurs, confirm them instantly with 1-click without re-posting.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
