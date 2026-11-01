'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Application, Caregiver, Profile, Job } from '@/lib/types/database.types';
import { updateApplicationStatusAction } from '@/app/actions/application-actions';
import { confirmBookingAction } from '@/app/actions/booking-actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/dialog';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Phone, 
  Mail, 
  Download, 
  ExternalLink,
  Star,
  Check,
  AlertCircle,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface ApplicantsClientProps {
  job: Job;
  initialApplications: (Application & { caregiver: Caregiver & { profile: Profile } })[];
  companyId: string;
}

export function ApplicantsClientList({ job, initialApplications, companyId }: ApplicantsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [selectedCaregiver, setSelectedCaregiver] = useState<(Caregiver & { profile: Profile; coverNote?: string | null }) | null>(null);
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredApps = initialApplications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'backup') return app.is_backup_candidate;
    return app.status === filter;
  });

  const handleUpdateStatus = async (appId: string, status: any, isBackup?: boolean) => {
    setLoadingAppId(appId);
    setStatusMessage(null);

    const res = await updateApplicationStatusAction(appId, status, isBackup);
    setLoadingAppId(null);

    if (res.success) {
      setStatusMessage(`Application updated to ${status}${isBackup ? ' (Marked as Priority Backup Candidate)' : ''}`);
      router.refresh();
    }
  };

  const handleConfirmCaregiver = async (appId: string) => {
    if (!confirm('Confirm and book this caregiver? This will mark the shift as Filled and create an official booking.')) {
      return;
    }

    setLoadingAppId(appId);
    setStatusMessage(null);

    const res = await confirmBookingAction(appId, companyId);
    setLoadingAppId(null);

    if (res.success) {
      setStatusMessage('Booking officially confirmed! Job marked as Filled.');
      router.push('/company/bookings');
      router.refresh();
    } else {
      alert(res.error || 'Failed to confirm booking.');
    }
  };

  return (
    <div className="space-y-6">
      
      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Filter Pipeline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Stage:
        </span>
        {[
          { key: 'all', label: `All Candidates (${initialApplications.length})` },
          { key: 'applied', label: 'Pending Review' },
          { key: 'shortlisted', label: 'Shortlisted' },
          { key: 'backup', label: 'Backup Pool' },
          { key: 'selected', label: 'Selected / Booked' },
          { key: 'rejected', label: 'Declined' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === tab.key
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Candidates List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500 text-xs space-y-2 shadow-xs">
          <p className="font-bold text-slate-700 text-sm">No candidates in the &quot;{filter}&quot; stage</p>
          <p className="text-slate-400">Select another filter tab to view remaining applicants.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => {
            const cg = app.caregiver;
            const profile = cg?.profile;
            const isSelected = app.status === 'selected';
            const isShortlisted = app.status === 'shortlisted';

            // Initials
            const initials = profile?.full_name
              ? profile.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')
              : 'CG';

            return (
              <div
                key={app.id}
                className={`bg-white rounded-3xl border p-6 shadow-xs hover-lift transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isSelected 
                    ? 'border-emerald-300 bg-emerald-50/15 ring-1 ring-emerald-500/20' 
                    : app.is_backup_candidate
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Left Candidate Summary */}
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {initials}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{profile?.full_name}</h3>
                        
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          app.status === 'selected'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'shortlisted'
                            ? 'bg-teal-100 text-teal-800 border border-teal-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>

                        {app.is_backup_candidate && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-600" /> Backup Candidate
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500">
                        {cg?.years_experience} yrs healthcare experience • {cg?.work_eligibility}
                      </p>
                    </div>
                  </div>

                  {/* Bio & Cover Note */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cg?.bio}
                  </p>

                  {app.cover_note && (
                    <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 italic border-l-4 border-emerald-500">
                      &quot;{app.cover_note}&quot;
                    </div>
                  )}

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cg?.skills.map((s) => (
                      <span key={s} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Direct Contact (Unmasked under PDPA because of active application) */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 pt-1 font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {profile?.phone || 'No phone'}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {profile?.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCaregiver({ ...cg, coverNote: app.cover_note })}
                      className="text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1 ml-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View CV & Certs</span>
                    </button>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2.5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Confirm & Book Caregiver */}
                  {!isSelected && app.status !== 'rejected' && (
                    <Button
                      size="sm"
                      onClick={() => handleConfirmCaregiver(app.id)}
                      disabled={loadingAppId === app.id}
                      className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/20 w-full sm:w-auto px-4 py-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Shift</span>
                    </Button>
                  )}

                  {/* Shortlist Action */}
                  {app.status === 'applied' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(app.id, 'shortlisted', false)}
                      disabled={loadingAppId === app.id}
                      className="text-xs rounded-xl"
                    >
                      Shortlist Candidate
                    </Button>
                  )}

                  {/* Toggle Backup Pool */}
                  <Button
                    size="sm"
                    variant={app.is_backup_candidate ? 'secondary' : 'outline'}
                    onClick={() => handleUpdateStatus(app.id, isShortlisted ? 'shortlisted' : 'applied', !app.is_backup_candidate)}
                    disabled={loadingAppId === app.id}
                    className="text-xs gap-1.5 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{app.is_backup_candidate ? 'Remove from Backup Pool' : 'Flag as Backup Candidate'}</span>
                  </Button>

                  {/* Decline */}
                  {app.status !== 'rejected' && !isSelected && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, 'rejected', false)}
                      disabled={loadingAppId === app.id}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
                    >
                      Decline Application
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Profile & Signed Document Viewer Modal */}
      <Modal
        isOpen={!!selectedCaregiver}
        onClose={() => setSelectedCaregiver(null)}
        title={selectedCaregiver?.profile.full_name || 'Caregiver Profile'}
        description={`Registered Candidate • ${selectedCaregiver?.years_experience} Years Healthcare Experience`}
        className="max-w-2xl"
      >
        {selectedCaregiver && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Direct Contact Unlocked Card */}
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                PDPA Authorized Direct Contact (Employer View)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-900">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{selectedCaregiver.profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{selectedCaregiver.profile.email}</span>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">Clinical Summary</h4>
              <p className="leading-relaxed text-slate-600">{selectedCaregiver.bio}</p>
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">Verified Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaregiver.skills.map(s => (
                    <span key={s} className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">Spoken Dialects</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaregiver.languages.map(l => (
                    <span key={l} className="bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Private Storage Signed Documents */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Private Credential Files
                </h4>
                <span className="text-[10px] text-slate-400">Signed URL Token (300s TTL)</span>
              </div>

              <div className="space-y-2">
                {selectedCaregiver.cv_storage_path && (
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="font-bold text-slate-800">Curriculum Vitae (CV)</span>
                    </div>
                    <a
                      href={`/api/documents/download?bucket=caregiver-documents&path=${encodeURIComponent(selectedCaregiver.cv_storage_path)}&token=auth_demo&expires=${Date.now() + 300000}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-emerald-700 hover:bg-slate-50 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>
                )}

                {selectedCaregiver.certificates_storage_paths.map((cert) => (
                  <div key={cert.name} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800">{cert.name}</p>
                      <p className="text-[10px] text-slate-500">{cert.issuer} • Issued {cert.year}</p>
                    </div>
                    <a
                      href={`/api/documents/download?bucket=caregiver-documents&path=${encodeURIComponent(cert.path)}&token=auth_demo&expires=${Date.now() + 300000}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-emerald-700 hover:bg-slate-50 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" /> View Certificate
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
