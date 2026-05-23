import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { properties as mockProperties } from '@/data/properties';
import { applyFilters, paginate, parseQuery, PROPERTIES_PER_PAGE } from '@/lib/property-filter';
import { propertiesApi, tryOrFallback } from '@/lib/server-api';
import { siteUrl } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import PropertyCard from '@/components/home/PropertyCard';
import PropertyFilters, {
  ActiveFilterChips,
  MobileFilterTrigger,
} from '@/components/properties/PropertyFilters';
import SortDropdown from '@/components/properties/SortDropdown';
import Pagination from '@/components/properties/Pagination';
import ViewToggle from '@/components/properties/ViewToggle';
import PropertiesMapClient from '@/components/properties/PropertiesMapClient';

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'properties_index' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    alternates: {
      canonical: siteUrl(`/${locale}/properties`),
      languages: {
        en: siteUrl('/en/properties'),
        ar: siteUrl('/ar/properties'),
        'x-default': siteUrl('/en/properties'),
      },
    },
    openGraph: {
      title: t('hero_title'),
      description: t('hero_subtitle'),
      url: siteUrl(`/${locale}/properties`),
    },
  };
}

export default async function PropertiesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('properties_index');

  const query = parseQuery(sp);
  const view = (Array.isArray(sp.view) ? sp.view[0] : sp.view) === 'map' ? 'map' : 'list';

  // True if the visitor has narrowed the result set in any way.
  const hasActiveFilters = !!(
    query.q || query.location || query.type || query.status ||
    query.beds || query.baths || query.priceMin || query.priceMax
  );

  // Fetch from the live API; fall back to mock data so dev stays green pre-seed.
  // Map view needs the full filtered set, so we ask the API for everything matching the filters.
  const apiResult = await tryOrFallback(
    () => propertiesApi.list({
      q: query.q,
      location: query.location,
      category: query.type,
      status: query.status,
      beds: query.beds,
      baths: query.baths,
      priceMin: query.priceMin,
      priceMax: query.priceMax,
      sort: query.sort,
      limit: view === 'map' ? 200 : PROPERTIES_PER_PAGE,
      page: view === 'map' ? 1 : query.page,
    }),
    null
  );

  // Decide whether to render the live API results or the bundled mock dataset.
  //   - API call failed (network/server down)             → mock + apply filters locally
  //   - Mongo is genuinely empty (no properties seeded)   → mock + apply filters locally
  //   - Mongo has data but the current filter matches 0   → trust the API, show empty state
  //
  // When filters are active AND the filtered result is empty, we can't tell from this single
  // call whether the filter is to blame or Mongo is empty. We fire a tiny probe to disambiguate.
  const apiFailed = apiResult === null;
  let mongoEmpty = false;
  if (!apiFailed && apiResult!.pagination.total === 0) {
    if (hasActiveFilters) {
      const probe = await tryOrFallback(() => propertiesApi.list({ limit: 1 }), null);
      mongoEmpty = probe !== null && probe.pagination.total === 0;
    } else {
      mongoEmpty = true;
    }
  }
  const usingMock = apiFailed || mongoEmpty;

  const filtered = usingMock
    ? applyFilters(mockProperties, query)
    : apiResult!.data;

  let items: typeof filtered;
  let total: number;
  let pages: number;
  let page: number;
  if (view === 'map') {
    items = filtered;
    total = filtered.length;
    pages = 1;
    page = 1;
  } else if (usingMock) {
    ({ items, total, pages, page } = paginate(filtered, query.page));
  } else {
    items = filtered;
    total = apiResult!.pagination.total;
    pages = apiResult!.pagination.pages;
    page = apiResult!.pagination.page;
  }

  const baseQuery: Record<string, string | undefined> = {
    q: query.q,
    location: query.location,
    type: query.type,
    status: query.status,
    beds: query.beds?.toString(),
    baths: query.baths?.toString(),
    priceMin: query.priceMin?.toString(),
    priceMax: query.priceMax?.toString(),
    sort: query.sort,
  };

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden pt-40 pb-16 md:pt-48 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute -left-32 top-24 -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* listing */}
      <section className="pb-32">
        <div className="container-luxe">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            <PropertyFilters />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <MobileFilterTrigger />
                  <p className="text-sm text-ivory/70">
                    {t('results_count', { count: total })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ViewToggle />
                  <SortDropdown />
                </div>
              </div>

              <ActiveFilterChips />

              {items.length === 0 ? (
                <EmptyState />
              ) : view === 'map' ? (
                <div className="mt-8">
                  <PropertiesMapClient properties={filtered} />
                </div>
              ) : (
                <>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((p, i) => (
                      <PropertyCard key={p._id} p={p} index={i} />
                    ))}
                  </div>
                  <Pagination page={page} pages={pages} baseQuery={baseQuery} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function EmptyState() {
  const t = await getTranslations('properties_index');
  return (
    <div className="mt-16 flex flex-col items-center rounded-3xl border border-white/[0.08] bg-ink-800/40 p-12 text-center">
      <p className="font-display text-3xl text-ivory">{t('empty_title')}</p>
      <p className="mt-3 max-w-md text-sm text-ivory/65">{t('empty_body')}</p>
      <Link href="/contact" className="btn-gold mt-8">
        Contact us <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}
