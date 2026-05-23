import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import AdminQueryProvider from '@/components/admin/QueryProvider';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Admin · Luxe Estates', template: '%s · Admin' },
  description: 'Luxe Estates admin panel',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-ink-900 font-sans text-ivory antialiased">
        <AdminQueryProvider>{children}</AdminQueryProvider>
      </body>
    </html>
  );
}
