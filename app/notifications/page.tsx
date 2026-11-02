import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CalendarCheck, 
  Clock, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Zap,
  SlidersHorizontal
} from 'lucide-react';

export default async function NotificationsPage() {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id || '20000000-0000-0000-0000-000000000001';
  const notifications = db.getUserNotifications(userId);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity & Real-Time Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time updates regarding shift applications, booking confirmations, backup status, and agency alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
            {unreadCount} Unread Alerts
          </span>
        )}
      </div>

      <PDPABanner compact />

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500 text-xs space-y-3 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-700 text-sm">No notifications right now</p>
          <p className="text-slate-400">You will be alerted when agencies review your application or confirm shift bookings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isBooking = n.title.toLowerCase().includes('booking') || n.title.toLowerCase().includes('confirmed');
            const isBackup = n.title.toLowerCase().includes('backup');

            return (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs hover-lift ${
                  !n.is_read 
                    ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-500/10' 
                    : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                    isBackup 
                      ? 'bg-amber-100 text-amber-800' 
                      : isBooking 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {isBackup ? <Zap className="w-4 h-4" /> : isBooking ? <CalendarCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed font-normal">{n.message}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-emerald-700 hover:bg-slate-50 font-bold shrink-0 flex items-center justify-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
