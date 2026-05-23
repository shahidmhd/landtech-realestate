import { cn } from '@/lib/utils';

export function Field({
  label, hint, children, className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/55">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1 text-xs text-ivory/45">{hint}</p>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-xl border border-white/[0.08] bg-ink-900/40 px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold/40 focus:outline-none';

export const selectCls = `${inputCls} [&>option]:bg-ink-800 [&>option]:text-ivory`;

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (v: string) => void;
}
export function TextInput({ onChange, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(inputCls, className)}
    />
  );
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  onChange?: (v: string) => void;
}
export function Textarea({ onChange, className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(inputCls, 'resize-y', className)}
    />
  );
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}
export function Select({ onChange, options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      {...props}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(selectCls, className)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-ink-700'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-ivory transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      <span className="text-sm text-ivory/85">{label}</span>
    </label>
  );
}

export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-6 mt-10 flex flex-wrap justify-end gap-2 border-t border-white/[0.06] bg-ink-900/85 px-6 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
      {children}
    </div>
  );
}
