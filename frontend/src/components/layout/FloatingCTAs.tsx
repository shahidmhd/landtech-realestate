'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
import { phoneLink, whatsappLink } from '@/lib/utils';

export default function FloatingCTAs() {
  const locale = useLocale();
  const side = locale === 'ar' ? 'left' : 'right';

  return (
    <div
      className="fixed bottom-6 z-40 flex flex-col gap-3"
      style={{ [side]: '1rem' } as React.CSSProperties}
    >
      <motion.a
        href={whatsappLink('Hello, I would like to enquire about a property.')}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-luxe ring-1 ring-white/10"
        aria-label="WhatsApp"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" aria-hidden />
        <MessageCircle className="relative h-6 w-6" />
      </motion.a>

      <motion.a
        href={phoneLink()}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="inline-grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-ink-900 shadow-gold ring-1 ring-white/10"
        aria-label="Call"
      >
        <Phone className="h-5 w-5" />
      </motion.a>
    </div>
  );
}
