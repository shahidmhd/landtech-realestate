import Image from 'next/image';
import { Quote } from 'lucide-react';
import type { BlogBlock } from '@/types/property';

export default function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-7 text-base leading-relaxed text-ivory/80 md:text-[17px]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return (
              <p key={i} className="first:first-letter:font-display first:first-letter:text-5xl first:first-letter:text-gold first:first-letter:float-start first:first-letter:mt-1 first:first-letter:me-3 first:first-letter:leading-[0.85]">
                {b.text}
              </p>
            );
          case 'h2':
            return (
              <h2 key={i} className="!mt-12 font-display text-3xl text-ivory md:text-4xl">
                {b.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="!mt-10 font-display text-2xl text-ivory">
                {b.text}
              </h3>
            );
          case 'quote':
            return (
              <blockquote key={i} className="!my-12 border-s-2 border-gold/60 ps-6 md:ps-8">
                <Quote className="h-6 w-6 text-gold/60" />
                <p className="mt-3 font-display text-2xl italic leading-relaxed text-ivory md:text-3xl">
                  {b.text}
                </p>
                {b.attribution && (
                  <footer className="mt-4 text-[11px] uppercase tracking-[0.32em] text-gold/80">
                    — {b.attribution}
                  </footer>
                )}
              </blockquote>
            );
          case 'list':
            return (
              <ul key={i} className="!my-6 space-y-3 ps-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case 'image':
            return (
              <figure key={i} className="!my-10">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={b.src}
                    alt={b.caption ?? ''}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
                {b.caption && (
                  <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.24em] text-ivory/55">
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
