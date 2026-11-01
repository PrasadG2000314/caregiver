import React from 'react';
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
  AlertCircle 
} from 'lucide-react';

export default async function CaregiverBookingsPage() {
  const currentUser = await getCurrentUser();
  const caregiverId = currentUser?.role === 'caregiver' ? currentUser.id : '20000000-0000-0000-0000-000000000001'; // Default Siti Nurhaliza
  const bookings = db.getBookings(caregiverId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Confirmed Shift Bookings</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official placements with verified Malaysian care companies and agencies.
        </p>
      </div>

      <PDPABanner compact />

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No bookings placed yet. Once an agency selects and confirms your application, your confirmed shift schedules appear here.
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
                className={`bg-white rounded-xl border p-5 shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                  isConfirmed 
                    ? 'border-emerald-300 ring-1 ring-emerald-500/10' 
                    : isCompleted
                    ? 'border-blue-200 bg-blue-50/10'
                    : 'border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{b.job?.title}</h3>
                    <Badge
                      variant={isConfirmed ? 'default' : isCompleted ? 'secondary' : 'destructive'}
                      className="uppercase text-[10px] font-bold"
                    >
                      {b.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: #{b.id.substring(0, 8)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {company?.company_name}
                    </span>
                    <span>•</span>
                    <span>{b.job?.location_city}, {b.job?.location_state}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.start_date} to {b.end_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.job?.shift_duration_hours} hrs/shift
                    </span>
                    <span className="font-black text-emerald-700">
                      Agreed Rate: {formatMYR(b.agreed_rate)} / shift
                    </span>
                  </div>

                  {/* Company Contact */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Agency Contact:</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {company?.profile?.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {company?.profile?.email}
                    </span>
                  </div>

                  {b.cancellation_reason && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <strong>Cancellation Reason:</strong> {b.cancellation_reason}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {isConfirmed && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Confirmed by Agency</span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Shift Completed</span>
                    </div>
                  )}
                  {isCancelled && (
                    <div className="text-xs text-slate-400 italic">
                      Cancelled
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

