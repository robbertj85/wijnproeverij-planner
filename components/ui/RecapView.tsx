'use client';

import { m } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Trophy, Star, Wine, AlertTriangle, Medal } from 'lucide-react';

interface DuplicateFlag {
  id: string;
  originalWineId: string;
  duplicateWineId: string;
}

interface Rating {
  id: string;
  score: number;
  notes?: string | null;
  invitee: {
    id: string;
    name: string;
  };
}

interface WineWithRatings {
  id: string;
  wineType: string;
  varietal?: string | null;
  producer?: string | null;
  region?: string | null;
  vintage?: number | null;
  price?: number | null;
  notes?: string | null;
  eventId: string;
  invitee: {
    id: string;
    name: string;
  };
  ratings: Rating[];
  averageScore: number | null;
  ratingCount: number;
  duplicateFlags?: DuplicateFlag[];
  flaggedAs?: DuplicateFlag[];
}

interface RecapViewProps {
  wines: WineWithRatings[];
  eventId: string;
}

export function RecapView({ wines }: RecapViewProps) {
  // Sort wines by average score (highest first)
  const sortedWines = [...wines].sort((a, b) => {
    const scoreA = a.averageScore ?? -1;
    const scoreB = b.averageScore ?? -1;
    return scoreB - scoreA;
  });

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return 'Nog geen beoordelingen';
    if (score >= 90) return 'Uitmuntend';
    if (score >= 80) return 'Uitstekend';
    if (score >= 70) return 'Zeer goed';
    if (score >= 60) return 'Goed';
    if (score >= 50) return 'Prima';
    if (score >= 40) return 'Redelijk';
    if (score >= 30) return 'Matig';
    return 'Teleurstellend';
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              Resultaten
            </div>
            <h1 className="text-3xl font-bold">Wijnproeverij resultaten</h1>
            <p className="mt-2 text-muted-foreground">
              Alle wijnen gerangschikt op gemiddelde score
            </p>
          </m.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Wine className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{wines.length}</div>
                    <div className="text-sm text-muted-foreground">Wijnen geproefd</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {sortedWines[0]?.averageScore?.toFixed(0) ?? '-'}
                    </div>
                    <div className="text-sm text-muted-foreground">Hoogste score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-amber-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {wines.reduce((sum, w) => sum + w.ratingCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Totaal beoordelingen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wine Rankings */}
          <Card>
            <CardHeader>
              <CardTitle>Wijnranglijst</CardTitle>
              <CardDescription>
                Gerangschikt op gemiddelde score van alle deelnemers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedWines.map((wine, index) => {
                const hasDuplicates =
                  (wine.duplicateFlags && wine.duplicateFlags.length > 0) ||
                  (wine.flaggedAs && wine.flaggedAs.length > 0);

                return (
                  <m.div
                    key={wine.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                        {getMedalIcon(index) || (
                          <span className="text-2xl font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Wine Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            {hasDuplicates && (
                              <div className="mb-1 flex items-center gap-1 text-xs text-amber-600">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Mogelijk duplicaat</span>
                              </div>
                            )}
                            <h3 className="font-semibold">
                              {wine.producer || 'Onbekend'}
                            </h3>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {wine.varietal && <span>{wine.varietal} • </span>}
                              {wine.wineType}
                              {wine.vintage && <span> • {wine.vintage}</span>}
                            </div>
                            {wine.region && (
                              <div className="mt-1 text-sm text-muted-foreground">
                                {wine.region}
                              </div>
                            )}
                            <div className="mt-2 text-xs text-muted-foreground">
                              Meegebracht door {wine.invitee.name}
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <div
                              className={`text-3xl font-bold ${getScoreColor(wine.averageScore)}`}
                            >
                              {wine.averageScore?.toFixed(0) ?? '-'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getScoreLabel(wine.averageScore)}
                            </div>
                            {wine.ratingCount > 0 && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {wine.ratingCount} beoordeling{wine.ratingCount !== 1 ? 'en' : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Individual Ratings */}
                        {wine.ratings.length > 0 && (
                          <div className="mt-4 space-y-2 border-t pt-3">
                            <div className="text-sm font-medium text-muted-foreground">
                              Individuele beoordelingen:
                            </div>
                            {wine.ratings.map((rating) => (
                              <div
                                key={rating.id}
                                className="rounded-md bg-muted/50 p-3 text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{rating.invitee.name}</span>
                                  <span className={`font-bold ${getScoreColor(rating.score)}`}>
                                    {rating.score}
                                  </span>
                                </div>
                                {rating.notes && (
                                  <p className="mt-1 text-muted-foreground">{rating.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}