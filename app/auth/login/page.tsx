'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';

const QUICK_TEST_USERS = [
  {
    name: 'Damai Care Services',
    role: 'Company (Employer)',
    email: 'admin@damaicare.com.my',
    icon: Building2,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80',
    tag: 'SSM Verified'
  },
  {
    name: 'Siti Nurhaliza, SRN',
    role: 'Staff Nurse (Caregiver)',
    email: 'siti.nurhaliza@gmail.com',
    icon: User,
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80',
    tag: 'Board Certified'
  },
  {
    name: 'Platform Auditor',
    role: 'Admin & Compliance',
    email: 'admin@budgetdekoo.my',
    icon: ShieldAlert,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200/80',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80',
    tag: 'Full Access'
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@damaicare.com.my');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-14 space-y-6">
      
      {/* Top PDPA Banner */}
      <PDPABanner compact />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Visual Brand Card with Real Photography */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800 text-white flex flex-col justify-between p-8 min-h-[520px]">
          {/* Background Photo with Dark Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80"
              alt="Malaysian healthcare professional with senior resident"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover opacity-25 filter grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40" />
          </div>

          {/* Top Content */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Malaysia Caregiver Network</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Sign In to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Budget Dekoo
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Empowering healthcare agencies, hospices, and certified nurses across Malaysia with vetted credential matching and instant backup fallback protection.
            </p>
          </div>

          {/* Bottom Card: Testimonial & Security Badges */}
          <div className="relative z-10 space-y-4 pt-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &quot;The instant backup candidate guarantee eliminated our weekend nurse shortage scrambles completely.&quot;
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <Image
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80"
                  alt="Dr. Raymond Tan"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400"
                />
                <div className="text-[11px]">
                  <p className="font-bold text-white">Dr. Raymond Tan</p>
                  <p className="text-slate-400">Medical Director, Petaling Jaya</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>PDPA 2010 RLS Shield</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>SSM Audited Agencies</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Login Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-xs text-slate-500">
                Sign in with your registered Malaysian account credentials or use quick test evaluator access below.
              </p>
            </div>

            {/* Quick 1-Click Test Personas */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Click Evaluator Access</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Instant Test Sign-in
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {QUICK_TEST_USERS.map((user) => {
                  const Icon = user.icon;
                  return (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => handleQuickLogin(user.email)}
                      disabled={loading}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-sm ${user.badgeColor} group`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="relative">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                          />
                        </div>
                        <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.5 rounded-md">
                          {user.tag}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <p className="font-bold text-xs truncate group-hover:text-emerald-950">{user.name}</p>
                        <p className="text-[10px] opacity-75 truncate">{user.role}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-400 font-medium">Or enter your email</span>
              <div className="flex-grow border-t border-slate-100"></div>
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
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Registered Email Address</span>
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nurse@hospital.com.my"
                  className="rounded-xl h-11 text-xs border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl h-11 text-xs pr-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </Button>
            </form>

            {/* Bottom Registration Prompt */}
            <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 flex items-center justify-center gap-1.5">
              <span>New to Budget Dekoo?</span>
              <Link href="/auth/register" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
                Register as Caregiver or Agency
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
