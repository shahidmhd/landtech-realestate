import { useTranslations } from 'next-intl';
import PropertyCard from '@/components/home/PropertyCard';
import type { Property } from '@/types/property';

export default function SimilarProperties({ items }: { items: Property[] }) {
  const t = useTranslations('property_detail');
  if (items.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe">
        <p className="eyebrow">{t('section_similar')}</p>
        <h2 className="mt-4 display text-3xl text-ivory md:text-5xl">
          More to consider
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <PropertyCard key={p._id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
