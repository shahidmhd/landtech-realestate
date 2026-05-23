import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ScrollText, Award, Globe2, Eye, ArrowRight, Trophy } from 'lucide-react';
import { siteUrl } from '@/lib/utils';
import { awards } from '@/data/team';
import type { Locale } from '@/i18n/routing';
import TeamGrid from '@/components/about/TeamGrid';
import Stats from '@/components/home/Stats';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    alternates: {
      canonical: siteUrl(`/${locale}/about`),
      languages: {
        en: siteUrl('/en/about'),
        ar: siteUrl('/ar/about'),
        'x-default': siteUrl('/en/about'),
      },
    },
    openGraph: {
      title: t('hero_title'),
      description: t('hero_subtitle'),
      url: siteUrl(`/${locale}/about`),
    },
  };
}

const values = [
  { k: 'integrity', Icon: ScrollText },
  { k: 'excellence', Icon: Award },
  { k: 'discretion', Icon: Eye },
  { k: 'longview', Icon: Globe2 },
] as const;

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute left-1/2 top-32 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gold/8 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* story */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="container-luxe">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80&auto=format&fit=crop"
                alt="Dubai skyline"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
            </div>
            <div>
              <p className="eyebrow">{t('story_eyebrow')}</p>
              <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('story_title')}</h2>
              <p className="mt-6 text-base leading-relaxed text-ivory/75 md:text-lg">
                {t('story_body_1')}
              </p>
              <p className="mt-4 text-base leading-relaxed text-ivory/75 md:text-lg">
                {t('story_body_2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="container-luxe">
          <div className="max-w-3xl">
            <p className="eyebrow">{t('values_eyebrow')}</p>
            <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('values_title')}</h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ k, Icon }, i) => (
              <div key={k} className="bg-ink-900 p-8 md:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl text-ivory">
                  {t(`values.${k}.t`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                  {t(`values.${k}.d`)}
                </p>
                <span className="mt-6 inline-block text-[11px] uppercase tracking-[0.32em] text-gold/40">
                  · 0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* stats */}
      <Stats />

      {/* team */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="container-luxe">
          <div className="max-w-3xl">
            <p className="eyebrow">{t('team_eyebrow')}</p>
            <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('team_title')}</h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/65 md:text-lg">
              {t('team_subtitle')}
            </p>
          </div>
          <div className="mt-14">
            <TeamGrid />
          </div>
        </div>
      </section>

      {/* awards */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="container-luxe">
          <div className="max-w-3xl">
            <p className="eyebrow">{t('awards_eyebrow')}</p>
            <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('awards_title')}</h2>
          </div>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/[0.06] sm:grid-cols-2">
            {awards.map((a, i) => (
              <li key={i} className="flex items-center gap-5 bg-ink-900 p-6 md:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                  <Trophy className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-gold/85">{a.year}</p>
                  <p className="mt-1 font-display text-xl text-ivory">{a.title}</p>
                  <p className="mt-1 text-sm text-ivory/60">{a.issuer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden border-t border-white/[0.06] py-28 md:py-36">
        <div className="absolute inset-0 -z-10 bg-radial-spot opacity-50" />
        <div className="container-luxe">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display text-3xl text-ivory md:text-5xl">{t('cta_title')}</h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/70 md:text-lg">
              {t('cta_body')}
            </p>
            <Link href="/contact" className="btn-gold mt-10 inline-flex">
              {t('cta_button')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
