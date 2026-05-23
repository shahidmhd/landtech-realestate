import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Poppins, Cormorant_Garamond, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { siteUrl } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCTAs from '@/components/layout/FloatingCTAs';
import SmoothScroll from '@/components/layout/SmoothScroll';
import StructuredData from '@/components/seo/StructuredData';
import CompareTray from '@/components/properties/CompareTray';
import ChatWidget from '@/components/chat/ChatWidget';
import { settingsApi, tryOrFallback } from '@/lib/server-api';
import '../globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'brand' });
  const title = t('name');
  const description = t('tagline');

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `${title} — ${description}`,
      template: `%s · ${title}`,
    },
    description,
    applicationName: title,
    authors: [{ name: title }],
    keywords: [
      'Dubai real estate',
      'luxury properties Dubai',
      'off-plan Dubai',
      'penthouses Dubai',
      'Palm Jumeirah villas',
      'Downtown Dubai apartments',
      'Golden Visa investment',
      'Dubai property investment',
    ],
    alternates: {
      canonical: siteUrl(`/${locale}`),
      languages: {
        en: siteUrl('/en'),
        ar: siteUrl('/ar'),
        'x-default': siteUrl('/en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: title,
      title,
      description,
      url: siteUrl(`/${locale}`),
      locale: locale === 'ar' ? 'ar_AE' : 'en_AE',
      images: [
        {
          url: '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: [{ url: '/favicon.png', type: 'image/png' }],
      shortcut: '/favicon.png',
      apple: '/favicon.png',
    },
    manifest: '/site.webmanifest',
  };
}

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Brand settings come from Mongo (admin → Settings). Empty object if API down.
  const settings = await tryOrFallback(() => settingsApi.get(), {});
  const brand = settings.brand || {};

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${poppins.variable} ${cormorant.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink-900 font-sans text-ivory antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <StructuredData locale={locale} />
          <Header brand={brand} />
          <main id="main" className="relative overflow-x-clip">
            {children}
          </main>
          <Footer brand={brand} />
          <FloatingCTAs />
          <CompareTray />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
