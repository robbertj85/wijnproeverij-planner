'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createEvent } from '@/lib/events/service';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import type { EventFormData } from '@/components/ui/EventForm';

export async function createEventAction(formData: EventFormData) {
  try {
    // Rate limiting
    const headersList = await headers();
    const clientId = getClientIdentifier(headersList);
    const rateLimitResult = rateLimit({
      ...RATE_LIMITS.EVENT_CREATION,
      identifier: `create-event:${clientId}`,
    });

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return {
        error: `Te veel evenementen aangemaakt. Probeer het opnieuw om ${resetDate.toLocaleTimeString('nl-NL')}.`,
      };
    }

    // Validate input
    if (!formData.title || !formData.createdBy) {
      return {
        error: 'Titel en e-mailadres zijn verplicht',
      };
    }

    if (formData.invitees.length < 2 || formData.invitees.length > 8) {
      return {
        error: 'Er moeten minimaal 2 en maximaal 8 genodigden zijn',
      };
    }

    if (formData.timeSlots.length === 0) {
      return {
        error: 'Er moet minimaal één tijdstip zijn',
      };
    }

    // Transform time slots to Date objects
    const timeOptions = formData.timeSlots.map((slot) => {
      const startDateTime = new Date(`${slot.startDate}T${slot.startTime}`);
      const endDateTime = new Date(`${slot.startDate}T${slot.endTime}`);

      return {
        startTime: startDateTime,
        endTime: endDateTime,
      };
    });

    // Filter out invitees without names
    const invitees = formData.invitees
      .filter((inv) => inv.name.trim())
      .map((inv) => ({
        name: inv.name.trim(),
        email: inv.email.trim() || undefined,
      }));

    // Create event
    const event = await createEvent({
      title: formData.title,
      description: formData.description || undefined,
      createdBy: formData.createdBy,
      timeOptions,
      invitees,
    });

    // Redirect to management page
    redirect(`/events/${event.id}/manage`);
  } catch (error) {
    // Re-throw redirect errors (Next.js uses them for navigation)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    console.error('Failed to create event:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Er is een fout opgetreden bij het aanmaken van het evenement',
    };
  }
}