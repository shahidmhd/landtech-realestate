'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import BlogForm, { type BlogFormValues, emptyBlog } from '@/components/admin/BlogForm';
import type { BlogBlock } from '@/types/property';

interface RawPost extends Omit<BlogFormValues, 'body' | 'author'> {
  _id: string;
  // backend stores the body as `content` (string JSON of blocks for our renderer)
  content?: string;
  body?: BlogBlock[];
  author?: Partial<BlogFormValues['author']>;
}
interface Response { status: 'success'; data: RawPost }

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const query = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get<Response>(`/blog/${slug}`),
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
        Could not load article — {query.error instanceof Error ? query.error.message : 'unknown error'}
      </div>
    );
  }

  const raw = query.data.data;
  const body = parseBody(raw.body, raw.content);

  const initial: BlogFormValues = {
    ...emptyBlog,
    ...raw,
    tags: raw.tags ?? [],
    body,
    author: {
      ...emptyBlog.author,
      ...(raw.author || {}),
    },
  };

  return (
    <>
      <PageHeader
        title={`Edit · ${initial.title}`}
        description={initial.excerpt}
      />
      <BlogForm initial={initial} mode="edit" />
    </>
  );
}

function parseBody(body: BlogBlock[] | undefined, content: string | undefined): BlogBlock[] {
  if (Array.isArray(body) && body.length) return body;
  if (typeof content === 'string' && content.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  // legacy / plain text fallback: wrap as single paragraph
  return content
    ? content.split(/\n\n+/).map((p): BlogBlock => ({ type: 'p', text: p.trim() })).filter((b) => b.type === 'p' && b.text)
    : [{ type: 'p', text: '' }];
}
