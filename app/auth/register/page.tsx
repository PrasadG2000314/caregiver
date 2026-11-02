'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PDPABanner } from '@/components/pdpa-banner';
import { UserRole } from '@/lib/types/database.types';
import { 
  Building2, 
  User, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  Sparkles,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Award,
  FileCheck
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('caregiver');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+60 12-');
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdpaConsent) {
      setError('You must accept the PDPA 2010 statutory consent statement to proceed.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await registerAction({
      fullName,
      email,
      phone,
      role,
      pdpaConsent,
    });

    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'company') {
        router.push('/company/dashboard');
      } else {
        router.push('/caregiver/profile');
      }
    } else {
      setError(res.error || 'Failed to register account');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-14 space-y-6">
      
      {/* Top Banner */}
      <PDPABanner compact />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Visual Brand Card */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800 text-white flex flex-col justify-between p-8 min-h-[520px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
              alt="Malaysian clinical nurse caring for patient"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover opacity-25 filter grayscale-[15%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Onboarding</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Join Malaysia&apos;s Dedicated Caregiver Network
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Whether you are an SSM-certified care facility seeking reliable relief staff or a licensed nurse seeking fair, transparent shifts.
            </p>
          </div>

          {/* Verification Guarantees */}
          <div className="relative z-10 space-y-3 pt-6">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Public Phone Leaks</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Contact information is strictly masked until an active, SSM-verified agency selects or shortlists your profile.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <FileCheck className="w-4 h-4 text-teal-400" />
                <span>Private Document Vault</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Credentials are saved in encrypted Supabase storage served via 300-second expiring signed URLs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Registration Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create your account</h2>
              <p className="text-xs text-slate-500">
                Select your account role to access your dedicated Malaysian portal.
              </p>
            </div>

            {/* Role Toggle Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all hover:-translate-y-0.5 ${
                    role === 'caregiver'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${role === 'caregiver' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    {role === 'caregiver' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="font-bold text-slate-900 text-sm">Caregiver / Nurse</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Find care shifts, apply to verified agencies</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all hover:-translate-y-0.5 ${
                    role === 'company'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${role === 'company' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    {role === 'company' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="font-bold text-slate-900 text-sm">Healthcare Agency</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Post shifts, hire vetted caregivers</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-xs animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">
                  {role === 'company' ? 'Official Organization Name' : 'Full Name (as per MyKad / Passport)'}
                </label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'company' ? 'e.g. Kasih Sejahtera Care Sdn Bhd' : 'e.g. Siti Nurhaliza Binti Ahmad'}
                  className="rounded-xl h-11 text-xs border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Official Email</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.my"
                    className="rounded-xl h-11 text-xs border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Malaysian Phone (+60)</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="rounded-xl h-11 text-xs border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* PDPA Consent Checkbox */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pdpaConsent}
                    onChange={(e) => setPdpaConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-semibold">
                      Statutory PDPA 2010 Privacy Consent & Agreement
                    </strong>
                    I consent to the collection and processing of my credentials strictly for healthcare caregiver matching. I acknowledge that patient identifying data is strictly prohibited in public shift postings.
                  </div>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                {loading ? 'Creating Account...' : `Register as ${role === 'company' ? 'Healthcare Agency' : 'Caregiver'}`}
              </Button>
            </form>

            <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 flex items-center justify-center gap-1.5">
              <span>Already registered?</span>
              <Link href="/auth/login" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
                Sign In to your account
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
