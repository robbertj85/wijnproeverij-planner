import { notFound } from 'next/navigation';
import { getEventRatings } from '@/lib/events/service';
import { RecapView } from '@/components/ui/RecapView';

interface RecapPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function RecapPage({ params }: RecapPageProps) {
  const { eventId } = await params;
  const winesWithRatings = await getEventRatings(eventId);

  if (!winesWithRatings || winesWithRatings.length === 0) {
    notFound();
  }

  return <RecapView wines={winesWithRatings} eventId={eventId} />;
}

export async function generateMetadata() {
  return {
    title: 'Resultaten van de wijnproeverij',
    description: 'Bekijk de scores en beoordelingen van alle wijnen',
  };
}