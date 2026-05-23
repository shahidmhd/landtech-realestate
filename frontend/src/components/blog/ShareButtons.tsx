'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

export default function ShareButtons({ title }: { title: string }) {
  const t = useTranslations('blog_detail');
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url, text: title }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ivory/85 transition-all hover:border-gold hover:text-gold"
      >
        <Share2 className="h-4 w-4" /> {t('share')}
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ivory/85 transition-all hover:border-gold hover:text-gold"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        {copied ? t('copied') : t('copy_link')}
      </button>
    </div>
  );
}
