import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getCurrentUser } from "./actions/auth-actions";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import { db } from "@/lib/services/data-service";

export const metadata: Metadata = {
  title: "Budget Dekoo — Malaysia Caregiver Matching Platform",
  description: "Connecting verified healthcare companies with qualified Malaysian caregivers, nurses, and elderly care specialists.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#059669",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const unreadCount = currentUser 
    ? db.getUserNotifications(currentUser.id).filter(n => !n.is_read).length 
    : 0;

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar currentUser={currentUser} unreadCount={unreadCount} />
        
        <main className="flex-1 pb-16 md:pb-8">
          {children}
        </main>

        <MobileNav currentUser={currentUser} />

        {/* Desktop Footer */}
        <footer className="hidden md:block bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Budget Dekoo (Malaysia)</span>
              <span>•</span>
              <span>Caregiver Matching Platform (Lean MVP)</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Currency: <strong>MYR (RM)</strong></span>
              <span>•</span>
              <span>Compliance: <strong>PDPA 2010</strong></span>
              <span>•</span>
              <span>App ID: <strong>com.budgetdekoo.app</strong></span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

