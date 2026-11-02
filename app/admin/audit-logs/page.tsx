import React from 'react';
import { db } from '@/lib/services/data-service';
import { PDPABanner } from '@/components/pdpa-banner';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ShieldCheck, 
  User, 
  Activity, 
  Clock, 
  Lock, 
  CheckCircle2,
  Database
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const auditLogs = db.getAuditLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-purple-700" />
            <span>Immutable Governance Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Administrative Audit Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cryptographically logged events of company verifications, booking confirmations, account moderation, and privacy operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs font-bold">
            {auditLogs.length} Events Recorded
          </span>
        </div>
      </div>

      <PDPABanner compact />

      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Timestamp (MYT / UTC)</th>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">Metadata Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap font-mono">
                    {new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-sans text-slate-800 font-semibold">
                    {log.actor?.full_name || 'System Automated'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-sans">
                    <span className="font-semibold">{log.entity_type}</span>{' '}
                    {log.entity_id ? (
                      <span className="text-slate-400 font-mono text-[10px]">
                        (#{log.entity_id.substring(0, 8)})
                      </span>
                    ) : ''}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-[11px] max-w-xs truncate font-mono">
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
