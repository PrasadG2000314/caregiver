'use server';

import { db } from '@/lib/services/data-service';
import { revalidatePath } from 'next/cache';

export async function confirmBookingAction(applicationId: string, companyId: string) {
  try {
    const booking = db.confirmBooking(applicationId, companyId);
    revalidatePath('/company/bookings');
    revalidatePath('/caregiver/bookings');
    revalidatePath('/company/jobs');
    return { success: true, booking };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to confirm booking.' };
  }
}

export async function cancelBookingAction(bookingId: string, cancelledByUserId: string, reason: string) {
  if (!reason || reason.trim().length < 5) {
    return { success: false, error: 'A valid cancellation reason is required (min 5 characters).' };
  }

  try {
    const { booking, backupCandidates } = db.cancelBooking(bookingId, cancelledByUserId, reason);
    revalidatePath('/company/bookings');
    revalidatePath('/caregiver/bookings');
    return { success: true, booking, backupCandidates };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to cancel booking.' };
  }
}

export async function inviteBackupCandidateAction(bookingId: string, backupApplicationId: string, companyId: string) {
  try {
    const newBooking = db.inviteBackupCandidate(bookingId, backupApplicationId, companyId);
    revalidatePath('/company/bookings');
    revalidatePath('/caregiver/bookings');
    return { success: true, booking: newBooking };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to confirm backup candidate.' };
  }
}

export async function completeBookingAction(bookingId: string, completedByUserId: string) {
  try {
    const booking = db.completeBooking(bookingId, completedByUserId);
    revalidatePath('/company/bookings');
    revalidatePath('/caregiver/bookings');
    return { success: true, booking };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to mark booking as completed.' };
  }
}

