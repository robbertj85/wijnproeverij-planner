'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { Textarea } from './textarea';
import { Label } from './label';

interface RatingSliderProps {
  wineId: string;
  wineName: string;
  onRatingChange: (wineId: string, score: number, notes: string) => void;
  initialScore?: number;
  initialNotes?: string;
}

export function RatingSlider({
  wineId,
  wineName,
  onRatingChange,
  initialScore = 50,
  initialNotes = '',
}: RatingSliderProps) {
  const [score, setScore] = useState(initialScore);
  const [notes, setNotes] = useState(initialNotes);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    onRatingChange(wineId, newScore, notes);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onRatingChange(wineId, score, newNotes);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Uitmuntend';
    if (score >= 80) return 'Uitstekend';
    if (score >= 70) return 'Zeer goed';
    if (score >= 60) return 'Goed';
    if (score >= 50) return 'Prima';
    if (score >= 40) return 'Redelijk';
    if (score >= 30) return 'Matig';
    return 'Teleurstellend';
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="font-medium">{wineName}</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Score</Label>
          <div className="flex items-center gap-2">
            <m.div
              key={score}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-full bg-gradient-to-r px-3 py-1 text-sm font-bold text-white ${getScoreColor(score)}`}
            >
              {score}
            </m.div>
            <span className="text-sm text-muted-foreground">{getScoreLabel(score)}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-red-200 via-yellow-200 to-green-200"
            style={{
              background: `linear-gradient(to right,
                rgb(239 68 68) 0%,
                rgb(249 115 22) 25%,
                rgb(234 179 8) 50%,
                rgb(132 204 22) 75%,
                rgb(34 197 94) 100%)`,
            }}
          />
          <style jsx>{`
            input[type='range']::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid ${score >= 80 ? 'rgb(34 197 94)' : score >= 60 ? 'rgb(234 179 8)' : score >= 40 ? 'rgb(249 115 22)' : 'rgb(239 68 68)'};
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            input[type='range']::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid ${score >= 80 ? 'rgb(34 197 94)' : score >= 60 ? 'rgb(234 179 8)' : score >= 40 ? 'rgb(249 115 22)' : 'rgb(239 68 68)'};
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>

          {/* Score markers */}
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor={`notes-${wineId}`}>Proefnotities (optioneel)</Label>
        <Textarea
          id={`notes-${wineId}`}
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Wat vond je van deze wijn? Smaak, aroma, afwerking..."
          rows={3}
        />
      </div>
    </div>
  );
}