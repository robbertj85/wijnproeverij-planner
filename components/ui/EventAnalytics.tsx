'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { m } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Wine as WineIcon } from 'lucide-react';
import type { Event, Invitee, TimeOption, WineContribution, InviteeTimeResponse } from '@prisma/client';

type EventWithAnalytics = Event & {
  invitees: Invitee[];
  timeOptions: (TimeOption & {
    responses: (InviteeTimeResponse & {
      invitee: Invitee;
    })[];
  })[];
  wineContributions: WineContribution[];
};

interface EventAnalyticsProps {
  event: EventWithAnalytics;
}

export function EventAnalytics({ event }: EventAnalyticsProps) {
  // Calculate attendance stats
  const totalInvitees = event.invitees.length;
  const respondedCount = event.invitees.filter((inv) => inv.respondedAt).length;
  const responseRate = totalInvitees > 0 ? (respondedCount / totalInvitees) * 100 : 0;

  // Calculate best time slot
  const timeSlotStats = event.timeOptions.map((option) => {
    const availableCount = option.responses.filter((r) => r.available).length;
    const responseCount = option.responses.length;
    const availabilityRate = responseCount > 0 ? (availableCount / responseCount) * 100 : 0;

    return {
      id: option.id,
      startTime: option.startTime,
      availableCount,
      responseCount,
      availabilityRate,
    };
  });

  const bestTimeSlot = timeSlotStats.reduce(
    (best, current) =>
      current.availableCount > best.availableCount ? current : best,
    timeSlotStats[0]
  );

  // Calculate wine stats
  const winesByType = event.wineContributions.reduce((acc, wine) => {
    acc[wine.wineType] = (acc[wine.wineType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgPrice =
    event.wineContributions.filter((w) => w.price).length > 0
      ? event.wineContributions
          .filter((w) => w.price)
          .reduce((sum, w) => sum + (w.price || 0), 0) /
        event.wineContributions.filter((w) => w.price).length
      : null;

  const priceRange =
    event.wineContributions.filter((w) => w.price).length > 0
      ? {
          min: Math.min(...event.wineContributions.filter((w) => w.price).map((w) => w.price!)),
          max: Math.max(...event.wineContributions.filter((w) => w.price).map((w) => w.price!)),
        }
      : null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Response Rate */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Respons ratio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {respondedCount} van {totalInvitees} gereageerd
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${responseRate}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-primary"
              />
            </div>
          </CardContent>
        </Card>
      </m.div>

      {/* Best Time Slot */}
      {bestTimeSlot && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Beste tijdstip</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestTimeSlot.availableCount}</div>
              <p className="text-xs text-muted-foreground">
                {new Date(bestTimeSlot.startTime).toLocaleDateString('nl-NL', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <m.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bestTimeSlot.availabilityRate}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-green-500"
                />
              </div>
            </CardContent>
          </Card>
        </m.div>
      )}

      {/* Wine Count */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aantal wijnen</CardTitle>
            <WineIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.wineContributions.length}</div>
            <p className="text-xs text-muted-foreground">
              {Object.keys(winesByType).length} verschillende types
            </p>
            {Object.entries(winesByType).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {Object.entries(winesByType)
                  .slice(0, 3)
                  .map(([type, count]) => (
                    <span
                      key={type}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs"
                    >
                      {type}: {count}
                    </span>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </m.div>

      {/* Average Price */}
      {avgPrice !== null && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gemiddelde prijs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{avgPrice.toFixed(2)}</div>
              {priceRange && (
                <p className="text-xs text-muted-foreground">
                  €{priceRange.min} - €{priceRange.max}
                </p>
              )}
            </CardContent>
          </Card>
        </m.div>
      )}
    </div>
  );
}