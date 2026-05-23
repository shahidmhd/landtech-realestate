import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { BlogPost } from '@/types/property';

export default function AuthorCard({ author }: { author: BlogPost['author'] }) {
  const t = useTranslations('blog_detail');
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-ink-800/40 p-7">
      <p className="eyebrow">{t('author_title')}</p>
      <div className="mt-5 flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/40">
          <Image src={author.avatar} alt={author.name} fill sizes="64px" className="object-cover" />
        </div>
        <div>
          <p className="font-display text-xl text-ivory">{author.name}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gold/85">{author.role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-ivory/65">{author.bio}</p>
    </div>
  );
}
