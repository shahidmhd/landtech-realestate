'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import PropertyForm, { type PropertyFormValues, emptyProperty } from '@/components/admin/PropertyForm';

// the backend stores gallery as media subdocs; the form uses URL strings
interface RawProperty extends Omit<PropertyFormValues, 'gallery'> {
  _id: string;
  gallery: (string | { url: string })[];
}
interface Response {
  status: 'success';
  data: RawProperty;
}

export default function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const query = useQuery({
    queryKey: ['property', slug],
    queryFn: () => api.get<Response>(`/properties/${slug}`),
  });

  if (query.isLoading) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (query.isError || !query.data?.data) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
        Could not load property — {query.error instanceof Error ? query.error.message : 'unknown error'}
      </div>
    );
  }

  const raw = query.data.data;
  const initial: PropertyFormValues = {
    ...emptyProperty,
    ...raw,
    gallery: (raw.gallery ?? []).map((g) => (typeof g === 'string' ? g : g.url)).filter(Boolean),
    amenities: raw.amenities ?? [],
    coordinates: raw.coordinates ?? emptyProperty.coordinates,
  };

  return (
    <>
      <PageHeader
        title={`Edit · ${initial.title}`}
        description={initial.location}
      />
      <PropertyForm initial={initial} mode="edit" />
    </>
  );
}
