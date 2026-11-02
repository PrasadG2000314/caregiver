'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types/database.types';
import { setUserAccountStatusAction } from '@/app/actions/admin-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ShieldCheck,
  Calendar,
  Lock
} from 'lucide-react';

interface Props {
  initialProfiles: Profile[];
  adminId: string;
}

export function AdminUsersClient({ initialProfiles, adminId }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'flagged') => {
    setLoadingId(userId);
    const res = await setUserAccountStatusAction(userId, adminId, newStatus);
    setLoadingId(null);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to update user status.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-4">Account & User</th>
              <th className="px-6 py-4">Platform Role</th>
              <th className="px-6 py-4">Account Status</th>
              <th className="px-6 py-4">PDPA Compliance</th>
              <th className="px-6 py-4 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialProfiles.map((user) => {
              const isSuspended = user.account_status === 'suspended';
              const isFlagged = user.account_status === 'flagged';
              const isActive = user.account_status === 'active';

              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        user.role === 'company' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : user.role === 'caregiver'
                          ? 'bg-teal-50 text-teal-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {user.role === 'company' && <Building2 className="w-4 h-4" />}
                        {user.role === 'caregiver' && <User className="w-4 h-4" />}
                        {user.role === 'admin' && <ShieldAlert className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{user.full_name}</p>
                        <p className="text-[11px] text-slate-400">{user.email} • {user.phone || 'No phone'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isActive 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : isSuspended 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : isSuspended ? 'bg-rose-600' : 'bg-amber-600'}`} />
                      {user.account_status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {user.pdpa_consent_at ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PDPA Consented</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Pending</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    {user.role !== 'admin' && (
                      <>
                        {isActive ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(user.id, 'flagged')}
                              disabled={loadingId === user.id}
                              className="px-3 py-1.5 text-amber-700 hover:bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold transition-colors"
                            >
                              Flag
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              disabled={loadingId === user.id}
                              className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 text-xs font-semibold transition-colors"
                            >
                              Suspend
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            disabled={loadingId === user.id}
                            className="px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold transition-colors"
                          >
                            Reactivate
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
