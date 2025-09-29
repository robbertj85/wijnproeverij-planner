import type { Metadata } from 'next';
import './globals.css';
import { MotionProvider } from '@/components/providers/motion-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'Wine Tasting Scheduler',
    template: '%s | Wine Tasting Scheduler',
  },
  description: 'Coordinate wine tasting events with polling and wine contribution management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>
        <MotionProvider>
          {children}
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}