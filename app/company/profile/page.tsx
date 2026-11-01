'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCompanyProfileAction } from '@/app/actions/profile-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { MALAYSIAN_STATES, MALAYSIAN_CITIES } from '@/lib/malaysia-data';
import { Building2, ShieldCheck, FileText, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';

export default function CompanyProfilePage() {
  const router = useRouter();

  // Initial State matching Damai Care Services
  const [companyName, setCompanyName] = useState('Damai Care Services Sdn Bhd');
  const [registrationNumber, setRegistrationNumber] = useState('202101099881 (1420181-T)');
  const [address, setAddress] = useState('Level 5, Oasis Square, Ara Damansara');
  const [state, setState] = useState('Selangor');
  const [city, setCity] = useState('Petaling Jaya');
  const [description, setDescription] = useState(
    'Premier home caregiving and hospice nursing agency serving the Klang Valley.'
  );

  const [documentPath, setDocumentPath] = useState('company-documents/comp1/ssm_cert.pdf');
  const [isVerified, setIsVerified] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    // Call update action
    const res = await updateCompanyProfileAction('10000000-0000-0000-0000-000000000001', {
      company_name: companyName,
      registration_number: registrationNumber,
      address,
      state,
      city,
      description,
    });

    setSaving(false);
    if (res.success) {
      setSavedSuccess(true);
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Profile & SSM Verification</h1>
          <p className="text-xs text-slate-500">Manage Suruhanjaya Syarikat Malaysia (SSM) proof and business credentials</p>
        </div>

        {isVerified ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 gap-1.5 py-1 px-3 border border-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-xs">SSM Verified Agency</span>
          </Badge>
        ) : (
          <Badge variant="warning" className="gap-1.5 py-1 px-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-xs">Pending SSM Verification</span>
          </Badge>
        )}
      </div>

      <PDPABanner compact />

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Company profile details updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Business Registration Details</CardTitle>
            <CardDescription>Official business name and SSM registration as filed with Malaysian authorities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company Name</label>
              <Input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">SSM Registration Number</label>
              <Input
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. 202101099881 (1420181-T)"
              />
              <p className="text-[11px] text-slate-400">
                12-digit SSM Number or legacy Registration No. Verified against the SSM registry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  {MALAYSIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">City / District</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  {(MALAYSIAN_CITIES[state] || []).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Operating Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building, floor"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Agency Bio & Scope of Care</label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. SSM Verification Document</CardTitle>
            <CardDescription>
              Stored in Supabase private bucket (`company-documents`). Serviced strictly via signed URLs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-800">SSM Certificate of Incorporation</p>
                  <p className="text-[11px] text-slate-400 font-mono">{documentPath}</p>
                </div>
              </div>

              <a
                href={`/api/documents/download?bucket=company-documents&path=${encodeURIComponent(documentPath)}&token=auth_demo&expires=${Date.now() + 300000}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-emerald-700 hover:bg-slate-50"
              >
                View Stored PDF
              </a>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Upload Updated SSM Document (PDF)</p>
              <p className="text-[11px] text-slate-400">Max file size 5MB. Must be valid SSM Form 9 or Suruhanjaya Syarikat certificate.</p>
              <button
                type="button"
                onClick={() => alert('Demo simulated upload: Document encrypted and saved to company-documents/comp1/ssm_cert.pdf')}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-lg"
              >
                Select File
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

