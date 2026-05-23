import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import {
  Tag, KeyRound, Handshake, Briefcase, Building, Building2, Crown, LineChart,
  Users, Megaphone, Sparkles, Network, Wrench, Hammer, Lightbulb, Banknote,
  BadgeCheck, Globe2, ArrowRight, ArrowUpRight,
} from 'lucide-react';
import { siteUrl, phoneLink, whatsappLink } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services_page' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    alternates: {
      canonical: siteUrl(`/${locale}/services`),
      languages: {
        en: siteUrl('/en/services'),
        ar: siteUrl('/ar/services'),
        'x-default': siteUrl('/en/services'),
      },
    },
    openGraph: {
      title: t('hero_title'),
      description: t('hero_subtitle'),
      url: siteUrl(`/${locale}/services`),
    },
  };
}

const groups = [
  {
    key: 'buy_sell',
    items: [
      { k: 'sales', Icon: Tag },
      { k: 'buying', Icon: KeyRound },
      { k: 'rentals', Icon: Handshake },
      { k: 'commercial', Icon: Briefcase },
      { k: 'villas', Icon: Building },
      { k: 'apartments', Icon: Building2 },
      { k: 'penthouses', Icon: Crown },
    ],
  },
  {
    key: 'invest',
    items: [
      { k: 'investment', Icon: LineChart },
      { k: 'partners', Icon: Network },
      { k: 'offplan', Icon: Hammer },
      { k: 'owned', Icon: Sparkles },
    ],
  },
  {
    key: 'manage',
    items: [
      { k: 'management', Icon: Wrench },
      { k: 'consultancy', Icon: Lightbulb },
      { k: 'broker', Icon: Users },
      { k: 'marketing', Icon: Megaphone },
    ],
  },
  {
    key: 'concierge',
    items: [
      { k: 'mortgage', Icon: Banknote },
      { k: 'visa', Icon: BadgeCheck },
      { k: 'international', Icon: Globe2 },
    ],
  },
] as const;

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services_page');
  const tSvc = await getTranslations('services');

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute -right-40 top-12 -z-10 h-[460px] w-[460px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>

          {/* group navigation */}
          <ul className="mt-12 flex flex-wrap gap-3">
            {groups.map((g) => (
              <li key={g.key}>
                <a
                  href={`#${g.key}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ivory/80 transition-all hover:border-gold hover:text-gold"
                >
                  {t(`groups.${g.key}`)}
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* grouped service sections */}
      {groups.map((group, gi) => (
        <section
          key={group.key}
          id={group.key}
          className="scroll-mt-28 border-t border-white/[0.06] py-24 md:py-32"
        >
          <div className="container-luxe">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold/80">
                  {String(gi + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}
                </p>
                <h2 className="mt-3 display text-3xl text-ivory md:text-5xl">
                  {t(`groups.${group.key}`)}
                </h2>
              </div>
              <span className="hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent md:block ml-8 rtl:bg-gradient-to-l rtl:ml-0 rtl:mr-8" />
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map(({ k, Icon }, i) => (
                <article
                  key={k}
                  id={k}
                  className="group relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-ink-800/40 p-8 transition-all duration-500 hover:border-gold/40 hover:bg-ink-800/70"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/20 transition-all group-hover:bg-gold group-hover:text-ink-900">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-ivory transition-colors group-hover:text-gold">
                    {tSvc(`items.${k}.t`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ivory/65">
                    {tSvc(`items.${k}.d`)}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-gold/75 transition-colors group-hover:text-gold"
                  >
                    {tSvc('learn_more')}
                    <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* closing CTA */}
      <section className="relative isolate overflow-hidden border-t border-white/[0.06] py-28 md:py-36">
        <div className="absolute inset-0 -z-10 bg-radial-spot opacity-50" />
        <div className="container-luxe">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">{t('cta_title')}</p>
            <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('cta_title')}</h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/70 md:text-lg">
              {t('cta_body')}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-gold">
                {t('cta_button')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <a href={phoneLink()} className="btn-outline">Call</a>
              <a
                href={whatsappLink("Hi, I'd like to discuss your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
