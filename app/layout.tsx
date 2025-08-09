import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import PerformanceMonitor from '@/components/ui/performance-monitor';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Allo Health - Front Desk Management System',
  description: 'Comprehensive clinic management system for front desk operations, patient management, appointments, and queue management.',
  keywords: 'clinic management, healthcare, patient management, appointments, queue management',
  authors: [{ name: 'Allo Health' }],
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
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
