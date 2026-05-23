'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredProperties as mockFeatured } from '@/data/properties';
import type { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

export default function FeaturedProperties({ items }: { items?: Property[] } = {}) {
  const t = useTranslations('featured');
  const data = items && items.length > 0 ? items : mockFeatured;
  const locale = useLocale();
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: 'start', direction: locale === 'ar' ? 'rtl' : 'ltr' },
    [Autoplay({ delay: 5500, stopOnInteraction: true })]
  );
  const [, setCount] = useState(0);

  useEffect(() => {
    if (!embla) return;
    setCount(embla.scrollSnapList().length);
    embla.on('select', () => setCount((c) => c + 0));
  }, [embla]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <section className="relative py-28 md:py-36">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 display text-4xl text-ivory md:text-6xl">{t('title')}</h2>
            <p className="mt-5 max-w-lg text-base text-ivory/65">{t('subtitle')}</p>
          </motion.div>

          <div className="hidden items-center gap-2 md:flex">
            <CarouselButton onClick={prev} label="Previous">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </CarouselButton>
            <CarouselButton onClick={next} label="Next">
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </CarouselButton>
            <Link href="/properties" className="btn-outline ml-3">
              {t('view_all')}
            </Link>
          </div>
        </div>

        <div className="mt-14 embla" ref={emblaRef}>
          <div className="embla__container -mx-3">
            {data.map((p, i) => (
              <div
                key={p._id}
                className="embla__slide px-3 basis-[88%] sm:basis-[60%] lg:basis-[34%]"
              >
                <PropertyCard p={p} index={i} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/properties" className="btn-outline">
            {t('view_all')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  children, onClick, label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-grid h-12 w-12 place-items-center rounded-full border border-white/15 text-ivory/85 transition-all hover:border-gold hover:text-gold"
    >
      {children}
    </button>
  );
}
