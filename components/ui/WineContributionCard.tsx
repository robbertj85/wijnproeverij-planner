'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Wine, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

interface WineFormData {
  wineType: string;
  varietal: string;
  producer: string;
  region: string;
  vintage: string;
  price: string;
  notes: string;
}

interface WineContribution {
  id: string;
  wineType: string;
  varietal?: string | null;
  producer?: string | null;
  region?: string | null;
  vintage?: number | null;
  price?: number | null;
  notes?: string | null;
  hasDuplicate?: boolean;
}

interface WineContributionCardProps {
  existingWine?: WineContribution | null;
  onSubmit: (data: WineFormData) => Promise<{ error?: string; duplicateWarning?: boolean }>;
  isSubmitting?: boolean;
}

export function WineContributionCard({
  existingWine,
  onSubmit,
  isSubmitting = false,
}: WineContributionCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<WineFormData>({
    wineType: existingWine?.wineType || 'Red',
    varietal: existingWine?.varietal || '',
    producer: existingWine?.producer || '',
    region: existingWine?.region || '',
    vintage: existingWine?.vintage?.toString() || '',
    price: existingWine?.price?.toString() || '',
    notes: existingWine?.notes || '',
  });
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: keyof WineFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setDuplicateWarning(false);

    try {
      const result = await onSubmit(formData);

      if (result.error) {
        // Handle error - would show in toast
        setSubmitting(false);
        return;
      }

      if (result.duplicateWarning) {
        setDuplicateWarning(true);
        setSubmitting(false);
        return;
      }

      setDialogOpen(false);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
    }
  };

  const isValid = formData.wineType && formData.producer;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wine className="h-5 w-5" />
            {existingWine ? 'Jouw wijn' : 'Voeg een wijn toe'}
          </CardTitle>
          <CardDescription>
            {existingWine
              ? 'Je hebt al een wijn toegevoegd. Je kunt deze nog aanpassen.'
              : 'Voeg de wijn toe die je meeneemt naar de proeverij'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {existingWine ? (
            <div className="rounded-lg border p-4">
              {existingWine.hasDuplicate && (
                <div className="mb-3 flex items-center gap-2 text-sm text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Mogelijk duplicaat gedetecteerd</span>
                </div>
              )}
              <div className="mb-2 font-medium">{existingWine.producer || 'Onbekend'}</div>
              <div className="text-sm text-muted-foreground">
                {existingWine.varietal && <span>{existingWine.varietal} • </span>}
                {existingWine.wineType}
                {existingWine.vintage && <span> • {existingWine.vintage}</span>}
              </div>
              {existingWine.region && (
                <div className="mt-2 text-sm text-muted-foreground">{existingWine.region}</div>
              )}
              <Button
                onClick={() => setDialogOpen(true)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Aanpassen
              </Button>
            </div>
          ) : (
            <Button onClick={() => setDialogOpen(true)} className="w-full">
              <Plus className="h-4 w-4" />
              Wijn toevoegen
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{existingWine ? 'Wijn aanpassen' : 'Wijn toevoegen'}</DialogTitle>
            <DialogDescription>
              Vul de details in van de wijn die je meeneemt
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Wine Type */}
            <div className="space-y-2">
              <Label htmlFor="wineType">
                Type <span className="text-destructive">*</span>
              </Label>
              <select
                id="wineType"
                value={formData.wineType}
                onChange={(e) => handleInputChange('wineType', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Red">Rood</option>
                <option value="White">Wit</option>
                <option value="Rosé">Rosé</option>
                <option value="Sparkling">Mousserende</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            {/* Producer */}
            <div className="space-y-2">
              <Label htmlFor="producer">
                Producent <span className="text-destructive">*</span>
              </Label>
              <Input
                id="producer"
                value={formData.producer}
                onChange={(e) => handleInputChange('producer', e.target.value)}
                placeholder="Bijv. Château Margaux"
                required
              />
            </div>

            {/* Varietal */}
            <div className="space-y-2">
              <Label htmlFor="varietal">Druivensoort</Label>
              <Input
                id="varietal"
                value={formData.varietal}
                onChange={(e) => handleInputChange('varietal', e.target.value)}
                placeholder="Bijv. Cabernet Sauvignon"
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Regio</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="Bijv. Bordeaux, Frankrijk"
              />
            </div>

            {/* Vintage */}
            <div className="space-y-2">
              <Label htmlFor="vintage">Jaar</Label>
              <Input
                id="vintage"
                type="number"
                value={formData.vintage}
                onChange={(e) => handleInputChange('vintage', e.target.value)}
                placeholder="Bijv. 2015"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Prijs (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Bijv. 25.00"
                min="0"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notities</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Extra informatie over deze wijn..."
                rows={3}
              />
            </div>

            {/* Duplicate Warning */}
            {duplicateWarning && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="font-medium text-amber-900">
                      Mogelijk duplicaat gedetecteerd
                    </div>
                    <p className="mt-1 text-sm text-amber-700">
                      Er is al een vergelijkbare wijn toegevoegd. Wil je toch doorgaan?
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDuplicateWarning(false)}
                      >
                        Aanpassen
                      </Button>
                      <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                        Toch toevoegen
                      </Button>
                    </div>
                  </div>
                </div>
              </m.div>
            )}
          </div>

          {!duplicateWarning && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={handleSubmit} disabled={!isValid || submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opslaan...
                  </>
                ) : (
                  'Opslaan'
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}