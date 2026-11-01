'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  HeartHandshake
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('caregiver');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+6012');
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdpaConsent) {
      setError('You must accept the PDPA consent statement to register.');
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
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Account Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Join Malaysia&apos;s Caregiver Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Create an account to post shifts as a verified healthcare agency or discover flexible nursing shifts as a certified caregiver.
        </p>
      </div>

      <PDPABanner compact />

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Role Toggle Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            I am joining as:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                role === 'caregiver'
                  ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
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
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                role === 'company'
                  ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
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
                <p className="font-bold text-slate-900 text-sm">Care Agency / Center</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Post shifts, manage bookings & backup pool</p>
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              {role === 'company' ? 'Organization / Agency Name' : 'Full Name (as per MyKad)'} <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={role === 'company' ? 'e.g. Damai Care Services Sdn Bhd' : 'e.g. Nur Aisyah binti Ahmad'}
              className="rounded-xl h-11 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              Official Email Address <span className="text-rose-500">*</span>
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. contact@domain.my"
              className="rounded-xl h-11 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">
                Malaysian Phone Number <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold">PDPA Protected</span>
            </div>
            <Input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+60123456789"
              className="rounded-xl h-11 text-xs"
            />
            <p className="text-[11px] text-slate-400">
              Format: <code>+601XXXXXXXX</code>. Contact details are never public.
            </p>
          </div>

          {/* PDPA Statement */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100/50 transition-colors">
              <input
                type="checkbox"
                required
                checked={pdpaConsent}
                onChange={(e) => setPdpaConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I agree to the processing of personal details under the <strong>Personal Data Protection Act 2010 (PDPA)</strong>.
                I acknowledge that identifiable patient details are strictly prohibited in public job postings.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs shadow-md shadow-emerald-600/20"
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'company' ? 'Care Agency' : 'Caregiver'}`}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Already registered?{' '}
          <Link href="/auth/login" className="font-bold text-emerald-700 hover:underline">
            Sign in here
          </Link>
        </div>

      </div>

    </div>
  );
}
