import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle, Mail, BadgeCheck } from 'lucide-react';
import type { Agent } from '@/types/property';
import { whatsappLink } from '@/lib/utils';

export default function AgentCard({ agent, propertyTitle }: { agent: Agent; propertyTitle: string }) {
  const t = useTranslations('property_detail');

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-ink-800/40 p-6">
      <p className="eyebrow">{t('agent_title')}</p>
      <div className="mt-5 flex items-start gap-4">
        {agent.avatar && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/40">
            <Image src={agent.avatar} alt={agent.name} fill sizes="64px" className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-display text-xl text-ivory">{agent.name}</p>
          {agent.role && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gold/85">{agent.role}</p>
          )}
          {agent.licenseNo && (
            <p className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-ivory/50">
              <BadgeCheck className="h-3 w-3 text-gold" />
              {t('license')} · {agent.licenseNo}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <a href={`tel:${agent.phone}`} className="btn-outline w-full">
          <Phone className="h-4 w-4" /> {agent.phone}
        </a>
        <a
          href={whatsappLink(`Hi ${agent.name.split(' ')[0]}, I'm interested in ${propertyTitle}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium uppercase tracking-wide text-white transition-all hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> {t('whatsapp')}
        </a>
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="btn-ghost w-full justify-center">
            <Mail className="h-4 w-4" /> {agent.email}
          </a>
        )}
      </div>
    </div>
  );
}
