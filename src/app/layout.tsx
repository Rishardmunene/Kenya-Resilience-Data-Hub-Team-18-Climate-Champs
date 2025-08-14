import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kenya Climate Resilience Dashboard',
  description: 'A web-based decision-support tool for environmental insights and climate resilience in Kenya',
  keywords: 'climate, resilience, dashboard, Kenya, environment, data, analytics',
  authors: [{ name: 'Team 18 Climate Champs' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Kenya Climate Resilience Dashboard',
    description: 'Empowering decision-makers with real-time environmental insights',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya Climate Resilience Dashboard',
    description: 'Empowering decision-makers with real-time environmental insights',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
