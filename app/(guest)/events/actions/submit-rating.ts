'use server';

import { revalidatePath } from 'next/cache';
import { submitRating, getInviteeByToken } from '@/lib/events/service';

export async function submitRatingsAction(
  token: string,
  eventId: string,
  ratings: Array<{
    wineContributionId: string;
    score: number;
    notes: string;
  }>
) {
  try {
    // Get invitee data
    const invitee = await getInviteeByToken(token);

    if (!invitee) {
      return {
        error: 'Uitnodiging niet gevonden',
      };
    }

    if (invitee.eventId !== eventId) {
      return {
        error: 'Ongeldige evenement referentie',
      };
    }

    // Submit all ratings
    for (const rating of ratings) {
      if (rating.score >= 0 && rating.score <= 100) {
        await submitRating(
          rating.wineContributionId,
          invitee.id,
          rating.score,
          rating.notes || undefined
        );
      }
    }

    revalidatePath(`/events/${eventId}/recap`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to submit ratings:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Er is een fout opgetreden bij het opslaan van je beoordelingen',
    };
  }
}