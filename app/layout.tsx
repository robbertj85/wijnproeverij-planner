import type { Metadata } from 'next';
import { Inter, Lusitana } from 'next/font/google';
import './globals.css';
import { MotionProvider } from '@/components/providers/motion-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lusitana',
  display: 'swap',
});

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
      <body className={`${inter.variable} ${lusitana.variable} font-sans antialiased`}>
        <MotionProvider>
          {children}
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}