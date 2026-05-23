import { Check } from 'lucide-react';

export default function AmenityGrid({ amenities }: { amenities: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {amenities.map((a) => (
        <li key={a} className="flex items-center gap-3 text-sm text-ivory/80">
          <span className="inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/30">
            <Check className="h-3.5 w-3.5" />
          </span>
          {a}
        </li>
      ))}
    </ul>
  );
}
