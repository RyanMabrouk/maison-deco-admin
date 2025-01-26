import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import Store from '@/provider/QCStore';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-color3  `}
        suppressHydrationWarning={true}
      >
        <Analytics />
        <NextTopLoader showSpinner={false} />
        <Store>
          <Toaster />
          {children}
        </Store>
      </body>
    </html>
  );
}
