import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { Badge } from '@/components/ui/badge';
import { formatMYR } from '@/lib/utils';
import { 
  CalendarCheck, 
  Building2, 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileCheck2
} from 'lucide-react';

export default async function CaregiverBookingsPage() {
  const currentUser = await getCurrentUser();
  const caregiverId = currentUser?.role === 'caregiver' ? currentUser.id : '20000000-0000-0000-0000-000000000001';
  const bookings = db.getBookings(caregiverId);

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Official Placements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Confirmed Shift Bookings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official confirmed shift schedules with verified Malaysian healthcare companies and agencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            {confirmedCount} Active
          </span>
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
            {completedCount} Completed
          </span>
        </div>
      </div>

      <PDPABanner compact />

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500 text-xs space-y-3 shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <p className="font-bold text-slate-900 text-sm">No bookings placed yet</p>
          <p className="text-slate-400 max-w-sm mx-auto">
            Once an agency selects and confirms your application, your confirmed shift schedules and contact details appear here.
          </p>
          <Link
            href="/caregiver/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all mt-2"
          >
            <span>Browse Active Care Shifts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            const isCompleted = b.status === 'completed';
            const isCancelled = b.status === 'cancelled';
            const company = b.company;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-3xl border p-6 shadow-xs hover-lift transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isConfirmed 
                    ? 'border-emerald-300 ring-1 ring-emerald-500/10' 
                    : isCompleted
                    ? 'border-blue-200 bg-blue-50/10'
                    : 'border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{b.job?.title}</h3>
                    <Badge
                      variant={isConfirmed ? 'default' : isCompleted ? 'secondary' : 'destructive'}
                      className={`uppercase text-[10px] font-bold ${
                        isConfirmed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : ''
                      }`}
                    >
                      {b.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: #{b.id.substring(0, 8)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {company?.company_name}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{b.job?.location_city}, {b.job?.location_state}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.start_date} to {b.end_date}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.job?.shift_duration_hours} hrs/shift
                    </span>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Agreed Rate: {formatMYR(b.agreed_rate)} / shift
                    </span>
                  </div>

                  {/* Company Contact (Unmasked because booking is confirmed) */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Employer Contact:</span>
                    <span className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {company?.profile?.phone || '+60 3-7888 1234'}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {company?.profile?.email || 'admin@damaicare.com.my'}
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-xl sm:text-2xl font-black text-emerald-700">
                      {formatMYR(b.agreed_rate)}
                    </span>
                    <p className="text-[11px] font-medium text-slate-400">per shift</p>
                  </div>

                  {isConfirmed && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Shift Active</span>
                    </div>
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
