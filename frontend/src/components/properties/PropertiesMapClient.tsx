'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { Property } from '@/types/property';

const PropertiesMap = dynamic(() => import('./PropertiesMap'), {
  ssr: false,
  loading: () => (
    <div className="grid h-[70vh] w-full place-items-center rounded-3xl border border-white/[0.08] bg-ink-800/40">
      <Loader2 className="h-6 w-6 animate-spin text-gold" />
    </div>
  ),
});

export default function PropertiesMapClient({ properties }: { properties: Property[] }) {
  return <PropertiesMap properties={properties} />;
}
