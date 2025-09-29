'use server';

import { revalidatePath } from 'next/cache';
import {
  submitAvailability,
  createWineContribution,
  updateWineContribution,
  getInviteeByToken,
  getEvent,
} from '@/lib/events/service';

export async function submitAvailabilityAction(
  inviteeId: string,
  eventId: string,
  responses: Record<string, boolean>
) {
  try {
    // Check if event is finalized
    const event = await getEvent(eventId);
    if (event?.finalized) {
      return {
        error: 'Dit evenement is al definitief gemaakt. Je kunt geen wijzigingen meer aanbrengen.',
      };
    }

    // Convert responses to array format
    const responsesArray = Object.entries(responses).map(([timeOptionId, available]) => ({
      timeOptionId,
      available,
    }));

    await submitAvailability(inviteeId, responsesArray);

    revalidatePath(`/events/${eventId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to submit availability:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Er is een fout opgetreden bij het opslaan van je beschikbaarheid',
    };
  }
}

export async function submitWineContributionAction(
  inviteeId: string,
  eventId: string,
  token: string,
  wineData: {
    wineType: string;
    varietal: string;
    producer: string;
    region: string;
    vintage: string;
    price: string;
    notes: string;
  },
  existingWineId?: string
) {
  try {
    // Check if event is finalized
    const event = await getEvent(eventId);
    if (event?.finalized) {
      return {
        error: 'Dit evenement is al definitief gemaakt. Je kunt geen wijnen meer toevoegen.',
      };
    }

    // Prepare wine data
    const wineInput = {
      eventId,
      inviteeId,
      wineType: wineData.wineType,
      varietal: wineData.varietal || undefined,
      producer: wineData.producer || undefined,
      region: wineData.region || undefined,
      vintage: wineData.vintage ? parseInt(wineData.vintage) : undefined,
      price: wineData.price ? parseFloat(wineData.price) : undefined,
      notes: wineData.notes || undefined,
    };

    // Check for duplicates before creating/updating
    // This is a simple check - the service layer will do full duplicate detection
    if (event) {
      const similarWines = event.wineContributions.filter(
        (w) =>
          w.id !== existingWineId &&
          w.producer?.toLowerCase() === wineInput.producer?.toLowerCase() &&
          w.varietal?.toLowerCase() === wineInput.varietal?.toLowerCase()
      );

      if (similarWines.length > 0) {
        return {
          duplicateWarning: true,
        };
      }
    }

    if (existingWineId) {
      await updateWineContribution(existingWineId, wineInput);
    } else {
      await createWineContribution(wineInput);
    }

    revalidatePath(`/invite/${token}`);
    revalidatePath(`/events/${eventId}/manage`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to submit wine:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Er is een fout opgetreden bij het opslaan van je wijn',
    };
  }
}