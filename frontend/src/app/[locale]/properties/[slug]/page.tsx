import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import {
  findPropertyBySlug,
  getSimilarProperties,
  properties as allProperties,
} from '@/data/properties';
import { propertiesApi } from '@/lib/server-api';
import type { Property } from '@/types/property';
import { siteUrl, phoneLink, whatsappLink } from '@/lib/utils';
import { routing, type Locale } from '@/i18n/routing';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Gallery from '@/components/properties/Gallery';
import PropertyHeader from '@/components/properties/PropertyHeader';
import PropertySpecs from '@/components/properties/PropertySpecs';
import AmenityGrid from '@/components/properties/AmenityGrid';
import FloorPlans from '@/components/properties/FloorPlans';
import MortgageCalculator from '@/components/properties/MortgageCalculator';
import RoiCalculator from '@/components/properties/RoiCalculator';
import PropertyMap from '@/components/properties/PropertyMap';
import InquiryForm from '@/components/properties/InquiryForm';
import AgentCard from '@/components/properties/AgentCard';
import ShareSaveActions from '@/components/properties/ShareSaveActions';
import SimilarProperties from '@/components/properties/SimilarProperties';
import SectionHeading from '@/components/properties/SectionHeading';
import PropertyJsonLd from '@/components/properties/PropertyJsonLd';
import CompareToggle from '@/components/properties/CompareToggle';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

/**
 * Resolve a property by slug: try API, then fall back to mock data so the
 * site stays functional even before Mongo is seeded.
 */
async function loadProperty(slug: string): Promise<{ property: Property; similar: Property[] } | null> {
  try {
    const res = await propertiesApi.bySlug(slug);
    return { property: res.data, similar: res.similar };
  } catch {
    const property = findPropertyBySlug(slug);
    if (!property) return null;
    return { property, similar: getSimilarProperties(slug) };
  }
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allProperties.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const loaded = await loadProperty(slug);
  if (!loaded) return {};
  const { property } = loaded;

  const title = property.title;
  const description = property.description.slice(0, 160);
  const canonical = siteUrl(`/${locale}/properties/${slug}`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: siteUrl(`/en/properties/${slug}`),
        ar: siteUrl(`/ar/properties/${slug}`),
        'x-default': siteUrl(`/en/properties/${slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: property.cover, width: 1600, height: 1200, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [property.cover],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const loaded = await loadProperty(slug);
  if (!loaded) notFound();
  const { property, similar } = loaded;

  const t = await getTranslations('property_detail');
  const galleryImages = [property.cover, ...property.gallery.filter((g) => g !== property.cover)];

  return (
    <>
      <PropertyJsonLd property={property} locale={locale} />

      {/* breadcrumbs */}
      <section className="pt-32 md:pt-36">
        <div className="container-luxe">
          <Breadcrumbs
            items={[
              { label: t('breadcrumbs.home'), href: '/' },
              { label: t('breadcrumbs.properties'), href: '/properties' },
              { label: property.title },
            ]}
          />
          <Link
            href="/properties"
            className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:text-gold"
          >
            <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
            {t('back')}
          </Link>
        </div>
      </section>

      {/* header + gallery */}
      <section className="pt-8 md:pt-12">
        <div className="container-luxe">
          <PropertyHeader p={property} />

          <div className="mt-10">
            <Gallery images={galleryImages} title={property.title} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <ShareSaveActions
                slug={property.slug}
                title={property.title}
                brochureUrl={property.brochureUrl}
                virtualTourUrl={property.virtualTourUrl}
              />
              <CompareToggle slug={property.slug} variant="pill" />
            </div>
            <div className="flex items-center gap-2">
              <a href={phoneLink()} className="btn-outline">{t('call')}</a>
              <a
                href={whatsappLink(`Hi, I'm interested in ${property.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                {t('whatsapp')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* specs strip */}
      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <PropertySpecs p={property} />
        </div>
      </section>

      {/* body grid: content + sticky sidebar */}
      <section className="pb-24">
        <div className="container-luxe">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="space-y-20">
              {/* overview */}
              <div>
                <SectionHeading
                  eyebrow={t('section_overview')}
                  title="About this residence"
                />
                <div className="mt-6 max-w-3xl text-base leading-relaxed text-ivory/75 md:text-lg">
                  <p>{property.description}</p>
                </div>
              </div>

              {/* amenities */}
              <div>
                <SectionHeading
                  eyebrow={t('section_amenities')}
                  title="What's included"
                />
                <div className="mt-8">
                  <AmenityGrid amenities={property.amenities} />
                </div>
              </div>

              {/* floor plans */}
              {property.floorPlans && property.floorPlans.length > 0 && (
                <div>
                  <SectionHeading
                    eyebrow={t('section_floor_plans')}
                    title="The layout"
                  />
                  <div className="mt-8">
                    <FloorPlans plans={property.floorPlans} />
                  </div>
                </div>
              )}

              {/* video + virtual tour */}
              {(property.videoUrl || property.virtualTourUrl) && (
                <div>
                  <SectionHeading
                    eyebrow={t('section_video')}
                    title="Walk through, virtually"
                  />
                  <div className="mt-8 grid gap-6">
                    {property.videoUrl && (
                      <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900">
                        <video
                          src={property.videoUrl}
                          controls
                          poster={property.cover}
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {property.virtualTourUrl && (
                      <a
                        href={property.virtualTourUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block aspect-[16/9] overflow-hidden rounded-3xl border border-white/[0.08]"
                      >
                        <iframe
                          src={property.virtualTourUrl}
                          title={`Virtual tour — ${property.title}`}
                          loading="lazy"
                          allowFullScreen
                          className="pointer-events-none h-full w-full"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-ink-900/30 backdrop-blur-[2px] transition-opacity group-hover:bg-ink-900/10">
                          <span className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-medium uppercase tracking-[0.24em] text-ink-900 shadow-gold">
                            {t('virtual_tour')}
                          </span>
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* location + nearby */}
              <div>
                <SectionHeading
                  eyebrow={t('section_location')}
                  title="Where it sits"
                />
                <div className="mt-8">
                  <PropertyMap
                    coordinates={property.coordinates}
                    nearby={property.nearby}
                    title={property.title}
                  />
                </div>
              </div>

              {/* calculators */}
              <div>
                <SectionHeading
                  eyebrow={t('section_calc')}
                  title="Run the numbers"
                />
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <MortgageCalculator price={property.price} />
                  <RoiCalculator
                    price={property.price}
                    areaSqft={property.areaSqft}
                    defaultRoi={property.roiAnnualPercent ?? 6.5}
                  />
                </div>
              </div>
            </div>

            {/* sticky sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {property.agent && (
                <AgentCard agent={property.agent} propertyTitle={property.title} />
              )}
              <InquiryForm propertySlug={property.slug} propertyTitle={property.title} />
            </aside>
          </div>
        </div>
      </section>

      <SimilarProperties items={similar} />
    </>
  );
}
