'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Copy, Check, Mail, Users, Calendar, Wine, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';
import { useToast } from './use-toast';
import { finalizeEventAction } from '@/app/(host)/events/actions/finalize-event';
import { EventAnalytics } from './EventAnalytics';
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
  selectedTimeOption?: TimeOption | null;
};

interface ManagementDashboardProps {
  event: EventWithRelations;
}

export function ManagementDashboard({ event }: ManagementDashboardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
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

  const handleFinalize = async () => {
    if (!selectedTimeId) return;

    setIsFinalizing(true);
    try {
      const result = await finalizeEventAction(event.id, selectedTimeId);

      if (result.error) {
        toast({
          title: 'Fout',
          description: result.error,
        });
      } else {
        toast({
          title: 'Evenement definitief gemaakt!',
          description: 'Bevestigingsmails zijn verstuurd naar alle deelnemers',
        });
        setFinalizeDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden',
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  const respondedCount = event.invitees.filter((inv) => inv.respondedAt).length;
  const totalInvitees = event.invitees.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
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

            {event.finalized && (
              <div className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Definitief</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Analytics Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Overzicht</h2>
          <EventAnalytics event={event} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Finalization Section */}
          {!event.finalized && (
            <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Evenement definitief maken
                </CardTitle>
                <CardDescription>
                  Kies een tijdstip om het evenement definitief te maken. Hierna kunnen gasten
                  geen nieuwe reacties meer toevoegen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setFinalizeDialogOpen(true)}
                  disabled={respondedCount === 0}
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Maak definitief
                </Button>
                {respondedCount === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Wacht tot minimaal één gast heeft gereageerd
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Finalized Event Info */}
          {event.finalized && event.selectedTimeOption && (
            <Card className="lg:col-span-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Definitief tijdstip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg">
                  <div className="font-semibold">
                    {new Date(event.selectedTimeOption.startTime).toLocaleDateString('nl-NL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-muted-foreground">
                    {new Date(event.selectedTimeOption.startTime).toLocaleTimeString('nl-NL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(event.selectedTimeOption.endTime).toLocaleTimeString('nl-NL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                const isSelected = event.selectedTimeOptionId === timeOption.id;

                return (
                  <div
                    key={timeOption.id}
                    className={`rounded-lg border p-4 ${isSelected ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">
                        {new Date(timeOption.startTime).toLocaleDateString('nl-NL', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                        {isSelected && (
                          <span className="ml-2 text-xs text-green-700">✓ Geselecteerd</span>
                        )}
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
                      <div key={wine.id} className="rounded-lg border p-4">
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

      {/* Finalization Dialog */}
      <Dialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evenement definitief maken</DialogTitle>
            <DialogDescription>
              Kies welk tijdstip definitief wordt. Gasten ontvangen een bevestigingsmail en
              kunnen daarna geen wijzigingen meer aanbrengen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {event.timeOptions.map((timeOption) => {
              const availableCount = timeOption.responses.filter((r) => r.available).length;

              return (
                <button
                  key={timeOption.id}
                  type="button"
                  onClick={() => setSelectedTimeId(timeOption.id)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors hover:border-primary ${
                    selectedTimeId === timeOption.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {new Date(timeOption.startTime).toLocaleDateString('nl-NL', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
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
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {availableCount} beschikbaar
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFinalizeDialogOpen(false)}>
              Annuleren
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={!selectedTimeId || isFinalizing}
            >
              {isFinalizing ? 'Definitief maken...' : 'Bevestig en verstuur emails'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}