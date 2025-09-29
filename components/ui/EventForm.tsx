'use client';

import { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { m } from 'framer-motion';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  startDate: string;
}

interface Invitee {
  id: string;
  name: string;
  email: string;
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  createdBy: string;
  timeSlots: TimeSlot[];
  invitees: Invitee[];
}

export function EventForm({ onSubmit, isSubmitting = false }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', startDate: '', startTime: '', endTime: '' },
  ]);
  const [invitees, setInvitees] = useState<Invitee[]>([
    { id: '1', name: '', email: '' },
    { id: '2', name: '', email: '' },
  ]);

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startDate: '',
      startTime: '',
      endTime: '',
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    }
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(
      timeSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const addInvitee = () => {
    if (invitees.length < 8) {
      const newInvitee: Invitee = {
        id: Date.now().toString(),
        name: '',
        email: '',
      };
      setInvitees([...invitees, newInvitee]);
    }
  };

  const removeInvitee = (id: string) => {
    if (invitees.length > 2) {
      setInvitees(invitees.filter((inv) => inv.id !== id));
    }
  };

  const updateInvitee = (id: string, field: keyof Invitee, value: string) => {
    setInvitees(invitees.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      createdBy,
      timeSlots,
      invitees,
    });
  };

  const isValid =
    title &&
    createdBy &&
    timeSlots.every((slot) => slot.startDate && slot.startTime && slot.endTime) &&
    invitees.every((inv) => inv.name) &&
    invitees.length >= 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Evenementdetails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Titel <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Wijnproeverij bij Jan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Geef wat context over het evenement..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdBy">
              Jouw e-mailadres <span className="text-destructive">*</span>
            </Label>
            <Input
              id="createdBy"
              type="email"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="jouw@email.nl"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mogelijke tijdstippen</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addTimeSlot}>
            <Plus className="h-4 w-4" />
            Toevoegen
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeSlots.map((slot) => (
            <m.div
              key={slot.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 rounded-lg border p-4"
            >
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`date-${slot.id}`}>Datum</Label>
                    <Input
                      id={`date-${slot.id}`}
                      type="date"
                      value={slot.startDate}
                      onChange={(e) => updateTimeSlot(slot.id, 'startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`start-${slot.id}`}>Van</Label>
                    <Input
                      id={`start-${slot.id}`}
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-${slot.id}`}>Tot</Label>
                    <Input
                      id={`end-${slot.id}`}
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              {timeSlots.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeTimeSlot(slot.id)}
                  className="self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </m.div>
          ))}
        </CardContent>
      </Card>

      {/* Invitees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Genodigden</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Minimaal 2, maximaal 8 deelnemers
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addInvitee}
            disabled={invitees.length >= 8}
          >
            <Plus className="h-4 w-4" />
            Toevoegen
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {invitees.map((invitee) => (
            <m.div
              key={invitee.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 rounded-lg border p-4"
            >
              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${invitee.id}`}>
                    Naam <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`name-${invitee.id}`}
                    value={invitee.name}
                    onChange={(e) => updateInvitee(invitee.id, 'name', e.target.value)}
                    placeholder="Naam"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`email-${invitee.id}`}>E-mail (optioneel)</Label>
                  <Input
                    id={`email-${invitee.id}`}
                    type="email"
                    value={invitee.email}
                    onChange={(e) => updateInvitee(invitee.id, 'email', e.target.value)}
                    placeholder="email@example.nl"
                  />
                </div>
              </div>
              {invitees.length > 2 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeInvitee(invitee.id)}
                  className="self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </m.div>
          ))}
          {invitees.length < 2 && (
            <p className="text-sm text-destructive">
              Je moet minimaal 2 genodigden toevoegen
            </p>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={!isValid || isSubmitting} size="lg">
          {isSubmitting ? 'Aanmaken...' : 'Evenement aanmaken'}
        </Button>
      </div>
    </form>
  );
}