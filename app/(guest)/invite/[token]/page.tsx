import { notFound } from 'next/navigation';
import { getInviteeByToken } from '@/lib/events/service';
import { GuestInvitePage } from '@/components/ui/GuestInvitePage';

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteeData = await getInviteeByToken(params.token);

  if (!inviteeData) {
    notFound();
  }

  return <GuestInvitePage invitee={inviteeData} />;
}

export async function generateMetadata({ params }: InvitePageProps) {
  const inviteeData = await getInviteeByToken(params.token);

  if (!inviteeData) {
    return {
      title: 'Uitnodiging niet gevonden',
    };
  }

  return {
    title: `Uitnodiging voor ${inviteeData.event.title}`,
    description: inviteeData.event.description || 'Je bent uitgenodigd voor een wijnproeverij',
  };
}