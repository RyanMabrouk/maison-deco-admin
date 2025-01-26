import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import Store from '@/provider/QCStore';

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
        <NextTopLoader showSpinner={false} />
        <Store>
          <Toaster />
          {children}
        </Store>
      </body>
    </html>
  );
}
