import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MarketingLayout } from '@/components/layout/marketing-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'NearbyFinder — Discover places around you',
  description: 'Find hotels, restaurants, salons, and more near your location.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <MarketingLayout>{children}</MarketingLayout>
      </body>
    </html>
  );
}
