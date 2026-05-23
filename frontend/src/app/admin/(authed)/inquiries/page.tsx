'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { api, type ApiList } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/admin/Card';

type InquiryStatus = 'new' | 'in-progress' | 'qualified' | 'lost' | 'closed';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  status: InquiryStatus;
  propertySlug?: string;
  createdAt: string;
}

const STATUSES: { value: InquiryStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
  { value: 'closed', label: 'Closed' },
];

const TONES: Record<InquiryStatus, string> = {
  new: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  'in-progress': 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  qualified: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  lost: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  closed: 'bg-ivory/10 text-ivory/60 ring-white/10',
};

export default function InquiriesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<InquiryStatus | ''>('');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const query = useQuery({
    queryKey: ['inquiries', filter],
    queryFn: () => api.get<ApiList<Inquiry>>('/inquiries', { status: filter || undefined }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InquiryStatus }) =>
      api.patch(`/inquiries/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  });

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="Every lead — from property pages, contact form, newsletter."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setFilter(s.value)}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition-colors ${
              filter === s.value
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/12 text-ivory/75 hover:border-gold/40 hover:text-ivory'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
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
                    <th className="px-6 py-3">Lead</th>
                    <th className="px-6 py-3">Source</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {query.data.data.map((i) => (
                    <tr
                      key={i._id}
                      onClick={() => setSelected(i)}
                      className={`cursor-pointer transition-colors hover:bg-white/[0.02] ${
                        selected?._id === i._id ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      <td className="px-6 py-3">
                        <p className="text-ivory">{i.name}</p>
                        <p className="mt-0.5 truncate text-xs text-ivory/55">
                          {i.email}
                          {i.propertySlug ? ` · ${i.propertySlug}` : ''}
                        </p>
                      </td>
                      <td className="px-6 py-3 capitalize text-ivory/80">{i.source}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.24em] ring-1 ${TONES[i.status]}`}>
                          {i.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-xs text-ivory/55">
                        {new Date(i.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid h-40 place-items-center text-sm text-ivory/55">
                Nothing here.
              </div>
            )}
          </div>
        </Card>

        {selected && (
          <Card className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-b border-white/[0.06] p-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{selected.source}</p>
              <p className="mt-3 font-display text-2xl text-ivory">{selected.name}</p>
              <p className="mt-1 text-xs text-ivory/55">
                Received {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-ink-900/40 px-4 py-3 text-sm text-ivory transition-colors hover:border-gold/40"
                >
                  <Mail className="h-4 w-4 text-gold" />
                  {selected.email}
                </a>
                {selected.phone && (
                  <>
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-ink-900/40 px-4 py-3 text-sm text-ivory transition-colors hover:border-gold/40"
                    >
                      <Phone className="h-4 w-4 text-gold" />
                      {selected.phone}
                    </a>
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-ink-900/40 px-4 py-3 text-sm text-ivory transition-colors hover:border-gold/40"
                    >
                      <MessageCircle className="h-4 w-4 text-gold" />
                      WhatsApp
                    </a>
                  </>
                )}
                {selected.propertySlug && (
                  <a
                    href={`/properties/${selected.propertySlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-ink-900/40 px-4 py-3 text-sm text-ivory transition-colors hover:border-gold/40"
                  >
                    <ExternalLink className="h-4 w-4 text-gold" />
                    {selected.propertySlug}
                  </a>
                )}
              </div>

              {selected.message && (
                <div className="rounded-lg border border-white/[0.06] bg-ink-900/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/45">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-ivory/85">{selected.message}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/45">Update status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['new', 'in-progress', 'qualified', 'lost', 'closed'] as InquiryStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={updateStatus.isPending || selected.status === s}
                      onClick={() => {
                        updateStatus.mutate(
                          { id: selected._id, status: s },
                          {
                            onSuccess: () => setSelected({ ...selected, status: s }),
                          }
                        );
                      }}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                        selected.status === s
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/12 text-ivory/75 hover:border-gold/40 hover:text-ivory'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
