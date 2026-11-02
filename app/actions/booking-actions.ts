'use server';

import { db } from '@/lib/services/data-service';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './auth-actions';
import { sanitizeInput } from '@/lib/security/sanitize';

  export async function confirmBookingAction(applicationId: string, _companyId?: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

    if (currentUser.role !== 'company' && currentUser.role !== 'admin') {
      return { success: false, error: 'Forbidden: Only verified employers can confirm bookings.' };
    }

    // Anti-IDOR: Check that this application belongs to a job owned by this company
    const app = db.applications.find(a => a.id === applicationId);
    if (!app) return { success: false, error: 'Application not found.' };

    const job = db.jobs.find(j => j.id === app.job_id);
    if (!job) return { success: false, error: 'Job not found.' };

    if (currentUser.role !== 'admin' && job.company_id !== currentUser.id) {
      return { success: false, error: 'Forbidden: You do not own the job listing for this application.' };
    }

    try {
      const booking = db.confirmBooking(applicationId, currentUser.id);

      // Audit Log
      db.auditLogs.push({
        id: crypto.randomUUID(),
        actor_id: currentUser.id,
        action: 'BOOKING_CONFIRMED',
        entity_type: 'bookings',
        entity_id: booking.id,
        metadata: { job_id: job.id, caregiver_id: app.caregiver_id, agreed_rate: booking.agreed_rate },
        created_at: new Date().toISOString(),
      });

      revalidatePath('/company/bookings');
      revalidatePath('/caregiver/bookings');
      revalidatePath('/company/jobs');
      return { success: true, booking };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to confirm booking.' };
    }
  }

      export async function cancelBookingAction(bookingId: string, _cancelledByUserId?: string, reason?: string) {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

        const booking = db.bookings.find(b => b.id === bookingId);
        if (!booking) return { success: false, error: 'Booking not found.' };

        // Anti-IDOR: Must be either the hiring company, the booked caregiver, or platform admin
        const isCompany = booking.company_id === currentUser.id;
        const isCaregiver = booking.caregiver_id === currentUser.id;
        const isAdmin = currentUser.role === 'admin';

        if (!isCompany && !isCaregiver && !isAdmin) {
          return { success: false, error: 'Forbidden: You are not authorized to cancel this booking.' };
        }

        const cleanReason = sanitizeInput(reason || '');
        if (cleanReason.length < 5) {
          return { success: false, error: 'A valid cancellation reason is required (min 5 characters).' };
        }

        try {
          const { booking: updatedBooking, backupCandidates } = db.cancelBooking(bookingId, currentUser.id, cleanReason);

          // Audit Log
          db.auditLogs.push({
            id: crypto.randomUUID(),
            actor_id: currentUser.id,
            action: 'BOOKING_CANCELLED',
            entity_type: 'bookings',
            entity_id: bookingId,
            metadata: { reason: cleanReason, backup_candidates_count: backupCandidates.length },
            created_at: new Date().toISOString(),
          });

          revalidatePath('/company/bookings');
          revalidatePath('/caregiver/bookings');
          return { success: true, booking: updatedBooking, backupCandidates };
        } catch (err: any) {
          return { success: false, error: err.message || 'Failed to cancel booking.' };
        }
      }

        export async function inviteBackupCandidateAction(
          bookingId: string,
          backupApplicationId: string,
          _companyId?: string
        ) {
          const currentUser = await getCurrentUser();
          if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

          const booking = db.bookings.find(b => b.id === bookingId);
          if (!booking) return { success: false, error: 'Original booking not found.' };

          if (currentUser.role !== 'admin' && booking.company_id !== currentUser.id) {
            return { success: false, error: 'Forbidden: You do not own this cancelled booking.' };
          }

          try {
            const newBooking = db.inviteBackupCandidate(bookingId, backupApplicationId, currentUser.id);

            // Audit Log
            db.auditLogs.push({
              id: crypto.randomUUID(),
              actor_id: currentUser.id,
              action: 'BACKUP_CANDIDATE_CONFIRMED',
              entity_type: 'bookings',
              entity_id: newBooking.id,
              metadata: { previous_booking_id: bookingId, application_id: backupApplicationId },
              created_at: new Date().toISOString(),
            });

            revalidatePath('/company/bookings');
            revalidatePath('/caregiver/bookings');
            return { success: true, booking: newBooking };
          } catch (err: any) {
            return { success: false, error: err.message || 'Failed to confirm backup candidate.' };
          }
        }

          export async function completeBookingAction(bookingId: string, _completedByUserId?: string) {
            const currentUser = await getCurrentUser();
            if (!currentUser) return { success: false, error: 'Unauthorized: Session required.' };

            const booking = db.bookings.find(b => b.id === bookingId);
            if (!booking) return { success: false, error: 'Booking not found.' };

            if (currentUser.role !== 'admin' && booking.company_id !== currentUser.id) {
              return { success: false, error: 'Forbidden: Only the employer or admin can mark a shift as completed.' };
            }

            try {
              const completed = db.completeBooking(bookingId, currentUser.id);

              // Audit Log
              db.auditLogs.push({
                id: crypto.randomUUID(),
                actor_id: currentUser.id,
                action: 'BOOKING_COMPLETED',
                entity_type: 'bookings',
                entity_id: bookingId,
                metadata: { completed_at: new Date().toISOString() },
                created_at: new Date().toISOString(),
              });

              revalidatePath('/company/bookings');
              revalidatePath('/caregiver/bookings');
              return { success: true, booking: completed };
            } catch (err: any) {
              return { success: false, error: err.message || 'Failed to mark booking as completed.' };
            }
          }
