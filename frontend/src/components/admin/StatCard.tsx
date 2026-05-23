import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  Icon: LucideIcon;
  trend?: { value: number; positive?: boolean };
}

export default function StatCard({ label, value, hint, Icon, trend }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6 transition-colors hover:border-gold/30">
      <div className="flex items-start justify-between">
        <p className="text-[10px] uppercase tracking-[0.32em] text-ivory/55">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold ring-1 ring-gold/20">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 font-display text-4xl text-ivory">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {trend && (
          <span className={trend.positive !== false ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.positive !== false ? '↑' : '↓'} {trend.value}%
          </span>
        )}
        {hint && <span className="text-ivory/45">{hint}</span>}
      </div>
    </div>
  );
}
