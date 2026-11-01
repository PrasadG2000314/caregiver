import React from 'react';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { AdminCompaniesClient } from './companies-client';

export default async function AdminCompaniesPage() {
  const companies = db.getAllCompanies();
  const currentUser = await getCurrentUser();
  const adminId = currentUser?.id || '00000000-0000-0000-0000-000000000001';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SSM Company Verification Center</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verify Malaysian healthcare agencies and care homes against Suruhanjaya Syarikat Malaysia records.
        </p>
      </div>

      <PDPABanner compact />

      <AdminCompaniesClient initialCompanies={companies} adminId={adminId} />

    </div>
  );
}

