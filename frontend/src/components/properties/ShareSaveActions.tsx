'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Heart, Download, Compass, Play, Check } from 'lucide-react';

interface Props {
  slug: string;
  title: string;
  brochureUrl?: string;
  virtualTourUrl?: string;
  videoUrl?: string;
  onPlayVideo?: () => void;
}

const STORAGE_KEY = 'luxe_saved_properties';

export default function ShareSaveActions({
  slug, title, brochureUrl, virtualTourUrl, videoUrl, onPlayVideo,
}: Props) {
  const t = useTranslations('property_detail');
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const list = JSON.parse(raw) as string[];
      setSaved(list.includes(slug));
    } catch {}
  }, [slug]);

  function toggleSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(next.includes(slug));
      // notify other components on the same page
      window.dispatchEvent(new Event('luxe:saved-changed'));
    } catch {}
  }

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url, text: title });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionButton onClick={share} label={shared ? 'Copied' : t('share')}>
        {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      </ActionButton>

      <ActionButton onClick={toggleSave} active={saved} label={saved ? t('saved') : t('save')}>
        <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      </ActionButton>

      {brochureUrl && (
        <a
          href={brochureUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="action-pill"
        >
          <Download className="h-4 w-4" /> {t('download_brochure')}
        </a>
      )}

      {virtualTourUrl && (
        <a
          href={virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="action-pill"
        >
          <Compass className="h-4 w-4" /> {t('virtual_tour')}
        </a>
      )}

      {videoUrl && onPlayVideo && (
        <button type="button" onClick={onPlayVideo} className="action-pill">
          <Play className="h-4 w-4" /> {t('watch_video')}
        </button>
      )}

      <style jsx>{`
        :global(.action-pill) {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(245,241,232,0.85);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          transition: all 250ms cubic-bezier(0.22,1,0.36,1);
        }
        :global(.action-pill:hover) {
          border-color: #C8A45C;
          color: #C8A45C;
        }
      `}</style>
    </div>
  );
}

function ActionButton({
  onClick, label, active, children,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
        active
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-white/12 text-ivory/85 hover:border-gold hover:text-gold'
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
