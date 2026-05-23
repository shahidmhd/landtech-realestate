'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { Field, TextInput, Textarea, Toggle, FormActions } from './Form';
import MediaUpload from './MediaUpload';
import BlockEditor from './BlockEditor';
import { Card, CardBody, CardHeader } from './Card';
import type { BlogBlock } from '@/types/property';

export interface BlogFormValues {
  _id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  cover: string;
  category: string;
  tags: string[];
  readMinutes: number;
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
  };
  // backend stores content as a single string; we serialise our blocks into JSON
  body: BlogBlock[];
  published: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
}

export const emptyBlog: BlogFormValues = {
  title: '',
  excerpt: '',
  cover: '',
  category: 'Market Notes',
  tags: [],
  readMinutes: 5,
  author: { name: '', role: '', bio: '', avatar: '' },
  body: [{ type: 'p', text: '' }],
  published: true,
};

interface Props {
  initial: BlogFormValues;
  mode: 'create' | 'edit';
}

export default function BlogForm({ initial, mode }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [v, setV] = useState<BlogFormValues>(initial);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BlogFormValues>(key: K, val: BlogFormValues[K]) {
    setV((p) => ({ ...p, [key]: val }));
  }

  const save = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      // backend Blog model uses `content` as a string — we serialise our typed blocks
      const payload = {
        ...values,
        content: JSON.stringify(values.body),
      };
      if (mode === 'create') return api.post('/blog', payload);
      return api.patch(`/blog/${values._id}`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog'] });
      router.push('/admin/blog');
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Save failed'),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/blog/${v._id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog'] });
      router.push('/admin/blog');
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save.mutate(v); }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Article" />
            <CardBody className="space-y-4">
              <Field label="Title">
                <TextInput
                  value={v.title}
                  onChange={(val) => update('title', val)}
                  required
                  placeholder="Dubai Luxury Market — Q3 Briefing"
                />
              </Field>
              <Field label="Excerpt" hint="One-sentence hook shown on the index and OG preview.">
                <Textarea
                  value={v.excerpt}
                  onChange={(val) => update('excerpt', val)}
                  required
                  rows={3}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Category">
                  <TextInput value={v.category} onChange={(val) => update('category', val)} placeholder="Market Notes" />
                </Field>
                <Field label="Tags" hint="Comma-separated">
                  <TextInput
                    value={v.tags.join(', ')}
                    onChange={(val) => update('tags', val.split(',').map((s) => s.trim()).filter(Boolean))}
                  />
                </Field>
                <Field label="Read time (min)">
                  <TextInput
                    type="number"
                    min={1}
                    value={v.readMinutes}
                    onChange={(val) => update('readMinutes', Number(val))}
                  />
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Body" description="Build the article from typed blocks. Drag-free reorder with the arrows." />
            <CardBody>
              <BlockEditor value={v.body} onChange={(val) => update('body', val)} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Author" />
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <TextInput
                    value={v.author.name}
                    onChange={(val) => update('author', { ...v.author, name: val })}
                  />
                </Field>
                <Field label="Role">
                  <TextInput
                    value={v.author.role}
                    onChange={(val) => update('author', { ...v.author, role: val })}
                  />
                </Field>
              </div>
              <Field label="Bio">
                <Textarea
                  value={v.author.bio}
                  onChange={(val) => update('author', { ...v.author, bio: val })}
                  rows={3}
                />
              </Field>
              <Field label="Avatar">
                <MediaUpload
                  single
                  label=""
                  value={v.author.avatar ? [v.author.avatar] : []}
                  onChange={(val) => update('author', { ...v.author, avatar: val[0] || '' })}
                />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="SEO" description="Optional overrides." />
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
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader title="Publishing" />
            <CardBody>
              <Toggle checked={v.published} onChange={(val) => update('published', val)} label="Published" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Cover image" />
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
                    if (confirm('Delete this article? This cannot be undone.')) remove.mutate();
                  }}
                  disabled={remove.isPending}
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-60"
                >
                  {remove.isPending ? 'Deleting…' : 'Delete article'}
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
        <button type="button" onClick={() => router.back()} className="btn-outline">
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
            <><Save className="h-4 w-4" /> Save article</>
          )}
        </button>
      </FormActions>
    </form>
  );
}
