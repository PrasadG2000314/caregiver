'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types/database.types';
import { setUserAccountStatusAction } from '@/app/actions/admin-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, User, ShieldAlert, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Account Status</th>
              <th className="px-5 py-3.5">PDPA Consent</th>
              <th className="px-5 py-3.5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialProfiles.map((user) => {
              const isSuspended = user.account_status === 'suspended';
              const isFlagged = user.account_status === 'flagged';
              const isActive = user.account_status === 'active';

              return (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        {user.role === 'company' && <Building2 className="w-4 h-4" />}
                        {user.role === 'caregiver' && <User className="w-4 h-4" />}
                        {user.role === 'admin' && <ShieldAlert className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.full_name}</p>
                        <p className="text-[11px] text-slate-400">{user.email} • {user.phone || 'No phone'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="capitalize font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={isActive ? 'default' : isSuspended ? 'destructive' : 'warning'}
                      className="uppercase text-[10px] font-bold"
                    >
                      {user.account_status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {user.pdpa_consent_at ? (
                      <span className="flex items-center gap-1 text-emerald-700 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Consented
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    {user.role !== 'admin' && (
                      <>
                        {isActive ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(user.id, 'flagged')}
                              disabled={loadingId === user.id}
                              className="px-2.5 py-1 text-amber-700 hover:bg-amber-50 rounded border border-amber-200 text-xs font-semibold"
                            >
                              Flag
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              disabled={loadingId === user.id}
                              className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded border border-rose-200 text-xs font-semibold"
                            >
                              Suspend
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            disabled={loadingId === user.id}
                            className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200 text-xs font-semibold"
                          >
                            Reactivate Account
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

