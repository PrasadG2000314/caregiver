import React from 'react';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { AdminUsersClient } from './users-client';

export default async function AdminUsersPage() {
  const profiles = db.getAllProfiles();
  const currentUser = await getCurrentUser();
  const adminId = currentUser?.id || '00000000-0000-0000-0000-000000000001';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">User Account Moderation</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage user account statuses (Active, Suspended, Flagged) across Malaysian companies and caregivers.
        </p>
      </div>

      <PDPABanner compact />

      <AdminUsersClient initialProfiles={profiles} adminId={adminId} />
    </div>
  );
}

