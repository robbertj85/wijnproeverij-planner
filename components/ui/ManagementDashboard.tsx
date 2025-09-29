'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Copy, Check, Mail, Users, Calendar, Wine, AlertTriangle } from 'lucide-react';
import { useToast } from './use-toast';
import type { Event, Invitee, TimeOption, WineContribution, InviteeTimeResponse } from '@prisma/client';

type EventWithRelations = Event & {
  invitees: Invitee[];
  timeOptions: (TimeOption & {
    responses: (InviteeTimeResponse & {
      invitee: Invitee;
    })[];
  })[];
  wineContributions: (WineContribution & {
    invitee: Invitee;
    duplicateFlags: any[];
    flaggedAs: any[];
  })[];
};

interface ManagementDashboardProps {
  event: EventWithRelations;
}

export function ManagementDashboard({ event }: ManagementDashboardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const getInviteUrl = (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/invite/${token}`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: 'Gekopieerd!',
        description: 'Link gekopieerd naar klembord',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Kon niet kopiëren naar klembord',
      });
    }
  };

  const respondedCount = event.invitees.filter((inv) => inv.respondedAt).length;
  const totalInvitees = event.invitees.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.description && (
            <p className="mt-2 text-muted-foreground">{event.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {respondedCount} / {totalInvitees} gereageerd
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{event.timeOptions.length} tijdopties</span>
            </div>
            <div className="flex items-center gap-2">
              <Wine className="h-4 w-4 text-muted-foreground" />
              <span>{event.wineContributions.length} wijnen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Invite Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Uitnodigingen
              </CardTitle>
              <CardDescription>
                Deel deze links met je gasten om hun beschikbaarheid door te geven
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.invitees.map((invitee) => (
                <div
                  key={invitee.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invitee.name}</span>
                      {invitee.respondedAt && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          Gereageerd
                        </span>
                      )}
                    </div>
                    {invitee.email && (
                      <span className="text-sm text-muted-foreground">{invitee.email}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(getInviteUrl(invitee.token), invitee.id)
                      }
                    >
                      {copiedId === invitee.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Time Options with Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Beschikbaarheid
              </CardTitle>
              <CardDescription>
                Overzicht van wie kan op welke tijdstippen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.timeOptions.map((timeOption) => {
                const availableCount = timeOption.responses.filter(
                  (r) => r.available
                ).length;

                return (
                  <div key={timeOption.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">
                        {new Date(timeOption.startTime).toLocaleDateString('nl-NL', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(timeOption.startTime).toLocaleTimeString('nl-NL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(timeOption.endTime).toLocaleTimeString('nl-NL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">
                        {availableCount} beschikbaar
                      </span>
                      {timeOption.responses.length > 0 && (
                        <span className="text-muted-foreground">
                          {' '}
                          van {timeOption.responses.length}
                        </span>
                      )}
                    </div>
                    {timeOption.responses.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {timeOption.responses
                          .filter((r) => r.available)
                          .map((response) => (
                            <span
                              key={response.id}
                              className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
                            >
                              {response.invitee.name}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Wine Contributions */}
          {event.wineContributions.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wine className="h-5 w-5" />
                  Wijnen
                </CardTitle>
                <CardDescription>
                  Toegevoegde wijnen door deelnemers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {event.wineContributions.map((wine) => {
                    const hasDuplicates =
                      wine.duplicateFlags.length > 0 || wine.flaggedAs.length > 0;

                    return (
                      <div
                        key={wine.id}
                        className="rounded-lg border p-4"
                      >
                        {hasDuplicates && (
                          <div className="mb-2 flex items-center gap-2 text-sm text-amber-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Mogelijk duplicaat</span>
                          </div>
                        )}
                        <div className="font-medium">{wine.producer || 'Onbekend'}</div>
                        <div className="text-sm text-muted-foreground">
                          {wine.varietal && <span>{wine.varietal} • </span>}
                          {wine.wineType}
                          {wine.vintage && <span> • {wine.vintage}</span>}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Door {wine.invitee.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}