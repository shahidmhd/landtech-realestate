'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { team } from '@/data/team';

export default function TeamGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((m, i) => (
        <motion.article
          key={m._id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
          className="group overflow-hidden rounded-3xl bg-ink-800/40 ring-1 ring-white/[0.06] transition-colors hover:ring-gold/40"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={m.avatar}
              alt={m.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover grayscale transition-all duration-[1200ms] ease-luxe group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/15 to-transparent" />
            {m.linkedin && (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} on LinkedIn`}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink-900/70 text-ivory backdrop-blur-md transition-colors hover:bg-gold hover:text-ink-900 rtl:left-4 rtl:right-auto"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="p-7">
            <p className="font-display text-2xl text-ivory">{m.name}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gold/85">{m.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/65">{m.bio}</p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-ivory/40">
              {m.languages.join(' · ')}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
