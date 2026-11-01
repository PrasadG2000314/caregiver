import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/services/data-service';
import { getCurrentUser } from '@/app/actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { Badge } from '@/components/ui/badge';
import { formatMYR } from '@/lib/utils';
import { ApplicantsClientList } from './applicants-client';
import { ArrowLeft, Building2, MapPin, Calendar, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const job = db.getJob(id);
  const currentUser = await getCurrentUser();

  if (!job) {
    notFound();
  }

  const applications = db.getApplicationsByJob(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <Link href="/company/jobs" className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <Badge 
              variant={job.status === 'open' ? 'default' : job.status === 'filled' ? 'secondary' : 'outline'}
              className="uppercase text-[10px] font-bold"
            >
              {job.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {job.location_city}, {job.location_state}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {job.start_date} to {job.end_date}
            </span>
            <span>•</span>
            <span className="font-bold text-emerald-700">{formatMYR(job.offered_rate)}/shift</span>
          </p>
        </div>
      </div>

      <PDPABanner compact />

      {/* Interactive Client Component for evaluating, shortlisting, backup flagging & booking confirmation */}
      <ApplicantsClientList 
        job={job}
        initialApplications={applications}
        companyId={currentUser?.id || job.company_id}
      />

    </div>
  );
}

