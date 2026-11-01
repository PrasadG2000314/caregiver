import React from 'react';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { CaregiverJobsClient } from './caregiver-jobs-client';

export default async function CaregiverJobsPage() {
  const currentUser = await getCurrentUser();
  const caregiverId = currentUser?.role === 'caregiver' ? currentUser.id : '20000000-0000-0000-0000-000000000001'; // Default Siti Nurhaliza
  const openJobs = db.getJobs({ status: 'open' });
  const myApplications = db.applications.filter(a => a.caregiver_id === caregiverId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Available Care Shifts in Malaysia</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse verified healthcare listings across Klang Valley, Penang, Johor and apply directly with your credential profile.
        </p>
      </div>

      <PDPABanner compact />

      <CaregiverJobsClient 
        jobs={openJobs} 
        myApplications={myApplications} 
        caregiverId={caregiverId} 
      />

    </div>
  );
}

