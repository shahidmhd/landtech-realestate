'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/admin/Card';
import { Field, TextInput, Textarea, FormActions } from '@/components/admin/Form';
import MediaUpload from '@/components/admin/MediaUpload';

interface Settings {
  brand?: { name?: string; tagline?: string; logo?: string };
  contact?: { phone?: string; whatsapp?: string; email?: string; address?: string; hours?: string };
  social?: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; twitter?: string; tiktok?: string };
  hero?: { videoUrl?: string; poster?: string; eyebrow?: string; title?: string; subtitle?: string };
  seo?: { defaultTitle?: string; defaultDescription?: string; ogImage?: string; gaId?: string; gtmId?: string };
  rera?: { orn?: string; license?: string; brn?: string };
}

const emptySettings: Settings = {
  brand: {}, contact: {}, social: {}, hero: {}, seo: {}, rera: {},
};

export default function SettingsPage() {
  const qc = useQueryClient();
  const [v, setV] = useState<Settings>(emptySettings);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get<{ status: 'success'; data: Settings }>('/settings'),
  });

  useEffect(() => {
    if (query.data?.data) {
      setV({ ...emptySettings, ...query.data.data });
    }
  }, [query.data]);

  const save = useMutation({
    mutationFn: (s: Settings) => api.put('/settings', s),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Save failed'),
  });

  function nest<K extends keyof Settings>(key: K) {
    return (sub: Partial<NonNullable<Settings[K]>>) =>
      setV((p) => ({ ...p, [key]: { ...(p[key] || {}), ...sub } }));
  }

  if (query.isLoading) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  const brand = nest('brand');
  const contact = nest('contact');
  const social = nest('social');
  const hero = nest('hero');
  const seo = nest('seo');
  const rera = nest('rera');

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setError(null); save.mutate(v); }}
    >
      <PageHeader
        title="Settings"
        description="Brand, contact, social and SEO defaults. These power the public site dynamically."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader title="Brand" />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand name">
                <TextInput value={v.brand?.name || ''} onChange={(val) => brand({ name: val })} />
              </Field>
              <Field label="Tagline">
                <TextInput value={v.brand?.tagline || ''} onChange={(val) => brand({ tagline: val })} />
              </Field>
            </div>
            <Field label="Logo">
              <MediaUpload
                single
                label=""
                value={v.brand?.logo ? [v.brand.logo] : []}
                onChange={(val) => brand({ logo: val[0] || '' })}
              />
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Contact details" description="Used in the footer, contact page, floating buttons." />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <TextInput value={v.contact?.phone || ''} onChange={(val) => contact({ phone: val })} placeholder="+971 4 000 0000" />
              </Field>
              <Field label="WhatsApp" hint="International format, no +">
                <TextInput value={v.contact?.whatsapp || ''} onChange={(val) => contact({ whatsapp: val })} placeholder="971500000000" />
              </Field>
              <Field label="Email">
                <TextInput type="email" value={v.contact?.email || ''} onChange={(val) => contact({ email: val })} />
              </Field>
              <Field label="Office hours">
                <TextInput value={v.contact?.hours || ''} onChange={(val) => contact({ hours: val })} placeholder="Sun – Thu · 9:00 – 19:00" />
              </Field>
            </div>
            <Field label="Address">
              <Textarea value={v.contact?.address || ''} onChange={(val) => contact({ address: val })} rows={2} />
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Social" />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Instagram"><TextInput value={v.social?.instagram || ''} onChange={(val) => social({ instagram: val })} /></Field>
              <Field label="Facebook"><TextInput value={v.social?.facebook || ''} onChange={(val) => social({ facebook: val })} /></Field>
              <Field label="LinkedIn"><TextInput value={v.social?.linkedin || ''} onChange={(val) => social({ linkedin: val })} /></Field>
              <Field label="YouTube"><TextInput value={v.social?.youtube || ''} onChange={(val) => social({ youtube: val })} /></Field>
              <Field label="Twitter / X"><TextInput value={v.social?.twitter || ''} onChange={(val) => social({ twitter: val })} /></Field>
              <Field label="TikTok"><TextInput value={v.social?.tiktok || ''} onChange={(val) => social({ tiktok: val })} /></Field>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Homepage hero" description="Override the cinematic video and copy without redeploying." />
          <CardBody className="space-y-4">
            <Field label="Hero video URL">
              <TextInput value={v.hero?.videoUrl || ''} onChange={(val) => hero({ videoUrl: val })} placeholder="https://res.cloudinary.com/.../reel.mp4" />
            </Field>
            <Field label="Poster image">
              <MediaUpload
                single
                label=""
                value={v.hero?.poster ? [v.hero.poster] : []}
                onChange={(val) => hero({ poster: val[0] || '' })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <TextInput value={v.hero?.eyebrow || ''} onChange={(val) => hero({ eyebrow: val })} />
              </Field>
              <Field label="Title">
                <TextInput value={v.hero?.title || ''} onChange={(val) => hero({ title: val })} />
              </Field>
            </div>
            <Field label="Subtitle">
              <Textarea value={v.hero?.subtitle || ''} onChange={(val) => hero({ subtitle: val })} rows={3} />
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="SEO defaults" />
          <CardBody className="space-y-4">
            <Field label="Default meta title">
              <TextInput value={v.seo?.defaultTitle || ''} onChange={(val) => seo({ defaultTitle: val })} />
            </Field>
            <Field label="Default meta description">
              <Textarea value={v.seo?.defaultDescription || ''} onChange={(val) => seo({ defaultDescription: val })} rows={3} />
            </Field>
            <Field label="Default OG image">
              <MediaUpload
                single
                label=""
                value={v.seo?.ogImage ? [v.seo.ogImage] : []}
                onChange={(val) => seo({ ogImage: val[0] || '' })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Google Analytics ID">
                <TextInput value={v.seo?.gaId || ''} onChange={(val) => seo({ gaId: val })} placeholder="G-XXXXXXXXXX" />
              </Field>
              <Field label="Google Tag Manager ID">
                <TextInput value={v.seo?.gtmId || ''} onChange={(val) => seo({ gtmId: val })} placeholder="GTM-XXXXXXX" />
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="RERA & licensing" description="Required in the footer for Dubai compliance." />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ORN">
                <TextInput value={v.rera?.orn || ''} onChange={(val) => rera({ orn: val })} />
              </Field>
              <Field label="License No">
                <TextInput value={v.rera?.license || ''} onChange={(val) => rera({ license: val })} />
              </Field>
              <Field label="BRN">
                <TextInput value={v.rera?.brn || ''} onChange={(val) => rera({ brn: val })} />
              </Field>
            </div>
          </CardBody>
        </Card>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <FormActions>
        {savedFlash && (
          <span className="inline-flex items-center gap-2 px-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
        <button
          type="submit"
          disabled={save.isPending}
          className="btn-gold disabled:opacity-60"
        >
          {save.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save settings</>}
        </button>
      </FormActions>
    </form>
  );
}
