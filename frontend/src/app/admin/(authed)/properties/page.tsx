'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Loader2, Edit3 } from 'lucide-react';
import { api, type ApiList } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/admin/Card';
import { TextInput, Select } from '@/components/admin/Form';

interface PropertyRow {
  _id: string;
  title: string;
  slug: string;
  location: string;
  category: string;
  status: string;
  price: number;
  bedrooms: number;
  cover: string;
  featured?: boolean;
  published?: boolean;
  updatedAt: string;
}

export default function PropertiesListPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['properties', { q, status, category, page }],
    queryFn: () => api.get<ApiList<PropertyRow>>('/properties', {
      q: q || undefined,
      status: status || undefined,
      category: category || undefined,
      page,
      limit: 20,
    }),
  });

  return (
    <>
      <PageHeader
        title="Properties"
        description="Manage every listing in your portfolio."
        actions={
          <Link href="/admin/properties/new" className="btn-gold">
            <Plus className="h-4 w-4" /> New property
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] p-4">
          <label className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/40" />
            <TextInput
              value={q}
              onChange={setQ}
              placeholder="Search title, location, developer…"
              className="pl-9"
            />
          </label>
          <Select
            value={category}
            onChange={setCategory}
            placeholder="All categories"
            options={[
              { value: 'apartment', label: 'Apartment' },
              { value: 'penthouse', label: 'Penthouse' },
              { value: 'villa', label: 'Villa' },
              { value: 'townhouse', label: 'Townhouse' },
              { value: 'commercial', label: 'Commercial' },
              { value: 'plot', label: 'Plot' },
            ]}
            className="w-48"
          />
          <Select
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={[
              { value: 'ready', label: 'Ready' },
              { value: 'off-plan', label: 'Off-plan' },
              { value: 'resale', label: 'Resale' },
              { value: 'rental', label: 'Rental' },
            ]}
            className="w-44"
          />
        </div>

        <div className="overflow-x-auto">
          {query.isLoading ? (
            <div className="grid h-40 place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
            </div>
          ) : query.data?.data?.length ? (
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-[0.24em] text-ivory/45">
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Price (AED)</th>
                  <th className="px-6 py-3 text-right">Updated</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {query.data.data.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {p.cover && (
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-ink-700">
                            <Image
                              src={p.cover}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-ivory">{p.title}</p>
                          <p className="mt-0.5 truncate text-xs text-ivory/55">
                            {p.location}
                            {p.featured && <span className="ml-2 text-gold">· featured</span>}
                            {p.published === false && <span className="ml-2 text-rose-300">· draft</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 capitalize text-ivory/80">{p.category}</td>
                    <td className="px-6 py-3 text-ivory/80">{p.status}</td>
                    <td className="px-6 py-3 text-right text-ivory">
                      {p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-ivory/55">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin/properties/${p.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/12 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-ivory/80 transition-colors hover:border-gold hover:text-gold"
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
              No properties match.
            </div>
          )}
        </div>

        {query.data?.pagination && query.data.pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4 text-xs">
            <span className="text-ivory/55">
              Page {query.data.pagination.page} of {query.data.pagination.pages} · {query.data.pagination.total} total
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={query.data.pagination.page === 1}
                className="rounded-lg border border-white/12 px-3 py-1.5 text-ivory/80 hover:border-gold hover:text-gold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={query.data.pagination.page >= query.data.pagination.pages}
                className="rounded-lg border border-white/12 px-3 py-1.5 text-ivory/80 hover:border-gold hover:text-gold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
