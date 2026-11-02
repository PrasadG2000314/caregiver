import Link from 'next/link';
import Image from 'next/image';
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
  Sparkles, 
  HeartHandshake, 
  Check, 
  Star, 
  Activity, 
  Calendar, 
  Lock, 
  ChevronRight,
  PhoneCall,
  Award,
  Stethoscope,
  Heart,
  Users2,
  FileCheck2,
  ShieldAlert,
  Zap
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

      {/* ========================================================================= */}
      {/* HERO SECTION: Split Grid with Copy on Left & Real Healthcare Photo on Right */}
      {/* ========================================================================= */}
      <section className="relative pt-2 pb-8">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Hero Messaging & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Network Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full gradient-hero-badge text-emerald-900 text-xs font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Malaysia&apos;s Dedicated Caregiver Network • PDPA 2010 Protected</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Find Qualified Malaysian Caregivers with{' '}
              <span className="gradient-text-emerald">Instant Fallback Protection</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              Connecting SSM-registered care agencies and nursing residences with vetted home nurses, stroke rehabilitation aides, and geriatric companions across <strong>Klang Valley, Penang, Johor</strong>, and nationwide.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/company/jobs/new"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Building2 className="w-4 h-4 text-emerald-100" />
                <span>Hire Caregivers (Post Shift)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/caregiver/jobs"
                className="px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Find Care Shifts (Nurses)</span>
              </Link>
            </div>

            {/* Micro Social Proof & Avatars */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex -space-x-2.5 overflow-hidden py-1">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"
                  alt="Registered Nurse Malaysia"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80"
                  alt="Care Center Director"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <Image
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                  alt="Geriatric Aide"
                  width={36}
                  height={36}
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-slate-800 font-bold ml-1 text-xs">4.92 / 5.0</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Trusted by <strong>240+ care agencies</strong> & <strong>1,450+ verified nurses</strong>
                </p>
              </div>
            </div>

            {/* Quick Trust Checks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SSM Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Patient Leaks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant Backup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>MYR Transparent</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Frame with Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/4.8] group">
                <Image
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80"
                  alt="Compassionate certified caregiver attending to an elderly resident with dignity and clinical care in Malaysia"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                
                {/* Photo Caption Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-semibold flex items-center gap-1.5 text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Dignified, Professional Eldercare</span>
                  </p>
                  <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
                    Vetted home nurses & certified companions ready across Klang Valley & Penang.
                  </p>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 1: Top Right Caregiver Profile Card */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-200/90 max-w-[230px] hidden sm:block animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80"
                    alt="Siti Farhana SRN"
                    width={42}
                    height={42}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-slate-900">Siti Farhana, SRN</p>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                    <p className="text-[10px] text-slate-500">Geriatric & Stroke Specialist</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Available • Subang Jaya</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 2: Bottom Left Instant Fallback Pill */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-100 max-w-[240px] hidden sm:block">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">Instant Backup Fallback</p>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Replaces emergency shift dropouts in &lt; 2 minutes automatically.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* VERIFIED PLATFORM METRICS BANNER */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* PHOTO-BACKED CARE SPECIALIZATIONS SHOWCASE */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Specialized Care Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tailored Care for Every Medical & Personal Need
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              From companion care to acute post-operative medical support, discover trained Malaysian caregivers matching your exact clinical needs.
            </p>
          </div>
          <Link
            href="/caregiver/jobs"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group shrink-0"
          >
            <span>View All Active Shifts</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Category Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&w=800&q=80"
                alt="Elderly Companion Care"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  Geriatric Companion
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">Elderly & Daily Companion</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mobility assistance, daily nutrition, medication prompt, and empathetic cognitive engagement.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Standard rate</span>
                <span className="font-bold text-emerald-700">From RM 160 / shift</span>
              </div>
            </div>
          </div>

          {/* Category Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
                alt="Post-Stroke Rehabilitation"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-white/90 backdrop-blur-md text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-100">
                  Rehabilitation Aide
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">Post-Stroke & Mobility Rehab</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Passive range-of-motion routines, transfer techniques, wheelchair assist, and fall prevention.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Standard rate</span>
                <span className="font-bold text-teal-700">From RM 220 / shift</span>
              </div>
            </div>
          </div>

          {/* Category Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80"
                alt="Clinical Home Nursing"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  Registered Nurse (SRN)
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">Post-Hospital Clinical Nursing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Wound dressing, tracheostomy management, NGT tube feeding, and intravenous monitoring.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Standard rate</span>
                <span className="font-bold text-emerald-700">From RM 280 / shift</span>
              </div>
            </div>
          </div>

          {/* Category Card 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                alt="Palliative and Dementia Care"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-white/90 backdrop-blur-md text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                  Palliative & Dementia
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">Palliative & Memory Care</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gentle repositioning to avoid bedsores, pain symptom tracking, and overnight surveillance.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Standard rate</span>
                <span className="font-bold text-amber-700">From RM 200 / shift</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHOTO SPLIT SECTION: The Budget Dekoo Operational Standard */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual In-Action Healthcare Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-[4/3.8]">
              <Image
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80"
                alt="Verified healthcare staff conducting vitals check with patient"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold">
                  SSM Audited Facility
                </span>
                <p className="text-xs font-semibold mt-1">Direct Verification Without Unscreened WhatsApp Groups</p>
              </div>
            </div>
          </div>

          {/* Right Column: Key Operational Differentiators */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Operational Excellence</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Designed to Prevent Shift Scrambles and Data Leaks
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traditional caregiver hiring in Malaysia relies on informal chats where patient ICs are leaked and last-minute cancellations leave families in distress. Budget Dekoo enforces clinical-grade reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">Instant Backup Workflow</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Secondary shortlisted caregivers are designated as active backups. If an illness occurs, confirm replacement in under 2 minutes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">PDPA 2010 Encryption</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Caregiver phone numbers and patient identifying details are strictly masked and protected via PostgreSQL Row-Level Security.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">SSM Registration Audit</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Every care center, hospice, and clinic must submit valid SSM documentation verified manually by platform administrators.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">Signed Storage Links</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Nursing certificates, CPR credentials, and CVs are stored in private Supabase buckets served via 300-second expiring signed URLs.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED SHIFTS FEED */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Verified Shift Board</span>
            </div>
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

      {/* ========================================================================= */}
      {/* SOCIAL PROOF & AUTHENTIC MALAYSIAN REVIEWS (WITH REAL AVATARS) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Testimonials</span>
          <h2 className="text-2xl font-black text-slate-900">Trusted Across Malaysian Healthcare Centers</h2>
          <p className="text-xs text-slate-500">Real feedback from healthcare directors and registered nurses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Testimonial 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;Finding relief nurses for weekend night shifts used to take us 6 hours on WhatsApp with high cancellation rates. With Budget Dekoo, our shifts are filled quickly, and the instant backup guarantee gives our medical team total peace of mind.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=160&q=80"
                alt="Dr. Raymond Tan"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Raymond Tan</p>
                <p className="text-[11px] text-slate-500">Medical Director, Pusat Jagaan Kasih (Subang)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;I love the privacy protection under PDPA 2010. My personal phone number is never displayed to the general public until an SSM-verified agency shortlists me. The pay rates in MYR are fair, transparent, and direct.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80"
                alt="Siti Sarah Bt. Zainal"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Siti Sarah, SRN</p>
                <p className="text-[11px] text-slate-500">Private Care Nurse & Geriatric Specialist (KL)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;When a caregiver had an emergency and couldn&apos;t attend a Sunday shift, Budget Dekoo&apos;s Backup Candidate Fallback let us confirm the second-choice candidate with a single click in 90 seconds. A true game changer!&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&q=80"
                alt="Jasmina Kaur"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Jasmina Kaur</p>
                <p className="text-[11px] text-slate-500">Care Coordinator, SilverAge Residence (Penang)</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            Ready to Get Started?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Join Malaysia&apos;s Most Reliable Caregiver Platform
          </h2>
          <p className="text-sm text-emerald-50 leading-relaxed">
            Whether you represent a licensed care facility seeking verified relief staff, or you are a certified nurse looking for flexible, well-compensated shifts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/auth/register?role=company"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
            >
              Register SSM Organization
            </Link>
            <Link
              href="/auth/register?role=caregiver"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-900/40 border border-white/30 text-white font-bold text-sm hover:bg-emerald-900/60 transition-colors"
            >
              Register as Caregiver
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
