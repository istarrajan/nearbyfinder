import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { MarketingLayout } from '@/components/layout/marketing-layout';
import './globals.css';

const GA_MEASUREMENT_ID = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-LE6KW57JBT'
).trim();

export const metadata: Metadata = {
  title: 'NearbyFinder — Discover places around you',
  description: 'Find hotels, restaurants, salons, and more near your location.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        <MarketingLayout>{children}</MarketingLayout>
      </body>
    </html>
  );
}
