'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { submitAppealAction } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShieldAlert, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  FileCheck2,
  Clock
} from 'lucide-react';

function AccountStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'suspended';

  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !reason) {
      setError('Please provide your account email and an explanation for your appeal.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await submitAppealAction(email, reason);
    setSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || 'Failed to record appeal.');
    }
  };

  const isPendingReview = status === 'pending_review';

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-6">
      
      <Link 
        href="/auth/login" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
            isPendingReview ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'
          }`}>
            {isPendingReview ? <Clock className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isPendingReview ? 'SSM Verification Under Review' : 'Account Access Restricted'}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {isPendingReview
              ? 'Your Suruhanjaya Syarikat Malaysia (SSM) business credentials have been submitted and are being reviewed by platform compliance officers.'
              : 'This account has been flagged or suspended in accordance with Budget Dekoo’s PDPA 2010 Trust & Safety guidelines.'}
          </p>
        </div>

        {/* Informational Guidance Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <span className="font-bold text-slate-900 block">Common reasons for account restrictions:</span>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
            <li>Unverified or mismatched SSM company registration documents.</li>
            <li>Inclusion of prohibited patient identifiable details (NRIC, private home address) in public postings.</li>
            <li>Unexcused cancellation of confirmed caregiver shift bookings.</li>
          </ul>
        </div>

        {/* Appeal Form */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm">Submit Compliance Appeal Ticket</h3>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs space-y-1.5 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">Appeal Ticket Logged Successfully</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Your explanation has been recorded in the administrative review queue. Our compliance team will review your case within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAppealSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Account Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nurse@hospital.com.my"
                  className="rounded-xl h-10 text-xs border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Explanation & Supporting Notes</label>
                <Textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context or updated SSM registration details..."
                  className="rounded-xl text-xs border-slate-200"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                {submitting ? 'Submitting Appeal...' : 'Submit Appeal Ticket'}
              </Button>
            </form>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Trust & Safety Desk: compliance@budgetdekoo.my</span>
          <Link href="/auth/login" className="font-bold text-emerald-700 hover:underline">
            Return to Sign In
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function AccountStatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading status details...</div>}>
      <AccountStatusContent />
    </Suspense>
  );
}
