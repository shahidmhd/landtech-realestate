'use client';

import { useTranslations } from 'next-intl';
import { MapPin, School, Building2, ShoppingBag, TrainFront, Waves, Plane, UtensilsCrossed, Hospital, Compass } from 'lucide-react';
import type { NearbyPlace } from '@/types/property';

const ICONS: Record<NearbyPlace['type'], typeof MapPin> = {
  school: School,
  hospital: Hospital,
  mall: ShoppingBag,
  metro: TrainFront,
  beach: Waves,
  airport: Plane,
  restaurant: UtensilsCrossed,
  other: Compass,
};

export default function PropertyMap({
  coordinates, nearby, title,
}: {
  coordinates: { lat: number; lng: number };
  nearby?: NearbyPlace[];
  title: string;
}) {
  const t = useTranslations('property_detail');
  const { lat, lng } = coordinates;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08]">
        <iframe
          src={mapSrc}
          title={`Map — ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[16/10] w-full grayscale-[0.4] contrast-110"
          allowFullScreen
        />
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-ink-900/85 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ivory backdrop-blur-md transition-colors hover:bg-gold hover:text-ink-900"
        >
          <MapPin className="h-3.5 w-3.5" /> Directions
        </a>
      </div>

      {nearby && nearby.length > 0 && (
        <div className="rounded-3xl border border-white/[0.08] bg-ink-800/40 p-6">
          <p className="eyebrow">
            <MapPin className="h-3.5 w-3.5" />
            {t('nearby_title')}
          </p>
          <ul className="mt-5 space-y-4">
            {nearby.map((n, i) => {
              const Icon = ICONS[n.type] ?? Compass;
              return (
                <li key={i} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm text-ivory">{n.name}</span>
                      <span className="block text-[10px] uppercase tracking-[0.24em] text-ivory/45">
                        {t(`nearby_types.${n.type}`)}
                      </span>
                    </span>
                  </span>
                  <span className="text-xs text-ivory/65">
                    {n.distanceKm === 0 ? '—' : `${n.distanceKm} km`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
