import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, ArrowUpRight, CalendarDays, Hammer, MapPin, Sparkles, ScrollText } from 'lucide-react';
import { propertiesApi, tryOrFallback } from '@/lib/server-api';
import { properties as mockProperties } from '@/data/properties';
import { formatAed, siteUrl, whatsappLink } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import type { Property } from '@/types/property';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects_page' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    alternates: {
      canonical: siteUrl(`/${locale}/projects`),
      languages: {
        en: siteUrl('/en/projects'),
        ar: siteUrl('/ar/projects'),
        'x-default': siteUrl('/en/projects'),
      },
    },
    openGraph: {
      title: t('hero_title'),
      description: t('hero_subtitle'),
      url: siteUrl(`/${locale}/projects`),
    },
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects_page');
  const tc = await getTranslations('common');

  // Pull everything once; partition into off-plan vs ready in memory.
  // Mock fallback keeps the page green pre-seed.
  const apiResult = await tryOrFallback(
    () => propertiesApi.list({ limit: 200 }).then((r) => r.data),
    null
  );
  const allProperties: Property[] = apiResult && apiResult.length > 0 ? apiResult : mockProperties;

  const offPlan = allProperties.filter(
    (p) => p.status === 'off-plan' || p.newLaunch
  );
  const ready = allProperties.filter(
    (p) => !(p.status === 'off-plan' || p.newLaunch)
  );

  const featured = offPlan[0];
  const offPlanRest = offPlan.slice(1);

  // group helpers
  const byDeveloper = groupBy(offPlanRest, (p) => p.developer || 'Other');
  const byCommunity = groupBy(ready, (p) => p.community || p.location);

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute -right-32 top-12 -z-10 h-[460px] w-[460px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* featured project */}
      {featured && (
        <section className="border-t border-white/[0.06] py-24 md:py-32">
          <div className="container-luxe">
            <Link
              href={`/properties/${featured.slug}` as never}
              className="group relative block overflow-hidden rounded-[2rem] border border-white/[0.06] bg-ink-800/40"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
                  <Image
                    src={featured.cover}
                    alt={featured.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1500ms] ease-luxe group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
                  {featured.newLaunch && (
                    <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-ink-900">
                      <Sparkles className="me-1.5 h-3 w-3" /> {tc('new')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-between p-8 md:p-12">
                  <div>
                    <p className="eyebrow">{t('featured_eyebrow')}</p>
                    <h2 className="mt-4 display text-3xl text-ivory md:text-5xl">{featured.title}</h2>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-ivory/55">
                      <MapPin className="h-4 w-4 text-gold" />
                      {featured.location}{featured.community ? ` · ${featured.community}` : ''}
                    </p>

                    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                      {featured.developer && (
                        <Spec Icon={Hammer} label={t('developer')} value={featured.developer} />
                      )}
                      {featured.handover && (
                        <Spec Icon={CalendarDays} label={t('handover')} value={featured.handover} />
                      )}
                      {featured.paymentPlan && (
                        <Spec
                          Icon={ScrollText}
                          label={t('payment_plan')}
                          value={featured.paymentPlan}
                          className="col-span-2"
                        />
                      )}
                    </dl>
                  </div>

                  <div className="mt-10 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.32em] text-ivory/50">
                        {t('from_price')}
                      </p>
                      <p className="mt-2 font-display text-3xl text-ivory md:text-4xl">
                        <span className="gold-text">{tc('aed')} {formatAed(featured.price, locale)}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gold transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      {t('view_project')}
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* off-plan inventory grouped by developer */}
      <section className="border-t border-white/[0.06] py-24 md:py-32">
        <div className="container-luxe">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('all_eyebrow')}</p>
            <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('all_title')}</h2>
            <p className="mt-4 text-base text-ivory/65 md:text-lg">{t('all_subtitle')}</p>
          </div>

          {offPlanRest.length === 0 && !featured ? (
            <div className="mt-16 rounded-3xl border border-white/[0.08] bg-ink-800/40 p-12 text-center">
              <p className="font-display text-2xl text-ivory">{t('empty_title')}</p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-ivory/65">{t('empty_body')}</p>
              <Link href="/contact" className="btn-gold mt-8 inline-flex">
                {t('cta_button')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          ) : (
            <div className="mt-14 space-y-16">
              {Array.from(byDeveloper.entries()).map(([developer, items], gi) => (
                <div key={developer}>
                  <div className="mb-8 flex items-center gap-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-gold/85">
                      {String(gi + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-display text-2xl text-ivory md:text-3xl">{developer}</h3>
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent md:block rtl:bg-gradient-to-l" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((p, i) => (
                      <ProjectCard key={p._id} p={p} index={i} locale={locale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* flagship communities */}
      {byCommunity.size > 0 && (
        <section className="border-t border-white/[0.06] py-24 md:py-32">
          <div className="container-luxe">
            <div className="max-w-2xl">
              <p className="eyebrow">{t('communities_eyebrow')}</p>
              <h2 className="mt-5 display text-3xl text-ivory md:text-5xl">{t('communities_title')}</h2>
              <p className="mt-4 text-base text-ivory/65 md:text-lg">{t('communities_subtitle')}</p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(byCommunity.entries()).map(([community, items]) => {
                const cover = items[0]?.cover;
                const count = items.length;
                const minPrice = Math.min(...items.map((i) => i.price));
                const slug = encodeURIComponent(items[0]?.location || '');
                return (
                  <Link
                    key={community}
                    href={`/properties?location=${slug}` as never}
                    className="group relative block overflow-hidden bg-ink-900"
                  >
                    {cover && (
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={cover}
                          alt={community}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-[1500ms] ease-luxe group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-7">
                          <p className="text-[10px] uppercase tracking-[0.32em] text-gold/85">
                            {items[0]?.location}
                          </p>
                          <h3 className="mt-2 font-display text-2xl text-ivory">{community}</h3>
                          <div className="mt-5 flex items-end justify-between text-xs text-ivory/75">
                            <span>
                              {count} {count === 1 ? 'listing' : 'listings'}
                              <span className="mx-2 text-ivory/30">·</span>
                              <span className="text-ivory">{tc('from')} {tc('aed')} {formatAed(minPrice, locale)}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-gold transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                              {t('explore_community')}
                              <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* closing CTA */}
      <section className="relative isolate overflow-hidden border-t border-white/[0.06] py-28 md:py-36">
        <div className="absolute inset-0 -z-10 bg-radial-spot opacity-50" />
        <div className="container-luxe">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display text-3xl text-ivory md:text-5xl">{t('cta_title')}</h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/70 md:text-lg">{t('cta_body')}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-gold">
                {t('cta_button')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <a
                href={whatsappLink("Hi, I'd like a private off-plan brief.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
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

function ProjectCard({
  p, index, locale,
}: {
  p: Property; index: number; locale: string;
}) {
  return (
    <article className="group">
      <Link
        href={`/properties/${p.slug}` as never}
        className="block overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-800/40 transition-colors hover:border-gold/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={p.cover}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />
          {p.newLaunch && (
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-ink-900">
              <Sparkles className="me-1.5 h-3 w-3" /> New
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold/85">
            {p.location}
          </p>
          <h4 className="mt-2 font-display text-xl text-ivory transition-colors group-hover:text-gold">
            {p.title}
          </h4>
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-5 text-xs">
            {p.handover && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-ivory/45">Handover</dt>
                <dd className="mt-1 text-ivory">{p.handover}</dd>
              </div>
            )}
            <div>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-ivory/45">From</dt>
              <dd className="mt-1 text-ivory">
                <span className="gold-text font-medium">AED {formatAed(p.price, locale)}</span>
              </dd>
            </div>
            {p.paymentPlan && (
              <div className="col-span-2">
                <dt className="text-[10px] uppercase tracking-[0.24em] text-ivory/45">Payment plan</dt>
                <dd className="mt-1 truncate text-ivory" title={p.paymentPlan}>{p.paymentPlan}</dd>
              </div>
            )}
          </dl>
        </div>
      </Link>
    </article>
  );
}

function Spec({
  Icon, label, value, className = '',
}: {
  Icon: typeof Hammer; label: string; value: string; className?: string;
}) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-ivory/45">
        <Icon className="h-3 w-3 text-gold" />
        {label}
      </dt>
      <dd className="mt-2 text-base text-ivory">{value}</dd>
    </div>
  );
}

function groupBy<T, K extends string>(arr: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of arr) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}
