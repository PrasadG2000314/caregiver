'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Complaint, Profile, Job, ComplaintStatus } from '@/lib/types/database.types';
import { resolveComplaintAction } from '@/app/actions/admin-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  User, 
  Building2,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface Props {
  initialComplaints: (Complaint & { reporter: Profile; reportedUser?: Profile; reportedJob?: Job })[];
  adminId: string;
}

export function AdminComplaintsClient({ initialComplaints, adminId }: Props) {
  const router = useRouter();

  const [selectedComplaint, setSelectedComplaint] = useState<typeof initialComplaints[0] | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<ComplaintStatus>('resolved');
  const [resolving, setResolving] = useState(false);

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setResolving(true);
    const res = await resolveComplaintAction(selectedComplaint.id, adminId, resolutionStatus, resolutionNotes);
    setResolving(false);

    if (res.success) {
      setSelectedComplaint(null);
      setResolutionNotes('');
      router.refresh();
    } else {
      alert(res.error || 'Failed to update complaint resolution.');
    }
  };

  return (
    <div className="space-y-4">
      {initialComplaints.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500 text-xs shadow-xs">
          No complaints or disputes reported.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialComplaints.map((c) => {
            const isOpen = c.status === 'open';
            const isUnderReview = c.status === 'under_review';
            const isResolved = c.status === 'resolved';

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs hover-lift transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">{c.category}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isResolved 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : isOpen 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Filed on {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed font-normal">
                  {c.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
                  <span>
                    Reported by: <strong className="text-slate-900">{c.reporter?.full_name}</strong>
                  </span>
                  {c.reportedJob && (
                    <span>
                      Job Subject: <strong className="text-slate-900">{c.reportedJob.title}</strong>
                    </span>
                  )}
                  {c.reportedUser && (
                    <span>
                      Against User: <strong className="text-slate-900">{c.reportedUser.full_name}</strong>
                    </span>
                  )}
                </div>

                {c.resolution_notes && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Official Resolution
                    </span>
                    <p className="text-[11px] leading-relaxed">{c.resolution_notes}</p>
                  </div>
                )}

                {!isResolved && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedComplaint(c);
                        setResolutionNotes(c.resolution_notes || '');
                      }}
                      className="text-xs font-bold gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Review & Resolve Complaint</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Resolve Complaint or Reported Job"
        description="Record official administrative action for audit logging."
        className="max-w-md"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Resolution Status</label>
            <select
              value={resolutionStatus}
              onChange={(e) => setResolutionStatus(e.target.value as ComplaintStatus)}
              className="w-full h-11 px-3.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="under_review">Under Review / Investigation</option>
              <option value="resolved">Resolved (Action Taken)</option>
              <option value="dismissed">Dismissed (No Violation Found)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Official Resolution Notes</label>
            <Textarea
              required
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Record details of communication, correction, or penalty applied."
              className="rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setSelectedComplaint(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={resolving || !resolutionNotes.trim()} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
              {resolving ? 'Submitting Resolution...' : 'Record Resolution'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
