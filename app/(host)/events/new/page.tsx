'use client';

import { useState } from 'react';
import { EventForm, type EventFormData } from '@/components/ui/EventForm';
import { createEventAction } from '../actions/create-event';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createEventAction(data);

      if (result?.error) {
        toast({
          title: 'Fout',
          description: result.error,
        });
        setIsSubmitting(false);
      }
      // If successful, the action will redirect
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nieuw wijnproeverij evenement</h1>
            <p className="mt-2 text-muted-foreground">
              Maak een evenement aan en nodig vrienden uit om hun beschikbaarheid door te geven
            </p>
          </div>

          <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}