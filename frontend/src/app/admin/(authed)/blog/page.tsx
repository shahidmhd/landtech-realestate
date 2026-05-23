'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Plus, Loader2, Edit3 } from 'lucide-react';
import { api, type ApiList } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/admin/Card';

interface BlogRow {
  _id: string;
  title: string;
  slug: string;
  category: string;
  cover: string;
  excerpt: string;
  published?: boolean;
  publishedAt: string;
  readMinutes: number;
}

export default function BlogListPage() {
  const query = useQuery({
    queryKey: ['blog', 'admin-list'],
    queryFn: () => api.get<ApiList<BlogRow>>('/blog', { limit: 50 }),
  });

  return (
    <>
      <PageHeader
        title="Insights"
        description="Articles, research notes and deal stories."
        actions={
          <Link href="/admin/blog/new" className="btn-gold">
            <Plus className="h-4 w-4" /> New article
          </Link>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          {query.isLoading ? (
            <div className="grid h-40 place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
            </div>
          ) : query.data?.data?.length ? (
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-[0.24em] text-ivory/45">
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3">Article</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Published</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {query.data.data.map((b) => (
                  <tr key={b._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {b.cover && (
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-ink-700">
                            <Image src={b.cover} alt="" fill sizes="64px" className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-ivory">{b.title}</p>
                          <p className="mt-0.5 truncate text-xs text-ivory/55">
                            {b.excerpt}
                            {b.published === false && <span className="ml-2 text-rose-300">· draft</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-ivory/80">{b.category}</td>
                    <td className="px-6 py-3 text-right text-xs text-ivory/55">
                      {new Date(b.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin/blog/${b.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/12 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-ivory/80 hover:border-gold hover:text-gold"
                      >
                        <Edit3 className="h-3 w-3" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid h-40 place-items-center text-sm text-ivory/55">
              No articles yet — write the first one.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
