import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ShieldAlert, Mail } from 'lucide-react';

export default function AccountStatusPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 text-center">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Account Access Restricted</h1>
        <p className="text-sm text-slate-500">
          Your account has been temporarily flagged or suspended in accordance with Budget Dekoo&apos;s Trust & Safety standards.
        </p>
      </div>

      <Card className="text-left">
        <CardContent className="pt-6 space-y-3 text-xs text-slate-600">
          <p>
            Common reasons for restriction include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unverified or mismatched SSM company registration documents.</li>
            <li>Inclusion of prohibited patient identifiable details in public postings.</li>
            <li>Multiple scheduling cancellations without prior notice.</li>
          </ul>
          <p className="pt-2">
            To appeal this restriction or submit supplemental proof, please email our moderation team:
          </p>
          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-2 font-mono text-slate-800">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>compliance@budgetdekoo.my</span>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full text-center text-xs font-semibold text-emerald-600 hover:underline">
            Return to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

