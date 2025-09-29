'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { AvailabilityPoll } from './AvailabilityPoll';
import { WineContributionCard } from './WineContributionCard';
import { useToast } from './use-toast';
import {
  submitAvailabilityAction,
  submitWineContributionAction,
} from '@/app/(guest)/invite/actions/submit-responses';
import { Calendar, Users, Wine, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Event, Invitee, TimeOption, WineContribution, InviteeTimeResponse } from '@prisma/client';

type InviteeWithRelations = Invitee & {
  event: Event;
  timeResponses: InviteeTimeResponse[];
  wineContributions: WineContribution[];
};

interface GuestInvitePageProps {
  invitee: InviteeWithRelations;
}

export function GuestInvitePage({ invitee }: GuestInvitePageProps) {
  const [availabilitySubmitted, setAvailabilitySubmitted] = useState(!!invitee.respondedAt);
  const [isSubmittingAvailability, setIsSubmittingAvailability] = useState(false);
  const { toast } = useToast();

  const event = invitee.event;
  const existingWine = invitee.wineContributions[0] || null;

  // Convert existing responses to Record format
  const existingResponses = invitee.timeResponses.reduce((acc, response) => {
    acc[response.timeOptionId] = response.available;
    return acc;
  }, {} as Record<string, boolean>);

  const handleAvailabilitySubmit = async (responses: Record<string, boolean>) => {
    setIsSubmittingAvailability(true);

    try {
      const result = await submitAvailabilityAction(invitee.id, event.id, responses);

      if (result.error) {
        toast({
          title: 'Fout',
          description: result.error,
        });
      } else {
        toast({
          title: 'Beschikbaarheid opgeslagen!',
          description: 'Bedankt voor je reactie',
        });
        setAvailabilitySubmitted(true);
      }
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden',
      });
    } finally {
      setIsSubmittingAvailability(false);
    }
  };

  const handleWineSubmit = async (wineData: any) => {
    try {
      const result = await submitWineContributionAction(
        invitee.id,
        event.id,
        invitee.token,
        wineData,
        existingWine?.id
      );

      if (result.error) {
        toast({
          title: 'Fout',
          description: result.error,
        });
        return { error: result.error };
      }

      if (result.duplicateWarning) {
        return { duplicateWarning: true };
      }

      toast({
        title: 'Wijn opgeslagen!',
        description: existingWine ? 'Je wijn is bijgewerkt' : 'Je wijn is toegevoegd',
      });

      return { success: true };
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden',
      });
      return { error: 'Onverwachte fout' };
    }
  };

  // Check if event is finalized
  if (event.finalized) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl"
          >
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Evenement definitief!</CardTitle>
                <CardDescription className="text-base">
                  {event.title} is definitief gemaakt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                {event.selectedTimeOptionId && (
                  <>
                    {/* We'd need to fetch the selected time option to show it */}
                    <p className="text-sm text-muted-foreground">
                      Je ontvangt binnenkort een bevestigingsmail met alle details.
                    </p>
                  </>
                )}
                <p className="text-sm text-muted-foreground">
                  Je kunt geen wijzigingen meer aanbrengen.
                </p>
              </CardContent>
            </Card>
          </m.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Wine className="h-4 w-4" />
              Wijnproeverij uitnodiging
            </div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            {event.description && (
              <p className="mt-2 text-muted-foreground">{event.description}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Voor {invitee.name}</span>
            </div>
          </m.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Status Message */}
          {availabilitySubmitted && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex items-center gap-3 py-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">
                      Je beschikbaarheid is opgeslagen
                    </div>
                    <div className="text-sm text-green-700">
                      Je kunt nog steeds een wijn toevoegen of aanpassen
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          )}

          {/* Availability Poll */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AvailabilityPoll
              timeOptions={event.timeOptions as TimeOption[]}
              onSubmit={handleAvailabilitySubmit}
              isSubmitting={isSubmittingAvailability}
              existingResponses={existingResponses}
            />
          </m.div>

          {/* Wine Contribution */}
          {availabilitySubmitted && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WineContributionCard
                existingWine={existingWine}
                onSubmit={handleWineSubmit}
              />
            </m.div>
          )}

          {/* Help Text */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-dashed">
              <CardContent className="flex items-start gap-3 py-4">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Let op:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Geef eerst je beschikbaarheid door voor alle tijdstippen</li>
                    <li>Daarna kun je optioneel een wijn toevoegen die je meeneemt</li>
                    <li>Je kunt je antwoorden aanpassen totdat de host het evenement definitief maakt</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </m.div>
        </div>
      </div>
    </div>
  );
}