'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Profile } from '@/lib/types/database.types';
import { DemoUserSwitcher } from './demo-user-switcher';
import { 
  HeartHandshake, 
  Briefcase, 
  Users, 
  CalendarCheck, 
  Bell, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  Building,
  UserCheck,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { logoutAction } from '@/app/actions/auth-actions';

export function Navbar({ currentUser, unreadCount = 0 }: { currentUser: Profile | null; unreadCount?: number }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = currentUser?.role;

  const navLinks = [
    // Company Links
    ...(role === 'company' ? [
      { href: '/company/dashboard', label: 'Dashboard', icon: Briefcase },
      { href: '/company/jobs', label: 'Manage Jobs', icon: FileText },
      { href: '/company/bookings', label: 'Bookings', icon: CalendarCheck },
      { href: '/company/profile', label: 'SSM & Profile', icon: Building },
    ] : []),
    // Caregiver Links
    ...(role === 'caregiver' ? [
      { href: '/caregiver/jobs', label: 'Find Shifts', icon: Briefcase },
      { href: '/caregiver/applications', label: 'My Applications', icon: FileText },
      { href: '/caregiver/bookings', label: 'My Bookings', icon: CalendarCheck },
      { href: '/caregiver/profile', label: 'Caregiver Profile', icon: UserCheck },
    ] : []),
    // Admin Links
    ...(role === 'admin' ? [
      { href: '/admin/dashboard', label: 'Overview', icon: ShieldCheck },
      { href: '/admin/companies', label: 'SSM Verifications', icon: Building },
      { href: '/admin/users', label: 'User Moderation', icon: Users },
      { href: '/admin/complaints', label: 'Disputes & Reports', icon: Bell },
      { href: '/admin/audit-logs', label: 'Audit Trail', icon: FileText },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/30 transition-all duration-300">
                  <HeartHandshake className="w-5 h-5 transition-transform group-hover:rotate-6" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                  Budget Dekoo
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60 tracking-wider">
                    MY
                  </span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-0.5 hidden sm:block tracking-wide">
                  Malaysia Caregiver Network
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200/80' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-3">
            {/* Notifications Link */}
            {currentUser && (
              <Link 
                href="/notifications" 
                className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
                title="Notification Center"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Demo User Role Switcher */}
            <DemoUserSwitcher currentUser={currentUser} />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation Menu</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
              Role: {currentUser?.role || 'Guest'}
            </span>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-300'}`} />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <button
              onClick={async () => {
                await logoutAction();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Platform</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
