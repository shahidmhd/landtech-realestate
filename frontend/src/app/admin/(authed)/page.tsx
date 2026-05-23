'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Building2, Newspaper, MessageSquare, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { api, type ApiList } from '@/lib/api-client';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import { Card, CardBody, CardHeader } from '@/components/admin/Card';

interface PropertyLite { _id: string; title: string; slug: string; price: number; featured?: boolean; status: string; }
interface BlogLite { _id: string; title: string; slug: string; }
interface InquiryLite {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'in-progress' | 'qualified' | 'lost' | 'closed';
  source: string;
  propertySlug?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const properties = useQuery({
    queryKey: ['properties', { limit: 1 }],
    queryFn: () => api.get<ApiList<PropertyLite>>('/properties', { limit: 1, page: 1 }),
  });
  const featured = useQuery({
    queryKey: ['properties', { featured: true }],
    queryFn: () => api.get<ApiList<PropertyLite>>('/properties', { featured: true, limit: 1 }),
  });
  const blogs = useQuery({
    queryKey: ['blog', { limit: 1 }],
    queryFn: () => api.get<ApiList<BlogLite>>('/blog', { limit: 1 }),
  });
  const inquiries = useQuery({
    queryKey: ['inquiries', { status: 'new' }],
    queryFn: () => api.get<ApiList<InquiryLite>>('/inquiries', { status: 'new' }),
  });
  const recent = useQuery({
    queryKey: ['inquiries', 'recent'],
    queryFn: () => api.get<ApiList<InquiryLite>>('/inquiries'),
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A summary of what's happening across the platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Properties"
          value={properties.data?.pagination?.total ?? '—'}
          hint="Published listings"
          Icon={Building2}
        />
        <StatCard
          label="Featured"
          value={featured.data?.pagination?.total ?? '—'}
          hint="On homepage carousel"
          Icon={Sparkles}
        />
        <StatCard
          label="Articles"
          value={blogs.data?.pagination?.total ?? '—'}
          hint="Insights published"
          Icon={Newspaper}
        />
        <StatCard
          label="New inquiries"
          value={inquiries.data?.data?.length ?? '—'}
          hint="Awaiting follow-up"
          Icon={MessageSquare}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader
              title="Recent inquiries"
              actions={
                <Link
                  href="/admin/inquiries"
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-gold transition-colors hover:text-ivory"
                >
                  All <ArrowRight className="h-3 w-3" />
                </Link>
              }
            />
            <CardBody className="!p-0">
              {recent.isLoading ? (
                <div className="grid h-32 place-items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                </div>
              ) : recent.data?.data?.length ? (
                <ul className="divide-y divide-white/[0.06]">
                  {recent.data.data.slice(0, 8).map((i) => (
                    <li key={i._id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-ivory">{i.name}</p>
                        <p className="mt-0.5 truncate text-xs text-ivory/55">
                          {i.email}{i.phone ? ` · ${i.phone}` : ''}{i.propertySlug ? ` · ${i.propertySlug}` : ''}
                        </p>
                      </div>
                      <span className="flex items-center gap-3">
                        <StatusPill status={i.status} />
                        <time className="hidden text-[10px] uppercase tracking-[0.24em] text-ivory/40 sm:block">
                          {new Date(i.createdAt).toLocaleDateString()}
                        </time>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid h-32 place-items-center text-sm text-ivory/55">
                  No inquiries yet.
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title="Quick actions" />
          <CardBody className="space-y-2">
            <QuickLink href="/admin/properties/new" Icon={Building2} label="Add a property" />
            <QuickLink href="/admin/blog/new" Icon={Newspaper} label="Write an article" />
            <QuickLink href="/admin/inquiries" Icon={MessageSquare} label="Review inquiries" />
            <QuickLink href="/admin/settings" Icon={Sparkles} label="Site settings" />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function QuickLink({ href, Icon, label }: { href: string; Icon: typeof Building2; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-900/40 px-4 py-3 text-sm text-ivory/85 transition-all hover:border-gold/40 hover:text-gold"
    >
      <Icon className="h-4 w-4 text-gold" />
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
    </Link>
  );
}

const STATUS_TONES: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  'in-progress': 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  qualified: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  lost: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  closed: 'bg-ivory/10 text-ivory/60 ring-white/10',
};

function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONES[status] || STATUS_TONES.closed;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.24em] ring-1 ${tone}`}>
      {status}
    </span>
  );
}
