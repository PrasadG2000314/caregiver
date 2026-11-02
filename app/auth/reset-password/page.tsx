'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordAction } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Strength calculations
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!token || !email) {
      setError('Missing or invalid recovery token. Please request a new recovery link.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await resetPasswordAction(token, email, newPassword);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to reset password.');
    }
  };

  if (!email || !token) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Invalid Recovery Link</h2>
          <p className="text-xs text-slate-500">
            This password reset link is missing required authorization parameters.
          </p>
        </div>
        <Link
          href="/auth/forgot-password"
          className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Request New Recovery Link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-xs space-y-6">
      <div className="space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set New Password</h1>
        <p className="text-xs text-slate-500">
          Resetting password for registered account: <strong className="text-slate-800">{email}</strong>
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">Password Successfully Updated</h3>
            <p className="text-xs text-slate-600">
              Your new password has been cryptographically hashed and saved. You can now sign in to your portal.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-block w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-all"
          >
            Sign In with New Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>New Password</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="rounded-xl h-11 text-xs pr-10 border-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step <= strengthScore ? 'bg-emerald-600' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 pt-1">
              <span className={hasMinLength ? 'text-emerald-700 font-semibold' : ''}>✓ 8+ chars</span>
              <span className={hasNumber ? 'text-emerald-700 font-semibold' : ''}>✓ Number</span>
              <span className={hasUpper ? 'text-emerald-700 font-semibold' : ''}>✓ Uppercase</span>
              <span className={hasSpecial ? 'text-emerald-700 font-semibold' : ''}>✓ Symbol</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Confirm New Password</span>
            </label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="rounded-xl h-11 text-xs border-slate-200"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs shadow-md shadow-emerald-600/20"
          >
            {loading ? 'Updating Password...' : 'Save New Password & Continue'}
          </Button>
        </form>
      )}

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <Link 
        href="/auth/login" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>

      <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading recovery details...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

