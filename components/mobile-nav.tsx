'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Profile } from '@/lib/types/database.types';
import { Briefcase, FileText, CalendarCheck, User, ShieldCheck } from 'lucide-react';

export function MobileNav({ currentUser }: { currentUser: Profile | null }) {
  const pathname = usePathname();
  const role = currentUser?.role;

  if (!currentUser) return null;

  const items = [
    ...(role === 'company' ? [
      { href: '/company/dashboard', label: 'Dashboard', icon: Briefcase },
      { href: '/company/jobs', label: 'Jobs', icon: FileText },
      { href: '/company/bookings', label: 'Bookings', icon: CalendarCheck },
      { href: '/company/profile', label: 'Profile', icon: User },
    ] : []),
    ...(role === 'caregiver' ? [
      { href: '/caregiver/jobs', label: 'Search', icon: Briefcase },
      { href: '/caregiver/applications', label: 'Applied', icon: FileText },
      { href: '/caregiver/bookings', label: 'Bookings', icon: CalendarCheck },
      { href: '/caregiver/profile', label: 'Profile', icon: User },
    ] : []),
    ...(role === 'admin' ? [
      { href: '/admin/dashboard', label: 'Stats', icon: ShieldCheck },
      { href: '/admin/companies', label: 'Verify', icon: Briefcase },
      { href: '/admin/complaints', label: 'Disputes', icon: FileText },
      { href: '/admin/audit-logs', label: 'Audit', icon: CalendarCheck },
    ] : []),
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg pb-safe">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

