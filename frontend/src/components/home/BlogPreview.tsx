'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Clock } from 'lucide-react';
import { blogPosts as mockBlogPosts } from '@/data/blog';
import type { BlogPost } from '@/types/property';

export default function BlogPreview({ items }: { items?: BlogPost[] } = {}) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const blogPosts = items && items.length > 0 ? items : mockBlogPosts;
  const dateFmt = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <section className="relative py-28 md:py-36">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 display text-4xl text-ivory md:text-5xl">{t('title')}</h2>
            <p className="mt-4 max-w-md text-base text-ivory/65">{t('subtitle')}</p>
          </motion.div>
          <Link href="/blog" className="btn-outline hidden md:inline-flex">
            {t('view_all')}
          </Link>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}` as never} className="block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-ink-900/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-gold backdrop-blur-md">
                    {post.category}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-ivory/55">
                  <time dateTime={post.publishedAt}>{dateFmt.format(new Date(post.publishedAt))}</time>
                  <span className="h-px w-6 bg-white/15" />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readMinutes} min
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight text-ivory transition-colors group-hover:text-gold">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-gold">
                  {t('read')} <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
