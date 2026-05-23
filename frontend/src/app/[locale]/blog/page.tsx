import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { blogPosts as mockBlogPosts, blogCategories } from '@/data/blog';
import { blogApi, tryOrFallback } from '@/lib/server-api';
import { siteUrl } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog_index' });
  return {
    title: t('hero_title'),
    description: t('hero_subtitle'),
    alternates: {
      canonical: siteUrl(`/${locale}/blog`),
      languages: {
        en: siteUrl('/en/blog'),
        ar: siteUrl('/ar/blog'),
        'x-default': siteUrl('/en/blog'),
      },
    },
    openGraph: {
      title: t('hero_title'),
      description: t('hero_subtitle'),
      url: siteUrl(`/${locale}/blog`),
    },
  };
}

export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations('blog_index');

  const category = Array.isArray(sp.category) ? sp.category[0] : sp.category;

  // try the live API first; fall back to mock if the backend is unreachable
  const apiPosts = await tryOrFallback(
    () => blogApi.list({ limit: 50, category }).then((r) => r.data),
    null
  );

  const posts = apiPosts && apiPosts.length > 0
    ? apiPosts
    : category
      ? mockBlogPosts.filter((p) => p.category === category)
      : mockBlogPosts;

  const filtered = posts;
  const [featured, ...rest] = filtered;

  return (
    <>
      {/* hero */}
      <section className="relative isolate overflow-hidden pt-40 pb-16 md:pt-48 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-ink-900 to-ink-900" />
        <div className="absolute -left-32 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
        <div className="container-luxe">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="mt-5 display text-5xl text-ivory md:text-7xl">{t('hero_title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/65 md:text-lg">
            {t('hero_subtitle')}
          </p>

          <div className="mt-10">
            <CategoryFilter categories={blogCategories} />
          </div>
          <p className="mt-6 text-sm text-ivory/55">{t('results_count', { count: filtered.length })}</p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-luxe">
          {filtered.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-white/[0.08] bg-ink-800/40 p-16 text-center">
              <p className="font-display text-2xl text-ivory">{t('empty')}</p>
            </div>
          ) : (
            <>
              {/* featured */}
              <div className="mb-20">
                <BlogCard post={featured} featured />
              </div>

              {/* rest */}
              {rest.length > 0 && (
                <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <BlogCard key={post._id} post={post} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
