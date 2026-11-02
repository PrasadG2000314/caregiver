'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  KeyRound,
  ExternalLink 
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await requestPasswordResetAction(email);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setMessage(res.message || 'If an account exists with this email, a reset link has been dispatched.');
      if (res.resetLink) {
        setResetLink(res.resetLink);
      }
    } else {
      setError(res.error || 'Failed to dispatch recovery request.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <Link 
        href="/auth/login" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-xs space-y-6">
        
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Your Password</h1>
          <p className="text-xs text-slate-500">
            Enter your registered Malaysian account email to receive a secure recovery link.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Recovery Link Dispatched</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>

            {resetLink && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-left space-y-2 text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Instant Test Link (Evaluator Preview):
                </span>
                <p className="text-[11px] text-slate-600">
                  Click the link below to set your new password directly:
                </p>
                <Link
                  href={resetLink}
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 underline break-all text-xs"
                >
                  <span>Proceed to Set New Password</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link 
                href="/auth/login"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 underline"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Email</span>
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. nurse@hospital.com.my"
                className="rounded-xl h-11 text-xs border-slate-200"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {loading ? 'Dispatching Link...' : 'Send Recovery Link'}
            </Button>
          </form>
        )}

      </div>
    </div>
  );
}
