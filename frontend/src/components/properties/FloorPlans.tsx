'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloorPlan { label: string; url: string }

export default function FloorPlans({ plans }: { plans: FloorPlan[] }) {
  const [active, setActive] = useState(0);
  if (plans.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {plans.map((plan, i) => (
          <button
            key={plan.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'inline-flex items-center rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition-colors',
              i === active
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/12 text-ivory/70 hover:border-gold/40 hover:text-ivory'
            )}
          >
            {plan.label}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-6 aspect-[16/10] overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-800/40"
      >
        <Image
          src={plans[active].url}
          alt={`Floor plan — ${plans[active].label}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain p-6"
        />
      </motion.div>
    </div>
  );
}
