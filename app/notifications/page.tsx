import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { Bell, CheckCircle2, ArrowRight } from 'lucide-react';

export default async function NotificationsPage() {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || '20000000-0000-0000-0000-000000000001';
  const notifications = db.getUserNotifications(userId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Notification Center</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time updates regarding shift applications, booking confirmations, backup status, and agency alerts.
        </p>
      </div>

      <PDPABanner compact />

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No notifications at this time.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 text-xs ${
                n.is_read 
                  ? 'bg-white border-slate-200 text-slate-600' 
                  : 'bg-emerald-50/50 border-emerald-300 text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${n.is_read ? 'bg-slate-100 text-slate-500' : 'bg-emerald-600 text-white'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 hover:bg-slate-50 font-semibold shrink-0 flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

