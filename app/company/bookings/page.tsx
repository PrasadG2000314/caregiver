import React from 'react';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { CompanyBookingsClient } from './bookings-client';
import { CalendarCheck, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default async function CompanyBookingsPage() {
  const currentUser = await getCurrentUser();
  const companyId = currentUser?.id || db.companies[0].id;
  const bookings = db.getBookings(companyId);

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Shift Lifecycle & Attendance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Caregiver Bookings & Placements</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Confirmed placements, shift completion lifecycle, cancellation records, and immediate backup candidate replacement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            {confirmedCount} Active Bookings
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
            {completedCount} Completed
          </span>
        </div>
      </div>

      <PDPABanner compact />

      <CompanyBookingsClient initialBookings={bookings} companyId={companyId} />

    </div>
  );
}
