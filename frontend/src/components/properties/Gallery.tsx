'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const t = useTranslations('property_detail');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, next, prev]);

  const openAt = (i: number) => { setIndex(i); setOpen(true); };

  const hero = images[0];
  const thumbs = images.slice(1, 5);
  const extra = images.length - 5;

  return (
    <>
      <div className="relative grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2">
        {/* hero (2x2 on md+) */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative col-span-1 row-span-1 aspect-[4/3] overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 md:aspect-auto"
        >
          <Image
            src={hero}
            alt={`${title} — 1`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover transition-transform duration-[1500ms] ease-luxe group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
        </button>

        {thumbs.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => openAt(i + 1)}
            className="group relative hidden aspect-square overflow-hidden rounded-2xl md:block"
          >
            <Image
              src={src}
              alt={`${title} — ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
            />
            {i === 3 && extra > 0 && (
              <span className="absolute inset-0 grid place-items-center bg-ink-900/65 text-sm uppercase tracking-[0.24em] text-ivory backdrop-blur-sm">
                +{extra}
              </span>
            )}
          </button>
        ))}

        {/* view all button (mobile floating) */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute bottom-7 left-7 inline-flex items-center gap-2 rounded-full bg-ink-900/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ivory backdrop-blur-md transition-colors hover:bg-ink-900 md:hidden"
        >
          <Maximize2 className="h-3.5 w-3.5" /> {t('view_gallery', { count: images.length })}
        </button>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-900/95 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/15 text-ivory transition-colors hover:border-gold hover:text-gold rtl:left-6 rtl:right-auto"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex h-full items-center justify-center px-4 md:px-16">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-4 grid h-14 w-14 place-items-center rounded-full border border-white/15 text-ivory transition-colors hover:border-gold hover:text-gold md:left-8 rtl:left-auto rtl:right-4 rtl:md:right-8"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>

              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[78vh] w-full max-w-6xl"
              >
                <Image
                  src={images[index]}
                  alt={`${title} — ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-4 grid h-14 w-14 place-items-center rounded-full border border-white/15 text-ivory transition-colors hover:border-gold hover:text-gold md:right-8 rtl:right-auto rtl:left-4 rtl:md:left-8"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>

              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.32em] text-ivory/65">
                {index + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
