import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMYR(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDateMY(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return 'Hidden (PDPA Protected)';
  // Display only first 4 digits and last 2 digits, e.g., +60 12 *** *781
  const cleaned = phone.trim();
  if (cleaned.length <= 6) return '***-***';
  return cleaned.substring(0, 5) + ' ••• •' + cleaned.substring(cleaned.length - 3);
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return 'Hidden';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

