'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your account email to receive a password reset link.</CardDescription>
        </CardHeader>
        {submitted ? (
          <CardContent className="space-y-4 text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800">Password Reset Email Dispatched</h3>
            <p className="text-xs text-slate-600">
              If an account matches <strong>{email}</strong>, we have dispatched a secure password reset link. Please check your inbox and spam folder.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Account Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nurse@budgetdekoo.my"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Send Recovery Link</Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

