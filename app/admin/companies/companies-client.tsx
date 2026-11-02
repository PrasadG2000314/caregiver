'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Company, Profile } from '@/lib/types/database.types';
import { verifyCompanyAction } from '@/app/actions/admin-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Download, 
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface Props {
  initialCompanies: (Company & { profile: Profile })[];
  adminId: string;
}

export function AdminCompaniesClient({ initialCompanies, adminId }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleVerify = async (companyId: string, isVerified: boolean) => {
    setLoadingId(companyId);
    const res = await verifyCompanyAction(companyId, adminId, isVerified);
    setLoadingId(null);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to update verification status.');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5">
      {initialCompanies.map((comp) => {
        const isVerified = comp.profile?.verification_status === 'verified';
        const docPath = comp.verification_document_path;

        return (
          <div
            key={comp.id}
            className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-xs hover-lift transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              isVerified ? 'border-slate-200/90' : 'border-amber-300/80 bg-amber-50/15'
            }`}
          >
            <div className="space-y-3 max-w-2xl text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  {comp.company_name}
                </h3>
                
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isVerified 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {comp.profile?.verification_status}
                </span>

                <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-700 font-bold">
                  SSM: {comp.registration_number}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed font-normal">{comp.description}</p>

              <div className="flex flex-wrap items-center gap-2 text-slate-500">
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {comp.address ? `${comp.address}, ` : ''}{comp.city}, {comp.state}
                </span>
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Registered: {new Date(comp.created_at).toLocaleDateString()}
                </span>
              </div>

              {docPath && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={`/api/documents/download?bucket=company-documents&path=${encodeURIComponent(docPath)}&token=admin_token&expires=${Date.now() + 300000}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 text-teal-900 hover:bg-teal-100 font-bold border border-teal-200 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SSM Proof (Signed URL)</span>
                  </a>
                  {comp.verified_at && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified on {new Date(comp.verified_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2.5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              {!isVerified ? (
                <Button
                  size="sm"
                  onClick={() => handleVerify(comp.id, true)}
                  disabled={loadingId === comp.id}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs w-full sm:w-auto px-4 py-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve SSM & Grant Verification</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleVerify(comp.id, false)}
                  disabled={loadingId === comp.id}
                  className="text-amber-700 border-amber-200 hover:bg-amber-50 text-xs font-semibold rounded-xl w-full sm:w-auto px-4 py-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Revoke Verification Badge
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
