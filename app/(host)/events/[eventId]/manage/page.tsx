import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/events/service';
import { ManagementDashboard } from '@/components/ui/ManagementDashboard';

interface ManageEventPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function ManageEventPage({ params }: ManageEventPageProps) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) {
    notFound();
  }

  return <ManagementDashboard event={event} />;
}