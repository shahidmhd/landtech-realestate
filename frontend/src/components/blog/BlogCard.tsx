'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Clock } from 'lucide-react';
import type { BlogPost } from '@/types/property';

interface Props {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

export default function BlogCard({ post, index = 0, featured = false }: Props) {
  const locale = useLocale();
  const dateFmt = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}` as never} className="block">
        <div className={`relative overflow-hidden rounded-2xl ${featured ? 'aspect-[16/10] md:aspect-[21/10]' : 'aspect-[4/3]'}`}>
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes={featured ? '100vw' : '(min-width: 768px) 33vw, 100vw'}
            priority={featured}
            className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-ink-900/65 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-gold backdrop-blur-md">
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

        <h3 className={`mt-3 font-display leading-tight text-ivory transition-colors group-hover:text-gold ${
          featured ? 'text-3xl md:text-5xl' : 'text-2xl'
        }`}>
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ivory/65">{post.excerpt}</p>

        <span className="mt-5 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-gold">
          Read article <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
        </span>
      </Link>
    </motion.article>
  );
}
