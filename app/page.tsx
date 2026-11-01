import Link from 'next/link';
import { getCurrentUser } from './actions/auth-actions';
import { PDPABanner } from '@/components/pdpa-banner';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  BadgePercent,
  Sparkles,
  HeartHandshake,
  Check,
  Star,
  Activity,
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';
import { db } from '@/lib/services/data-service';
import { formatMYR } from '@/lib/utils';
import { MALAYSIAN_STATES } from '@/lib/malaysia-data';

export default async function HomePage() {
  const currentUser = await getCurrentUser();
  const openJobs = db.getJobs({ status: 'open' });
  const companies = db.getAllCompanies();
  const caregivers = db.getAllCaregivers();

  return (
    <div className="space-y-16 py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* PDPA Compliance Top Alert */}
      <PDPABanner />

      {/* Hero Section */}
      <section className="relative text-center space-y-6 max-w-4xl mx-auto pt-6 pb-4">
        {/* Decorative ambient background glows */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full gradient-hero-badge text-emerald-900 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-600 -ml-4" />
          <span>Malaysia&apos;s Healthcare & Eldercare Network • PDPA 2010 Guarded</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Find Qualified Malaysian Caregivers with <span className="gradient-text-emerald">Instant Fallback Protection</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Connecting SSM-registered care agencies and nursing homes with vetted home nurses, stroke rehabilitation assistants, and geriatric companions across <strong>Klang Valley, Penang, Johor</strong>, and beyond.
        </p>

        {/* Action Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Link
            href="/company/jobs/new"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Building2 className="w-4 h-4 text-emerald-100" />
            <span>Hire Caregivers (Post Shift)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/caregiver/jobs"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Find Care Shifts (Nurses)</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>SSM Verified Companies</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Patient Info Leaks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Instant Backup Candidate Fallback</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>MYR / RM Transparent Rates</span>
          </div>
        </div>
      </section>

      {/* Verified Platform Metrics Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <HeartHandshake className="w-96 h-96 -mr-16 -mb-16" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center relative z-10">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">100%</p>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">SSM Verified Agencies</p>
            <p className="text-[11px] text-slate-400">Suruhanjaya Syarikat Malaysia audited</p>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-teal-400">16 States</p>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Coverage Across Malaysia</p>
            <p className="text-[11px] text-slate-400">Klang Valley, Penang, Johor & Sabah</p>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-300">&lt; 2 Mins</p>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Backup Replacement</p>
            <p className="text-[11px] text-slate-400">Instant fallback on shift cancellation</p>
          </div>

          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-amber-400">RM 150 – 350</p>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Market Day Rates</p>
            <p className="text-[11px] text-slate-400">Fair transparent compensation</p>
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars of Budget Dekoo */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Engineered Specifically for Malaysian Healthcare
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Addressing reliability, caregiver safety, and patient data compliance in one unified system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Instant Backup Candidate Fallback</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When shortlisting candidates, companies can flag secondary applicants as <strong>&quot;Backup Candidates&quot;</strong>. If an emergency or illness occurs, the agency is prompted with an instant 1-click fallback offer.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Zero-downtime caregiver replacement</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Strict PDPA 2010 Privacy Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient identifiable details (NRIC, full name, unit addresses) are strictly prohibited in public listings. Caregiver phone numbers and CVs are encrypted and visible only to verified companies with active applications.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
              <Check className="w-4 h-4 text-teal-600" />
              <span>PostgreSQL RLS row encryption</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">SSM Verification Gatekeeper</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hiring organizations must upload official Suruhanjaya Syarikat Malaysia (SSM) registration proof. Administrators review submissions and approve verified badges before employer contact access is unlocked.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <Check className="w-4 h-4 text-amber-600" />
              <span>Legitimate healthcare operators only</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Shifts Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Featured Open Shifts in Malaysia</h2>
            <p className="text-xs text-slate-500">Live verified postings ready for qualified nurses and assistants</p>
          </div>
          <Link
            href="/caregiver/jobs"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>Explore all shifts ({openJobs.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openJobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-lift flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company.company_name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        SSM Verified
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl text-sm border border-emerald-200/80">
                      {formatMYR(job.offered_rate)}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">per shift</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location_city}, {job.location_state}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.shift_duration_hours} hrs/shift
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {job.start_date} to {job.end_date}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.responsibilities}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.required_skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-[11px] bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-md border border-teal-100 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Eligibility: {job.work_eligibility_requirements || 'Malaysian Citizen (MyKad)'}
                </span>
                <Link
                  href="/caregiver/jobs"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Apply for Shift
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table / Callout: Traditional Agency vs Budget Dekoo */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">The Modern Difference</span>
          <h2 className="text-2xl font-black text-slate-900">Why Healthcare Agencies Choose Budget Dekoo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-700 text-sm">❌ Traditional Informal Matching</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Unscreened WhatsApp groups with frequent last-minute no-shows.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Patient IC and personal addresses routinely exposed on unsecure chats.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>When a caregiver cancels, agencies scramble for hours with zero backup.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
            <h3 className="font-bold text-emerald-950 text-sm">✅ Budget Dekoo Platform Standard</h3>
            <ul className="space-y-2 text-xs text-emerald-900">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verified SSM agencies and Lembaga Jururawat Malaysia vetted credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Strict PDPA compliance and Row-Level Security masking caregiver direct contacts.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Backup Candidate Pool:</strong> Replace cancelled shifts in under 2 minutes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
