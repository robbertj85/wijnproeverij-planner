'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { m } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingSlider } from '@/components/ui/RatingSlider';
import { useToast } from '@/components/ui/use-toast';
import { submitRatingsAction } from '../../actions/submit-rating';
import { Star, ArrowLeft } from 'lucide-react';

interface Wine {
  id: string;
  wineType: string;
  varietal?: string | null;
  producer?: string | null;
  region?: string | null;
  vintage?: number | null;
}

export default function RatePage({ params }: { params: { eventId: string } }) {
  const [wines, setWines] = useState<Wine[]>([]);
  const [ratings, setRatings] = useState<Record<string, { score: number; notes: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // In a real implementation, fetch event and wines data
    // For now, this is a placeholder
    setEventTitle('Wijnproeverij bij Jan');
    setWines([
      {
        id: '1',
        wineType: 'Red',
        producer: 'Château Margaux',
        varietal: 'Cabernet Sauvignon',
        region: 'Bordeaux, Frankrijk',
        vintage: 2015,
      },
    ]);
  }, [params.eventId]);

  const handleRatingChange = (wineId: string, score: number, notes: string) => {
    setRatings((prev) => ({
      ...prev,
      [wineId]: { score, notes },
    }));
  };

  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: 'Fout',
        description: 'Geen geldige token gevonden',
      });
      return;
    }

    setIsSubmitting(true);

    const ratingsArray = Object.entries(ratings).map(([wineContributionId, data]) => ({
      wineContributionId,
      score: data.score,
      notes: data.notes,
    }));

    try {
      const result = await submitRatingsAction(token, params.eventId, ratingsArray);

      if (result.error) {
        toast({
          title: 'Fout',
          description: result.error,
        });
      } else {
        toast({
          title: 'Beoordelingen opgeslagen!',
          description: 'Bedankt voor je scores',
        });
        router.push(`/events/${params.eventId}/recap`);
      }
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een onverwachte fout opgetreden',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRated = wines.every((wine) => ratings[wine.id] !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              Beoordeel de wijnen
            </div>
            <h1 className="text-3xl font-bold">{eventTitle}</h1>
            <p className="mt-2 text-muted-foreground">
              Geef elke wijn een score van 0-100 en voeg optioneel proefnotities toe
            </p>
          </m.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wijnen van de proeverij</CardTitle>
              <CardDescription>
                Beoordeel elke wijn op basis van je ervaring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {wines.map((wine, index) => (
                <m.div
                  key={wine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RatingSlider
                    wineId={wine.id}
                    wineName={`${wine.producer || 'Onbekend'} ${wine.varietal ? `- ${wine.varietal}` : ''}`}
                    onRatingChange={handleRatingChange}
                    initialScore={ratings[wine.id]?.score}
                    initialNotes={ratings[wine.id]?.notes}
                  />
                </m.div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>
            <Button onClick={handleSubmit} disabled={!allRated || isSubmitting} size="lg">
              {isSubmitting ? 'Opslaan...' : 'Beoordelingen opslaan'}
            </Button>
          </div>

          {!allRated && (
            <p className="text-center text-sm text-muted-foreground">
              Beoordeel alle wijnen om je scores op te slaan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}