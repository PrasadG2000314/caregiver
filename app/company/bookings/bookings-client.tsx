'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Booking, Caregiver, Profile, Job, Application } from '@/lib/types/database.types';
import { cancelBookingAction, completeBookingAction, inviteBackupCandidateAction } from '@/app/actions/booking-actions';
import { formatMYR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/dialog';
import { 
  CalendarCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  History,
  Phone,
  Mail,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface Props {
  initialBookings: (Booking & { job: Job; caregiver: Caregiver & { profile: Profile } })[];
  companyId: string;
}

export function CompanyBookingsClient({ initialBookings, companyId }: Props) {
  const router = useRouter();

  // Cancel Modal
  const [cancelModalBooking, setCancelModalBooking] = useState<typeof initialBookings[0] | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Backup Candidate Instant Invite Modal
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupJobTitle, setBackupJobTitle] = useState('');
  const [cancelledBookingId, setCancelledBookingId] = useState<string | null>(null);
  const [backupCandidates, setBackupCandidates] = useState<(Application & { caregiver: Caregiver & { profile: Profile } })[]>([]);
  const [invitingBackup, setInvitingBackup] = useState(false);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;

    setCancelling(true);
    const res = await cancelBookingAction(cancelModalBooking.id, companyId, cancelReason);
    setCancelling(false);

    if (res.success && res.booking) {
      const bJob = cancelModalBooking.job;
      const candidates = res.backupCandidates || [];
      
      setCancelModalBooking(null);
      setCancelReason('');

      // If backup candidates exist, prompt the fallback workflow immediately!
      if (candidates.length > 0) {
        setBackupJobTitle(bJob.title);
        setCancelledBookingId(res.booking.id);
        setBackupCandidates(candidates);
        setBackupModalOpen(true);
      } else {
        alert('Booking cancelled. The job listing has been reopened for applicants.');
        router.refresh();
      }
    } else {
      alert(res.error || 'Failed to cancel booking.');
    }
  };

  const handleConfirmBackup = async (backupAppId: string) => {
    if (!cancelledBookingId) return;

    setInvitingBackup(true);
    const res = await inviteBackupCandidateAction(cancelledBookingId, backupAppId, companyId);
    setInvitingBackup(false);

    if (res.success) {
      alert('Backup candidate confirmed! A new active booking has been issued.');
      setBackupModalOpen(false);
      router.refresh();
    } else {
      alert(res.error || 'Failed to confirm backup candidate.');
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (!confirm('Mark this caregiving engagement as successfully Completed?')) return;

    const res = await completeBookingAction(bookingId, companyId);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to complete booking.');
    }
  };

  return (
    <div className="space-y-4">
      {initialBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs space-y-2">
          <p className="font-semibold text-slate-700 text-sm">No care bookings placed yet</p>
          <p className="text-slate-400">Confirm shortlisted candidates from your job applicants to create bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            const isCompleted = b.status === 'completed';
            const isCancelled = b.status === 'cancelled';
            const profile = b.caregiver?.profile;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover-lift ${
                  isConfirmed 
                    ? 'border-emerald-300/80 ring-1 ring-emerald-500/10' 
                    : isCompleted
                    ? 'border-blue-200/80 bg-blue-50/10'
                    : 'border-slate-200/80 opacity-90'
                }`}
              >
                <div className="space-y-3 max-w-2xl">
                  {/* Title & Ref */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                      {b.job?.title}
                    </h3>
                    
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                        : isCompleted
                        ? 'bg-blue-100 text-blue-800 border border-blue-300/60'
                        : 'bg-rose-100 text-rose-800 border border-rose-300/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? 'bg-emerald-600 animate-pulse' : isCompleted ? 'bg-blue-600' : 'bg-rose-600'}`} />
                      {b.status}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      Ref: #{b.id.substring(0, 8)}
                    </span>
                  </div>

                  {/* Caregiver Contact & Location */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 bg-slate-100/70 px-2.5 py-1 rounded-lg">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      {profile?.full_name}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 bg-emerald-50/50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {profile?.phone}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.job?.location_city}, {b.job?.location_state}
                    </span>
                  </div>

                  {/* Dates & Rate */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.start_date} to {b.end_date}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100">
                      Agreed Rate: {formatMYR(b.agreed_rate)} / shift
                    </span>
                  </div>

                  {b.cancellation_reason && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-800 leading-relaxed">
                      <strong>Recorded Cancellation Reason:</strong> {b.cancellation_reason}
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2.5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {isConfirmed && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteBooking(b.id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 gap-1.5 w-full sm:w-auto rounded-xl shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Completed</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCancelModalBooking(b);
                          setCancelReason('');
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 rounded-xl"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Cancel Booking
                      </Button>
                    </>
                  )}

                  {isCancelled && (
                    <div className="text-xs text-slate-400 italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      Shift Terminated & Reopened
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Shift Completed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mandatory Cancellation Reason Modal */}
      <Modal
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        title="Cancel Caregiver Booking"
        description="A mandatory cancellation reason must be recorded for audit and dispute resolution."
        className="max-w-lg"
      >
        <form onSubmit={handleCancelSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Cancellation Policy & Instant Backup Option
            </p>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Cancelling will release the primary caregiver. If you have flagged <strong>Backup Candidates</strong>, you will immediately be given the option to confirm them in 1-click.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              Reason for Cancellation <span className="text-rose-500">*</span>
            </label>
            <Textarea
              required
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Patient hospital schedule changed / Caregiver reported emergency / Language preference adjustment."
              className="rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setCancelModalBooking(null)} className="rounded-xl">
              Abort
            </Button>
            <Button type="submit" variant="destructive" disabled={cancelling || !cancelReason.trim()} className="rounded-xl">
              {cancelling ? 'Recording Cancellation...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Fallback Backup Candidate Selection Modal */}
      <Modal
        isOpen={backupModalOpen}
        onClose={() => {
          setBackupModalOpen(false);
          router.refresh();
        }}
        title="⚡ Invite Backup Candidate Immediately"
        description={`The booking for "${backupJobTitle}" was cancelled. Select an alternate shortlisted candidate below:`}
        className="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Prioritized Shortlisted Candidates Available
            </p>
            <p className="text-[11px] text-teal-900 leading-relaxed">
              These caregivers were pre-flagged as backup candidates. Confirming will generate a new active booking without needing to re-advertise the shift.
            </p>
          </div>

          <div className="space-y-3">
            {backupCandidates.map((candidate) => {
              const cg = candidate.caregiver;
              return (
                <div key={candidate.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-emerald-300 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{cg.profile.full_name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {cg.years_experience} yrs exp
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cg.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {cg.skills.slice(0, 3).map(s => (
                        <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={invitingBackup}
                    onClick={() => handleConfirmBackup(candidate.id)}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 shrink-0 text-xs font-semibold rounded-xl"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Confirm Backup</span>
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setBackupModalOpen(false);
                router.refresh();
              }}
              className="rounded-xl"
            >
              Skip (Keep Job Open on Marketplace)
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
