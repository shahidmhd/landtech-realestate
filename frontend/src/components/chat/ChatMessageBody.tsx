'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import { properties as mockProperties } from '@/data/properties';
import { formatAed } from '@/lib/utils';

/**
 * Parses [[property:slug]] markers out of the assistant's text and renders
 * them as inline property cards. Everything else renders as paragraphs.
 */
export default function ChatMessageBody({ text }: { text: string }) {
  const segments = parseSegments(text);

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-ivory/90">
      {segments.map((seg, i) => {
        if (seg.type === 'property') {
          return <PropertyEmbed key={i} slug={seg.slug} />;
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {seg.text}
          </p>
        );
      })}
    </div>
  );
}

type Segment =
  | { type: 'text'; text: string }
  | { type: 'property'; slug: string };

const MARKER = /\[\[property:([a-z0-9-]+)\]\]/g;

function parseSegments(input: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const match of input.matchAll(MARKER)) {
    const idx = match.index ?? 0;
    if (idx > last) {
      const text = input.slice(last, idx).trim();
      if (text) out.push({ type: 'text', text });
    }
    out.push({ type: 'property', slug: match[1] });
    last = idx + match[0].length;
  }
  if (last < input.length) {
    const text = input.slice(last).trim();
    if (text) out.push({ type: 'text', text });
  }
  // Collapse empty: a marker alone with nothing else
  return out.length ? out : [{ type: 'text', text: input }];
}

function PropertyEmbed({ slug }: { slug: string }) {
  const t = useTranslations('chat');
  const locale = useLocale();
  // Resolve from mock data for now — when the public site swaps to live API
  // results this could fetch from /api/v1/properties/:slug on demand.
  const p = mockProperties.find((x) => x.slug === slug);
  if (!p) {
    return (
      <div className="rounded-xl border border-white/10 bg-ink-900/40 px-4 py-3 text-xs text-ivory/55">
        Property not found: {slug}
      </div>
    );
  }
  return (
    <Link
      href={`/properties/${p.slug}` as never}
      target="_blank"
      className="group flex gap-3 overflow-hidden rounded-xl border border-white/10 bg-ink-900/50 transition-colors hover:border-gold/40"
    >
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-ink-800">
        <Image
          src={p.cover}
          alt={p.title}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-[800ms] group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1 py-3 pe-3">
        <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-gold/85">
          <MapPin className="h-3 w-3" />
          {p.location}
        </p>
        <p className="mt-1 truncate font-display text-base text-ivory transition-colors group-hover:text-gold">
          {p.title}
        </p>
        <p className="mt-1 text-xs">
          <span className="text-ivory/55">From </span>
          <span className="gold-text font-medium">AED {formatAed(p.price, locale)}</span>
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-ivory/55">
          <span className="inline-flex items-center gap-0.5"><Bed className="h-3 w-3" /> {p.bedrooms}</span>
          <span className="inline-flex items-center gap-0.5"><Bath className="h-3 w-3" /> {p.bathrooms}</span>
          <span className="inline-flex items-center gap-0.5"><Maximize2 className="h-3 w-3" /> {p.areaSqft.toLocaleString()}</span>
          <span className="ms-auto inline-flex items-center gap-1 text-gold/80">
            {t('view_property')}
            <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
          </span>
        </div>
      </div>
    </Link>
  );
}
