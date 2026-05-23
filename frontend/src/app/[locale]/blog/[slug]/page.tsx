import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronLeft, Clock } from 'lucide-react';
import { blogPosts, findBlogPostBySlug, getRelatedBlogPosts } from '@/data/blog';
import { blogApi } from '@/lib/server-api';
import type { BlogPost } from '@/types/property';
import { siteUrl } from '@/lib/utils';
import { routing, type Locale } from '@/i18n/routing';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogBody from '@/components/blog/BlogBody';
import ShareButtons from '@/components/blog/ShareButtons';
import AuthorCard from '@/components/blog/AuthorCard';
import BlogCard from '@/components/blog/BlogCard';
import BlogJsonLd from '@/components/blog/BlogJsonLd';
import Newsletter from '@/components/home/Newsletter';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogPosts.map((p) => ({ locale, slug: p.slug }))
  );
}

/** Try the live API first; fall back to mock so dev stays green pre-seed. */
async function loadPost(slug: string): Promise<{ post: BlogPost; related: BlogPost[] } | null> {
  try {
    const res = await blogApi.bySlug(slug);
    return { post: res.data, related: res.related };
  } catch {
    const post = findBlogPostBySlug(slug);
    if (!post) return null;
    return { post, related: getRelatedBlogPosts(slug) };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const loaded = await loadPost(slug);
  if (!loaded) return {};
  const { post } = loaded;

  const url = siteUrl(`/${locale}/blog/${slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: url,
      languages: {
        en: siteUrl(`/en/blog/${slug}`),
        ar: siteUrl(`/ar/blog/${slug}`),
        'x-default': siteUrl(`/en/blog/${slug}`),
      },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.cover, width: 1600, height: 900, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const loaded = await loadPost(slug);
  if (!loaded) notFound();
  const { post, related } = loaded;

  const t = await getTranslations('blog_detail');
  const dateFmt = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <BlogJsonLd post={post} locale={locale} />

      {/* breadcrumbs */}
      <section className="pt-32 md:pt-36">
        <div className="container-luxe">
          <Breadcrumbs
            items={[
              { label: t('breadcrumbs.home'), href: '/' },
              { label: t('breadcrumbs.blog'), href: '/blog' },
              { label: post.title },
            ]}
          />
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:text-gold"
          >
            <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
            {t('back')}
          </Link>
        </div>
      </section>

      {/* article hero */}
      <section className="pt-8 md:pt-12">
        <div className="container-luxe">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{post.category}</p>
            <h1 className="mt-5 display text-4xl text-ivory md:text-6xl lg:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ivory/70">{post.excerpt}</p>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-white/[0.06] py-6">
              <div className="flex items-center gap-4">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/30"
                />
                <div>
                  <p className="text-sm text-ivory">
                    <span className="text-ivory/50">{t('by')} </span>
                    {post.author.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-ivory/45">
                    <time dateTime={post.publishedAt}>{dateFmt.format(new Date(post.publishedAt))}</time>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t('read_time', { minutes: post.readMinutes })}
                    </span>
                  </p>
                </div>
              </div>
              <ShareButtons title={post.title} />
            </div>
          </div>

          {/* cover */}
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl md:aspect-[21/9]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* article body */}
      <section className="pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="container-luxe">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <article className="max-w-3xl">
              <BlogBody blocks={post.body} />

              {/* tags */}
              {post.tags.length > 0 && (
                <div className="mt-14 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-ivory/40">Tagged</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}` as never}
                      className="inline-flex items-center rounded-full border border-white/12 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-14">
                <ShareButtons title={post.title} />
              </div>
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <AuthorCard author={post.author} />
            </aside>
          </div>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="border-t border-white/[0.06] py-24 md:py-32">
          <div className="container-luxe">
            <p className="eyebrow">{t('related_title')}</p>
            <h2 className="mt-4 display text-3xl text-ivory md:text-5xl">{t('related_title')}</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p._id} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
