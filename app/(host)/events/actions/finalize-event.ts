'use server';

import { revalidatePath } from 'next/cache';
import { finalizeEvent, getEvent } from '@/lib/events/service';
import { sendFinalizationEmail } from '@/lib/email/send-invite';

export async function finalizeEventAction(eventId: string, selectedTimeOptionId: string) {
  try {
    // Finalize the event
    await finalizeEvent(eventId, selectedTimeOptionId);

    // Get updated event data with selected time
    const event = await getEvent(eventId);

    if (!event || !event.selectedTimeOption) {
      return {
        error: 'Evenement niet gevonden of tijd niet geselecteerd',
      };
    }

    // Send finalization emails to all invitees
    const emailPromises = event.invitees
      .filter((inv) => inv.email) // Only send to invitees with email
      .map((invitee) =>
        sendFinalizationEmail({
          inviteeName: invitee.name,
          inviteeEmail: invitee.email!,
          eventTitle: event.title,
          selectedTime: {
            startTime: event.selectedTimeOption!.startTime,
            endTime: event.selectedTimeOption!.endTime,
          },
          additionalInfo: event.description ?? undefined,
        })
      );

    await Promise.allSettled(emailPromises);

    // Revalidate the management page
    revalidatePath(`/events/${eventId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to finalize event:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Er is een fout opgetreden bij het definitief maken van het evenement',
    };
  }
}