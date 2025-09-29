import { notFound } from 'next/navigation';
import { getEventRatings } from '@/lib/events/service';
import { RecapView } from '@/components/ui/RecapView';

interface RecapPageProps {
  params: {
    eventId: string;
  };
}

export default async function RecapPage({ params }: RecapPageProps) {
  const winesWithRatings = await getEventRatings(params.eventId);

  if (!winesWithRatings || winesWithRatings.length === 0) {
    notFound();
  }

  // Get event info from first wine (all belong to same event)
  const eventId = winesWithRatings[0].eventId;

  return <RecapView wines={winesWithRatings} eventId={eventId} />;
}

export async function generateMetadata() {
  return {
    title: 'Resultaten van de wijnproeverij',
    description: 'Bekijk de scores en beoordelingen van alle wijnen',
  };
}