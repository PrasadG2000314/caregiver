import React from 'react';
import { db } from '@/lib/services/data-service';
import { PDPABanner } from '@/components/pdpa-banner';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, ShieldCheck, User } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const auditLogs = db.getAuditLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Administrative Audit Logs</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Immutable event log of company verifications, booking confirmations, account moderation, and privacy operations.
        </p>
      </div>

      <PDPABanner compact />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Timestamp (UTC)</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Actor</th>
                  <th className="px-5 py-3.5">Target Entity</th>
                  <th className="px-5 py-3.5">Metadata / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-sans text-slate-700">
                      {log.actor?.full_name || 'System / Automated'}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id.substring(0, 8)})` : ''}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

