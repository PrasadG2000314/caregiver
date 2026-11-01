import { z } from 'zod';
import { MALAYSIAN_STATES } from '../malaysia-data';

// Helper regex for Malaysian phone: +601xxxxxxxx or 01xxxxxxxx
export const malaysianPhoneRegex = /^(\+?60|0)[1-9]\d{7,9}$/;

// Malaysian SSM Registration format: e.g. 202101099881 (1420181-T) or older format 123456-X
export const ssmRegex = /^(\d{12}|\d{6}-[A-Z]|\d{12}\s\(\d{7}-[A-Z]\))$/i;

// NRIC pattern for scan prohibition in job postings
export const nricPattern = /\b\d{6}-\d{2}-\d{4}\b|\b\d{12}\b/;

export const RegisterSchema = z.object({
  fullName: z.string().min(3, 'Full name is required (min 3 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(malaysianPhoneRegex, 'Please enter a valid Malaysian phone number (+601...)'),
  role: z.enum(['company', 'caregiver'], {
    errorMap: () => ({ message: 'Please select a valid account role' }),
  }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  pdpaConsent: z.boolean().refine(val => val === true, {
    message: 'You must consent to the Personal Data Protection Act (PDPA) notice to proceed.',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const JobPostSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters').max(100),
  locationState: z.string().min(1, 'Please select a Malaysian state'),
  locationCity: z.string().min(1, 'City/District is required'),
  locationArea: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  shiftDurationHours: z.coerce.number().min(1, 'Shift must be at least 1 hour').max(24),
  shiftNotes: z.string().max(500).optional(),
  offeredRate: z.coerce.number().min(50, 'Minimum rate is RM 50.00 per shift'),
  responsibilities: z.string().min(20, 'Please describe responsibilities (min 20 characters)'),
  requiredExperienceYears: z.coerce.number().min(0),
  requiredSkills: z.array(z.string()).min(1, 'Please select at least one required skill'),
  requiredLanguages: z.array(z.string()).min(1, 'Please select at least one required language'),
  workEligibilityRequirements: z.string().default('Malaysian Citizen (MyKad)'),
}).refine(data => {
  // Prohibit NRIC in responsibilities or notes
  const combined = `${data.title} ${data.responsibilities} ${data.shiftNotes || ''}`;
  return !nricPattern.test(combined);
}, {
  message: 'PDPA Violation: Identifiable patient NRIC / MyKad numbers are strictly prohibited in public job postings.',
  path: ['responsibilities'],
}).refine(data => {
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'End date must be on or after start date.',
  path: ['endDate'],
});

export const CaregiverProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  yearsExperience: z.coerce.number().min(0),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  availabilityStatus: z.boolean(),
  availabilityNotes: z.string().optional(),
  preferredLocations: z.array(z.string()),
  workEligibility: z.string(),
});

export const CompanyProfileSchema = z.object({
  companyName: z.string().min(3, 'Company name is required'),
  registrationNumber: z.string().min(6, 'Valid SSM registration number required'),
  address: z.string().min(5, 'Registered address is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  description: z.string().min(10, 'Please provide a company description'),
});

export const CancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().min(10, 'Mandatory cancellation reason required (min 10 characters)'),
});

export const ComplaintSchema = z.object({
  category: z.string().min(3, 'Category is required'),
  description: z.string().min(15, 'Please provide full details of the complaint (min 15 characters)'),
  reportedUserId: z.string().uuid().optional(),
  reportedJobId: z.string().uuid().optional(),
});

