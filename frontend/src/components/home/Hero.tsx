'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, MessageCircle, Play } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

const easeLuxe: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink-900">
      {/* video bg */}
      <video
        data-hero
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80&auto=format&fit=crop"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        {/* Replace with self-hosted/Cloudinary HD reel in prod */}
        <source src="https://cdn.coverr.co/videos/coverr-dubai-skyline-aerial-2767/1080p.mp4" type="video/mp4" />
      </video>

      {/* overlays */}
      <div className="absolute inset-0 -z-10 bg-hero-fade" />
      <div className="absolute inset-0 -z-10 bg-noise opacity-[0.35] mix-blend-soft-light" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900/40 via-transparent to-transparent" />

      <div className="container-luxe relative pb-24 pt-40 md:pb-32 lg:pb-40">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLuxe, delay: 0.2 }}
          className="eyebrow"
        >
          {t('eyebrow')}
        </motion.p>

        <h1 className="mt-6 max-w-5xl display text-5xl text-ivory sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <SplitWord text={t('title_pre')} delay={0.35} />
          <span className="mx-3 inline-block align-baseline">
            <SplitWord text={t('title_mark')} delay={0.5} className="gold-text italic" />
          </span>
          <SplitWord text={t('title_post')} delay={0.65} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLuxe, delay: 0.85 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLuxe, delay: 1 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link href="/properties" className="btn-gold group">
            {t('cta_explore')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
          <Link href="/contact" className="btn-outline">
            {t('cta_consult')}
          </Link>
          <a
            href={whatsappLink('Hello, I would like to enquire about a property.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <MessageCircle className="h-4 w-4" /> {t('cta_whatsapp')}
          </a>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-ivory/60 md:flex"
        >
          <span>{t('scroll')}</span>
          <span className="relative inline-block h-10 w-px overflow-hidden bg-white/15">
            <motion.span
              className="absolute inset-0 bg-gold"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>

        {/* play badge */}
        <a
          href="#showcase"
          className="absolute right-5 top-32 hidden h-20 w-20 items-center justify-center rounded-full border border-white/15 text-ivory/80 backdrop-blur-md transition-all hover:border-gold hover:text-gold md:inline-flex rtl:left-5 rtl:right-auto"
          aria-label="Play showreel"
        >
          <Play className="h-5 w-5 fill-current" />
        </a>
      </div>
    </section>
  );
}

function SplitWord({
  text,
  delay = 0,
  className = '',
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`inline-block overflow-hidden align-baseline ${className}`}>
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, ease: easeLuxe, delay }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}
