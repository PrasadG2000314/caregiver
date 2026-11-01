import React from 'react';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { CaregiverApplicationsClient } from './applications-client';

export default async function CaregiverApplicationsPage() {
  const currentUser = await getCurrentUser();
  const caregiverId = currentUser?.role === 'caregiver' ? currentUser.id : '20000000-0000-0000-0000-000000000001'; // Default Siti Nurhaliza
  const applications = db.getApplicationsByCaregiver(caregiverId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Shift Applications</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track real-time statuses from healthcare agencies, backup candidate shortlists, and confirmed bookings.
        </p>
      </div>

      <PDPABanner compact />

      <CaregiverApplicationsClient initialApplications={applications} caregiverId={caregiverId} />

    </div>
  );
}

