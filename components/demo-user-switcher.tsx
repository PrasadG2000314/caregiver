'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { switchDemoUser } from '@/app/actions/auth-actions';
import { UserCheck, ChevronDown, Building2, User, ShieldAlert, Sparkles } from 'lucide-react';
import { Profile } from '@/lib/types/database.types';

const DEMO_ACCOUNTS = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Damai Care Services (Company)',
    sub: 'Petaling Jaya, Selangor • Verified SSM',
    role: 'company',
    defaultRoute: '/company/dashboard',
    initials: 'DC',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Penang SilverCare (Company)',
    sub: 'Georgetown, Penang • Verified SSM',
    role: 'company',
    defaultRoute: '/company/dashboard',
    initials: 'SC',
    color: 'from-teal-600 to-cyan-600',
  },
  {
    id: '20000000-0000-0000-0000-000000000001',
    name: 'Siti Nurhaliza (Staff Nurse)',
    sub: '6 yrs exp • Palliative & Wound Care',
    role: 'caregiver',
    defaultRoute: '/caregiver/jobs',
    initials: 'SN',
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    name: 'Tan Mei Ling (Caregiver)',
    sub: '4 yrs exp • Dementia Specialist',
    role: 'caregiver',
    defaultRoute: '/caregiver/jobs',
    initials: 'TM',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Hafiz bin Rahman (Platform Admin)',
    sub: 'Kuala Lumpur • Full Moderation & Audit',
    role: 'admin',
    defaultRoute: '/admin/dashboard',
    initials: 'HR',
    color: 'from-purple-600 to-indigo-600',
  },
];

export function DemoUserSwitcher({ currentUser }: { currentUser: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSwitch = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setIsPending(true);
    await switchDemoUser(acc.id);
    setIsOpen(false);
    setIsPending(false);
    router.push(acc.defaultRoute);
    router.refresh();
  };

  const currentRole = currentUser?.role || 'Guest';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs transition-all hover:border-slate-300"
        title="Quick Role Switcher for MVP Testing"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="hidden sm:inline text-slate-400 font-normal">Active:</span>
        <strong className="text-slate-900 truncate max-w-[120px]">
          {currentUser ? currentUser.full_name.split(' ')[0] : 'Demo User'}
        </strong>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
          currentRole === 'company' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : currentRole === 'caregiver'
            ? 'bg-teal-50 text-teal-800 border border-teal-200'
            : 'bg-purple-50 text-purple-800 border border-purple-200'
        }`}>
          {currentRole}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 text-xs animate-in zoom-in-95 duration-150">
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Role Switcher</span>
                </p>
                <p className="text-[11px] text-slate-400">Toggle identity to evaluate full platform workflows</p>
              </div>
            </div>

            <div className="max-h-84 overflow-y-auto p-1.5 space-y-1">
              {DEMO_ACCOUNTS.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSwitch(acc)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                      isCurrent 
                        ? 'bg-emerald-50/80 text-emerald-950 font-medium border border-emerald-200/80 shadow-2xs' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${acc.color} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {acc.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate font-semibold text-slate-900 text-xs">{acc.name}</span>
                        {isCurrent && <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{acc.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-4 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              Malaysian seed dataset • All RBAC permissions active
            </div>
          </div>
        </>
      )}
    </div>
  );
}
