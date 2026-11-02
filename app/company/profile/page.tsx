'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCompanyProfileAction } from '@/app/actions/profile-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PDPABanner } from '@/components/pdpa-banner';
import { MALAYSIAN_STATES, MALAYSIAN_CITIES } from '@/lib/malaysia-data';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud,
  Download,
  MapPin,
  Sparkles,
  Award
} from 'lucide-react';

export default function CompanyProfilePage() {
  const router = useRouter();

  // Initial State matching Damai Care Services
  const [companyName, setCompanyName] = useState('Damai Care Services Sdn Bhd');
  const [registrationNumber, setRegistrationNumber] = useState('202101099881 (1420181-T)');
  const [address, setAddress] = useState('Level 5, Oasis Square, Ara Damansara');
  const [state, setState] = useState('Selangor');
  const [city, setCity] = useState('Petaling Jaya');
  const [description, setDescription] = useState(
    'Premier home caregiving and hospice nursing agency serving the Klang Valley. Audited and certified under Suruhanjaya Syarikat Malaysia.'
  );

  const [documentPath, setDocumentPath] = useState('company-documents/comp1/ssm_cert.pdf');
  const [isVerified, setIsVerified] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const cities = MALAYSIAN_CITIES[newState] || [];
    setCity(cities[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

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
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Healthcare Agency Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Organization Profile & SSM Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage Suruhanjaya Syarikat Malaysia (SSM) proof and business credentials.
          </p>
        </div>

        {isVerified ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SSM Verified Agency</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Pending SSM Verification</span>
          </span>
        )}
      </div>

      <PDPABanner compact />

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Company profile details and SSM registry information updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Card 1: Business Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Business Registration Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Official business name and SSM registration as filed with Malaysian authorities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Official Company Name</label>
              <Input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="rounded-xl h-11 text-xs border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">SSM Registration Number</label>
              <Input
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="rounded-xl h-11 text-xs font-mono border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Agency Summary & Healthcare Scope</label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs border-slate-200"
            />
          </div>
        </div>

        {/* Card 2: Operating Address */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>2. Operating Address & Coverage Area</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Physical office or clinical facility address in Malaysia</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Address Line</label>
            <Input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl h-11 text-xs border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">State / Federal Territory</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                {MALAYSIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">City / District</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                {(MALAYSIAN_CITIES[state] || []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: SSM Verification Document Vault */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>3. SSM Certificate Document Vault</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proof filed with Suruhanjaya Syarikat Malaysia. Served exclusively through signed URLs.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">SSM Business Registration Certificate (Form 9 / Section 17)</p>
                <p className="text-[11px] text-slate-400 font-mono">{documentPath}</p>
              </div>
            </div>

            <a
              href={`/api/documents/download?bucket=company-documents&path=${encodeURIComponent(documentPath)}&token=auth_demo&expires=${Date.now() + 300000}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-emerald-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02] shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SSM PDF</span>
            </a>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
          >
            {saving ? 'Saving...' : 'Update Organization Profile'}
          </Button>
        </div>

      </form>

    </div>
  );
}
