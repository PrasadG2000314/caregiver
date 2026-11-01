'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';

export function PDPABanner({ compact = false }: { compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-emerald-950 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-2.5 h-2.5" />
          </div>
          <span>
            <strong>Malaysia PDPA 2010 Protected:</strong> Patient clinical identities strictly prohibited in public fields. Caregiver contacts shielded.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Verified Safe
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-teal-50/90 via-emerald-50/90 to-teal-50/90 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-xs sm:text-sm text-slate-700">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm shadow-emerald-600/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                Malaysia Personal Data Protection Act 2010 (PDPA) Security Seal
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Active Policy
              </span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1"
            >
              <span>{expanded ? 'Show Less' : 'View Safeguards'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          <p className="text-slate-600 text-xs leading-relaxed">
            Budget Dekoo enforces strict medical and data privacy standards across the Malaysian territory.
            <strong> Public job postings must never disclose identifiable patient data</strong> (such as NRIC / MyKad numbers, full names, or home addresses).
          </p>

          {expanded && (
            <div className="pt-2.5 border-t border-emerald-200/60 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-600">
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <strong className="text-emerald-950 block mb-0.5">1. Caregiver Shielding</strong>
                Phone numbers and CVs are encrypted and visible only to verified companies receiving your application.
              </div>
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <strong className="text-emerald-950 block mb-0.5">2. Patient Anonymity</strong>
                All shift requirements describe duties and care procedures without clinical subject identification.
              </div>
              <div className="p-2.5 bg-white/70 rounded-lg border border-emerald-100">
                <strong className="text-emerald-950 block mb-0.5">3. 300s Signed Storage</strong>
                Credential files (SSM & Nursing certificates) are served exclusively via ephemeral short-lived tokens.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PatientPrivacyWarning() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-3.5 rounded-xl flex items-start gap-3 text-xs text-amber-950 shadow-xs">
      <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
        <AlertCircle className="w-4 h-4" />
      </div>
      <div>
        <p className="font-bold text-amber-950">Strict Prohibition on Patient Identifiable Information</p>
        <p className="text-amber-800/90 mt-0.5 leading-relaxed">
          Job postings containing patient MyKad / NRIC numbers, full patient names, unit numbers, or private medical diagnosis will be automatically blocked by our compliance filter.
        </p>
      </div>
    </div>
  );
}
