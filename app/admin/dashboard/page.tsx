import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/services/data-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  CalendarCheck,
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardPage() {
  const profiles = db.getAllProfiles();
  const companies = db.getAllCompanies();
  const caregivers = db.getAllCaregivers();
  const jobs = db.jobs;
  const bookings = db.bookings;
  const complaints = db.getComplaints();
  const pendingComplaints = complaints.filter(c => c.status === 'open' || c.status === 'under_review');
  const auditLogs = db.getAuditLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Platform Administration Command</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-700" /> Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            SSM business approvals, PDPA privacy moderation, dispute settlements, and immutable system audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/companies"
            className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-900 font-bold text-xs hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            Review Verifications
          </Link>
          <Link
            href="/admin/complaints"
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-900 font-bold text-xs hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            Inspect Disputes ({pendingComplaints.length})
          </Link>
        </div>
      </div>

      <PDPABanner compact />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Care Agencies</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{companies.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">SSM Registered</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Caregivers / Nurses</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{caregivers.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Vetted Malaysian talent</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Shifts Posted</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{jobs.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{bookings.length} confirmed bookings</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Complaints</p>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{pendingComplaints.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Active investigation</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Verification Queue & Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: SSM Company Verification Queue */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">SSM Verification Desk</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verify Suruhanjaya Syarikat Malaysia records</p>
            </div>
            <Link href="/admin/companies" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group">
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {companies.map((comp) => (
              <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs gap-3">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">{comp.company_name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">SSM: {comp.registration_number} • {comp.city}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    comp.profile?.verification_status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {comp.profile?.verification_status}
                  </span>
                  <Link
                    href="/admin/companies"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security & Platform Activity Audit */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Immutable Audit Trail</h2>
              <p className="text-xs text-slate-500 mt-0.5">System state changes & governance actions</p>
            </div>
            <Link href="/admin/audit-logs" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group">
              <span>View full log</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    {log.action}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-sans">
                    Target: {log.entity_type} {log.entity_id ? `(#${log.entity_id.substring(0, 8)})` : ''}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
