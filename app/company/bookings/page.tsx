import React from 'react';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { CompanyBookingsClient } from './bookings-client';

export default async function CompanyBookingsPage() {
  const currentUser = await getCurrentUser();
  const companyId = currentUser?.id || db.companies[0].id;
  const bookings = db.getBookings(companyId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Caregiver Bookings & Shifts</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Confirmed placements, shift completion lifecycle, cancellation records, and immediate backup candidate replacement.
        </p>
      </div>

      <PDPABanner compact />

      <CompanyBookingsClient initialBookings={bookings} companyId={companyId} />

    </div>
  );
}

