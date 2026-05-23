'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Loader2, X, Save, Star } from 'lucide-react';
import { api, type ApiList } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/admin/Card';
import { Field, TextInput, Textarea, Toggle } from '@/components/admin/Form';
import MediaUpload from '@/components/admin/MediaUpload';

interface Testimonial {
  _id?: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  published: boolean;
  order: number;
}

const empty: Testimonial = {
  quote: '', name: '', role: '', avatar: '', rating: 5, published: true, order: 0,
};

export default function TestimonialsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const list = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get<ApiList<Testimonial>>('/testimonials'),
  });

  const save = useMutation({
    mutationFn: (t: Testimonial) =>
      t._id ? api.patch(`/testimonials/${t._id}`, t) : api.post('/testimonials', t),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client voices shown on the homepage and the about page."
        actions={
          <button type="button" onClick={() => setEditing(empty)} className="btn-gold">
            <Plus className="h-4 w-4" /> New testimonial
          </button>
        }
      />

      {list.isLoading ? (
        <Card className="grid h-40 place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.data?.data?.map((t) => (
            <article key={t._id} className="relative rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6">
              <div className="flex items-start gap-3">
                {t.avatar ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/30">
                    <Image src={t.avatar} alt={t.name} fill sizes="48px" className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold font-display text-lg">
                    {t.name?.[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ivory">{t.name}</p>
                  <p className="mt-0.5 truncate text-xs text-ivory/55">{t.role}</p>
                </div>
                <div className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ivory/75">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-4 text-[10px] uppercase tracking-[0.24em]">
                <span className={t.published ? 'text-emerald-300' : 'text-rose-300'}>
                  {t.published ? 'Live' : 'Hidden'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(t)}
                    className="grid h-8 w-8 place-items-center rounded-md text-ivory/65 hover:bg-white/[0.04] hover:text-gold"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (t._id && confirm('Delete this testimonial?')) remove.mutate(t._id);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-md text-ivory/65 hover:bg-rose-500/15 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {list.data?.data?.length === 0 && (
            <Card className="grid h-40 place-items-center text-sm text-ivory/55 sm:col-span-2 lg:col-span-3">
              No testimonials yet — add the first one.
            </Card>
          )}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <TestimonialModal
            value={editing}
            onChange={setEditing}
            onSave={() => save.mutate(editing)}
            onClose={() => setEditing(null)}
            saving={save.isPending}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function TestimonialModal({
  value, onChange, onSave, onClose, saving,
}: {
  value: Testimonial;
  onChange: (v: Testimonial) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  function update<K extends keyof Testimonial>(k: K, v: Testimonial[K]) {
    onChange({ ...value, [k]: v });
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-ink-900/85 px-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-ink-800 shadow-luxe"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <p className="font-display text-xl">{value._id ? 'Edit testimonial' : 'New testimonial'}</p>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-ivory/65 hover:text-ivory">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <Field label="Quote">
            <Textarea value={value.quote} onChange={(v) => update('quote', v)} rows={4} required />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <TextInput value={value.name} onChange={(v) => update('name', v)} required />
            </Field>
            <Field label="Role">
              <TextInput value={value.role} onChange={(v) => update('role', v)} />
            </Field>
          </div>
          <Field label="Avatar">
            <MediaUpload
              single
              label=""
              value={value.avatar ? [value.avatar] : []}
              onChange={(v) => update('avatar', v[0] || '')}
            />
          </Field>
          <div className="grid items-end gap-3 sm:grid-cols-3">
            <Field label="Rating (1-5)">
              <TextInput type="number" min={1} max={5} value={value.rating} onChange={(v) => update('rating', Math.min(5, Math.max(1, Number(v))))} />
            </Field>
            <Field label="Order">
              <TextInput type="number" value={value.order} onChange={(v) => update('order', Number(v))} />
            </Field>
            <Toggle checked={value.published} onChange={(v) => update('published', v)} label="Published" />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] px-6 py-4">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn-gold disabled:opacity-60"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
