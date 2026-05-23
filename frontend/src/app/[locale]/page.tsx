import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { blogApi, propertiesApi, tryOrFallback } from '@/lib/server-api';
import Hero from '@/components/home/Hero';
import SearchBar from '@/components/home/SearchBar';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import Services from '@/components/home/Services';
import Stats from '@/components/home/Stats';
import LuxuryShowcase from '@/components/home/LuxuryShowcase';
import Investors from '@/components/home/Investors';
import WhyUs from '@/components/home/WhyUs';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import Faq from '@/components/home/Faq';
import Newsletter from '@/components/home/Newsletter';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch live data in parallel; each call falls back to undefined so the
  // child components fall back to their mock arrays if the API is unreachable.
  const [featured, villas, posts] = await Promise.all([
    tryOrFallback(() => propertiesApi.featured(8), undefined),
    tryOrFallback(() => propertiesApi.list({ category: 'villa', limit: 4 }).then((r) => r.data), undefined),
    tryOrFallback(() => blogApi.list({ limit: 3 }).then((r) => r.data), undefined),
  ]);

  return (
    <>
      <Hero />
      <SearchBar />
      <FeaturedProperties items={featured} />
      <Services />
      <Stats />
      <LuxuryShowcase items={villas} />
      <Investors />
      <WhyUs />
      <Testimonials />
      <BlogPreview items={posts} />
      <Faq />
      <Newsletter />
    </>
  );
}
