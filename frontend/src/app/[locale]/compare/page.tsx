import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { siteUrl } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import CompareClient from './CompareClient';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'compare' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    robots: { index: false, follow: true },
    alternates: {
      canonical: siteUrl(`/${locale}/compare`),
      languages: {
        en: siteUrl('/en/compare'),
        ar: siteUrl('/ar/compare'),
        'x-default': siteUrl('/en/compare'),
      },
    },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('compare');

  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-16 md:pt-48 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute -right-32 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-luxe">
          <CompareClient />
        </div>
      </section>
    </>
  );
}
