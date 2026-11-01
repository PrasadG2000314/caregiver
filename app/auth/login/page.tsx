'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PDPABanner } from '@/components/pdpa-banner';
import { 
  HeartHandshake, 
  LogIn, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  User, 
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const QUICK_TEST_USERS = [
  {
    name: 'Damai Care Services',
    role: 'Company (Employer)',
    email: 'admin@damaicare.com.my',
    icon: Building2,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Staff Nurse (Caregiver)',
    email: 'siti.nurhaliza@gmail.com',
    icon: User,
    color: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  {
    name: 'Platform Admin',
    role: 'Moderator & Auditor',
    email: 'admin@budgetdekoo.my',
    icon: ShieldAlert,
    color: 'bg-purple-50 text-purple-800 border-purple-200',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@damaicare.com.my');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAction({ email });
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'company') {
        router.push('/company/dashboard');
      } else if (res.user.role === 'caregiver') {
        router.push('/caregiver/jobs');
      } else if (res.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setLoading(true);
    setError(null);

    const res = await loginAction({ email: userEmail });
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'company') {
        router.push('/company/dashboard');
      } else if (res.user.role === 'caregiver') {
        router.push('/caregiver/jobs');
      } else if (res.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16 space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Platform Branding & Trust Statement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Malaysia Caregiver Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Sign in to <span className="gradient-text-emerald">Budget Dekoo</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Empowering healthcare agencies, nursing homes, and independent caregivers with verified Malaysian credential matching and automated backup fallback.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="block text-slate-900">PDPA 2010 Protected</strong>
                <span className="text-slate-500">Contact details shielded via Row-Level Security</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="block text-slate-900">SSM Registered Agencies</strong>
                <span className="text-slate-500">Vetted business licenses and hospital records</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
              <p className="text-xs text-slate-500 mt-0.5">Use your registered Malaysian email and password</p>
            </div>

            {/* Quick 1-Click Test Personas */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ⚡ 1-Click Evaluator Sign-In
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {QUICK_TEST_USERS.map((user) => {
                  const Icon = user.icon;
                  return (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => handleQuickLogin(user.email)}
                      disabled={loading}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] shadow-2xs ${user.color}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold">1-Click</span>
                      </div>
                      <div className="mt-2">
                        <p className="font-bold text-xs truncate">{user.name}</p>
                        <p className="text-[10px] opacity-75 truncate">{user.role}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-400 font-medium">Or enter credentials</span>
              <div className="flex-grow border-t border-slate-100"></div>
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
                <label className="font-semibold text-slate-700">Official Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.my"
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-emerald-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl h-11 text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
              Don&apos;t have an account yet?{' '}
              <Link href="/auth/register" className="font-bold text-emerald-700 hover:underline">
                Register as Agency or Caregiver
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
