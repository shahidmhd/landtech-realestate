import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-white/[0.06] bg-ink-800/40', className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title, description, actions, className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-white/[0.06] p-6', className)}>
      <div>
        <h2 className="font-display text-xl text-ivory">{title}</h2>
        {description && <p className="mt-1 text-sm text-ivory/60">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}
