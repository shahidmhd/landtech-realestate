'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { Field, TextInput, Textarea, Select, Toggle, FormActions, inputCls } from './Form';
import MediaUpload from './MediaUpload';
import { Card, CardBody, CardHeader } from './Card';

export interface PropertyFormValues {
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  location: string;
  community: string;
  coordinates: { lat: number; lng: number };
  price: number;
  currency: 'AED' | 'USD';
  pricePerSqft?: number;
  paymentPlan?: string;
  category: 'apartment' | 'penthouse' | 'villa' | 'townhouse' | 'commercial' | 'plot';
  status: 'ready' | 'off-plan' | 'resale' | 'rental';
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parking?: number;
  developer?: string;
  handover?: string;
  yearBuilt?: number;
  cover: string;
  gallery: string[];
  amenities: string[];
  featured: boolean;
  trending: boolean;
  newLaunch: boolean;
  published: boolean;
  investmentScore?: number;
  roiAnnualPercent?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export const emptyProperty: PropertyFormValues = {
  title: '',
  description: '',
  location: '',
  community: '',
  coordinates: { lat: 25.2048, lng: 55.2708 },
  price: 0,
  currency: 'AED',
  category: 'apartment',
  status: 'ready',
  bedrooms: 1,
  bathrooms: 1,
  areaSqft: 0,
  cover: '',
  gallery: [],
  amenities: [],
  featured: false,
  trending: false,
  newLaunch: false,
  published: true,
};

interface Props {
  initial: PropertyFormValues;
  mode: 'create' | 'edit';
}

export default function PropertyForm({ initial, mode }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [v, setV] = useState<PropertyFormValues>(initial);
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      const payload = {
        ...values,
        cover: values.cover || values.gallery[0] || '',
        // backend gallery field is {url, ...} subdocs — wrap plain URLs
        gallery: values.gallery.map((url) => ({ url })),
      };
      if (mode === 'create') {
        return api.post('/properties', payload);
      }
      return api.patch(`/properties/${values._id}`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] });
      router.push('/admin/properties');
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Save failed'),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/properties/${v._id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] });
      router.push('/admin/properties');
    },
  });

  function update<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setV((p) => ({ ...p, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save.mutate(v); }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* main column */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Basics" description="The core information shown to buyers." />
            <CardBody className="space-y-4">
              <Field label="Title">
                <TextInput
                  value={v.title}
                  onChange={(val) => update('title', val)}
                  required
                  placeholder="Sky Penthouse · Burj Vista"
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={v.description}
                  onChange={(val) => update('description', val)}
                  required
                  rows={6}
                  placeholder="Write 2-4 paragraphs that tell the story of the home."
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location">
                  <TextInput
                    value={v.location}
                    onChange={(val) => update('location', val)}
                    required
                    placeholder="Downtown Dubai"
                  />
                </Field>
                <Field label="Community">
                  <TextInput
                    value={v.community}
                    onChange={(val) => update('community', val)}
                    placeholder="Burj Vista"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Latitude">
                  <TextInput
                    type="number"
                    step="any"
                    value={v.coordinates.lat}
                    onChange={(val) => update('coordinates', { ...v.coordinates, lat: Number(val) })}
                  />
                </Field>
                <Field label="Longitude">
                  <TextInput
                    type="number"
                    step="any"
                    value={v.coordinates.lng}
                    onChange={(val) => update('coordinates', { ...v.coordinates, lng: Number(val) })}
                  />
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Specifications" />
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Category">
                  <Select
                    value={v.category}
                    onChange={(val) => update('category', val as PropertyFormValues['category'])}
                    options={[
                      { value: 'apartment', label: 'Apartment' },
                      { value: 'penthouse', label: 'Penthouse' },
                      { value: 'villa', label: 'Villa' },
                      { value: 'townhouse', label: 'Townhouse' },
                      { value: 'commercial', label: 'Commercial' },
                      { value: 'plot', label: 'Plot' },
                    ]}
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={v.status}
                    onChange={(val) => update('status', val as PropertyFormValues['status'])}
                    options={[
                      { value: 'ready', label: 'Ready' },
                      { value: 'off-plan', label: 'Off-plan' },
                      { value: 'resale', label: 'Resale' },
                      { value: 'rental', label: 'Rental' },
                    ]}
                  />
                </Field>
                <Field label="Bedrooms">
                  <TextInput type="number" value={v.bedrooms} onChange={(val) => update('bedrooms', Number(val))} />
                </Field>
                <Field label="Bathrooms">
                  <TextInput type="number" value={v.bathrooms} onChange={(val) => update('bathrooms', Number(val))} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Area (sqft)">
                  <TextInput type="number" value={v.areaSqft} onChange={(val) => update('areaSqft', Number(val))} />
                </Field>
                <Field label="Parking">
                  <TextInput type="number" value={v.parking ?? ''} onChange={(val) => update('parking', val ? Number(val) : undefined)} />
                </Field>
                <Field label="Year built">
                  <TextInput type="number" value={v.yearBuilt ?? ''} onChange={(val) => update('yearBuilt', val ? Number(val) : undefined)} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Developer">
                  <TextInput value={v.developer ?? ''} onChange={(val) => update('developer', val)} placeholder="Emaar" />
                </Field>
                <Field label="Handover">
                  <TextInput value={v.handover ?? ''} onChange={(val) => update('handover', val)} placeholder="Q4 2027" />
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Pricing" />
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Price">
                  <TextInput type="number" value={v.price} onChange={(val) => update('price', Number(val))} required />
                </Field>
                <Field label="Currency">
                  <Select
                    value={v.currency}
                    onChange={(val) => update('currency', val as 'AED' | 'USD')}
                    options={[{ value: 'AED', label: 'AED' }, { value: 'USD', label: 'USD' }]}
                  />
                </Field>
                <Field label="Price / sqft">
                  <TextInput type="number" value={v.pricePerSqft ?? ''} onChange={(val) => update('pricePerSqft', val ? Number(val) : undefined)} />
                </Field>
              </div>
              <Field label="Payment plan" hint="Free text. Example: 20% down, 40% during, 40% on handover.">
                <TextInput value={v.paymentPlan ?? ''} onChange={(val) => update('paymentPlan', val)} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Media" description="First image becomes the cover. Drag the · to reorder." />
            <CardBody>
              <MediaUpload
                value={v.gallery}
                onChange={(val) => {
                  update('gallery', val);
                  if (val.length && !v.cover) update('cover', val[0]);
                }}
                label="Gallery"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Amenities" description="Comma-separated list. Use short phrases." />
            <CardBody>
              <Textarea
                value={v.amenities.join(', ')}
                onChange={(val) =>
                  update('amenities', val.split(',').map((s) => s.trim()).filter(Boolean))
                }
                rows={3}
                placeholder="Burj Khalifa view, Private elevator, Smart home"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Investment data" description="Optional — surfaces on the detail page." />
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Investment score (0-100)">
                  <TextInput type="number" value={v.investmentScore ?? ''} onChange={(val) => update('investmentScore', val ? Number(val) : undefined)} />
                </Field>
                <Field label="Expected annual ROI (%)">
                  <TextInput type="number" step="0.1" value={v.roiAnnualPercent ?? ''} onChange={(val) => update('roiAnnualPercent', val ? Number(val) : undefined)} />
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="SEO" description="Optional overrides — defaults will fall back to title/description." />
            <CardBody className="space-y-4">
              <Field label="Meta title">
                <TextInput
                  value={v.seo?.metaTitle ?? ''}
                  onChange={(val) => update('seo', { ...(v.seo || {}), metaTitle: val })}
                />
              </Field>
              <Field label="Meta description">
                <Textarea
                  value={v.seo?.metaDescription ?? ''}
                  onChange={(val) => update('seo', { ...(v.seo || {}), metaDescription: val })}
                  rows={3}
                />
              </Field>
              <Field label="Keywords (comma-separated)">
                <TextInput
                  value={v.seo?.keywords?.join(', ') ?? ''}
                  onChange={(val) =>
                    update('seo', {
                      ...(v.seo || {}),
                      keywords: val.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </Field>
            </CardBody>
          </Card>
        </div>

        {/* sidebar column */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader title="Publishing" />
            <CardBody className="space-y-4">
              <Toggle checked={v.published} onChange={(val) => update('published', val)} label="Published" />
              <Toggle checked={v.featured} onChange={(val) => update('featured', val)} label="Featured (homepage carousel)" />
              <Toggle checked={v.trending} onChange={(val) => update('trending', val)} label="Trending" />
              <Toggle checked={v.newLaunch} onChange={(val) => update('newLaunch', val)} label="New launch" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Cover image" description="If unset, the first gallery image is used." />
            <CardBody>
              <MediaUpload
                single
                label=""
                value={v.cover ? [v.cover] : []}
                onChange={(val) => update('cover', val[0] || '')}
              />
            </CardBody>
          </Card>

          {mode === 'edit' && (
            <Card>
              <CardHeader title="Danger zone" />
              <CardBody>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this property? This cannot be undone.')) remove.mutate();
                  }}
                  disabled={remove.isPending}
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-60"
                >
                  {remove.isPending ? 'Deleting…' : 'Delete property'}
                </button>
              </CardBody>
            </Card>
          )}
        </aside>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <FormActions>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          <ArrowLeft className="h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          disabled={save.isPending}
          className="btn-gold disabled:opacity-60"
        >
          {save.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> Save property</>
          )}
        </button>
      </FormActions>
    </form>
  );
}

// expose the input class for one-off usage elsewhere
export { inputCls };
