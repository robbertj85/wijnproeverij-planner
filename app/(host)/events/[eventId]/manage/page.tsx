import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/events/service';
import { ManagementDashboard } from '@/components/ui/ManagementDashboard';

interface ManageEventPageProps {
  params: {
    eventId: string;
  };
}

export default async function ManageEventPage({ params }: ManageEventPageProps) {
  const event = await getEvent(params.eventId);

  if (!event) {
    notFound();
  }

  return <ManagementDashboard event={event} />;
}