'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Calendar, Check, X } from 'lucide-react';
import type { TimeOption } from '@prisma/client';

interface AvailabilityPollProps {
  timeOptions: TimeOption[];
  onSubmit: (responses: Record<string, boolean>) => Promise<void>;
  isSubmitting?: boolean;
  existingResponses?: Record<string, boolean>;
}

export function AvailabilityPoll({
  timeOptions,
  onSubmit,
  isSubmitting = false,
  existingResponses = {},
}: AvailabilityPollProps) {
  const [responses, setResponses] = useState<Record<string, boolean>>(existingResponses);

  const handleToggle = (timeOptionId: string, available: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [timeOptionId]: available,
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(responses);
  };

  const allAnswered = timeOptions.every((option) => responses[option.id] !== undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Wanneer kun je?
        </CardTitle>
        <CardDescription>
          Geef voor elk tijdstip aan of je beschikbaar bent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {timeOptions.map((option, index) => (
          <m.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border p-4"
          >
            <div className="mb-3">
              <div className="font-medium">
                {new Date(option.startTime).toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(option.startTime).toLocaleTimeString('nl-NL', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(option.endTime).toLocaleTimeString('nl-NL', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <m.button
                type="button"
                onClick={() => handleToggle(option.id, true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  responses[option.id] === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-border hover:border-green-200'
                }`}
              >
                <Check className="mx-auto h-5 w-5" />
                <span className="mt-1 block">Ja, ik kan</span>
              </m.button>

              <m.button
                type="button"
                onClick={() => handleToggle(option.id, false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  responses[option.id] === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-border hover:border-red-200'
                }`}
              >
                <X className="mx-auto h-5 w-5" />
                <span className="mt-1 block">Nee, ik kan niet</span>
              </m.button>
            </div>
          </m.div>
        ))}

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: timeOptions.length * 0.1 + 0.2 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? 'Opslaan...' : 'Beschikbaarheid opslaan'}
          </Button>
          {!allAnswered && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Beantwoord alle tijdstippen om verder te gaan
            </p>
          )}
        </m.div>
      </CardContent>
    </Card>
  );
}