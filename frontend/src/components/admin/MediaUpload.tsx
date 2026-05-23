'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, X, GripVertical } from 'lucide-react';
import { api } from '@/lib/api-client';

interface UploadedAsset {
  url: string;
  publicId?: string;
}

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  /** Allow only one image (cover, avatar, etc.) */
  single?: boolean;
  max?: number;
  label?: string;
  hint?: string;
}

export default function MediaUpload({
  value, onChange, single = false, max = 30, label = 'Images', hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const incoming = Array.from(files).slice(0, max - value.length);
      const res = await api.upload<{ status: 'success'; data: UploadedAsset[] }>('/uploads', incoming);
      const urls = res.data.map((a) => a.url);
      onChange(single ? urls.slice(0, 1) : [...value, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function moveTo(from: number, to: number) {
    if (from === to || to < 0 || to >= value.length) return;
    const next = value.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-[0.28em] text-ivory/55">{label}</span>
          {hint && <span className="text-xs text-ivory/40">{hint}</span>}
        </div>
      )}

      {value.length > 0 && (
        <ul className={`mb-3 grid gap-3 ${single ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
          {value.map((url, idx) => (
            <li
              key={url + idx}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900"
            >
              <Image
                src={url}
                alt={`upload-${idx}`}
                fill
                sizes="200px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-ink-900/80 via-transparent to-ink-900/0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!single && (
                  <span className="flex gap-1">
                    <IconButton onClick={() => moveTo(idx, idx - 1)} disabled={idx === 0} title="Move up">
                      <GripVertical className="h-3 w-3" />
                    </IconButton>
                  </span>
                )}
                <IconButton onClick={() => removeAt(idx)} title="Remove" danger>
                  <X className="h-3 w-3" />
                </IconButton>
              </div>
              {idx === 0 && !single && (
                <span className="absolute left-2 top-2 rounded-full bg-gold-gradient px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-ink-900">
                  Cover
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || (single && value.length >= 1) || value.length >= max}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-ink-900/40 px-4 py-6 text-sm text-ivory/70 transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-50"
      >
        {uploading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
        ) : (
          <><Upload className="h-4 w-4" /> {single ? 'Upload image' : 'Upload images'} {!single && `(${value.length}/${max})`}</>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple={!single}
        accept="image/*,video/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

function IconButton({
  onClick, children, disabled, danger, title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`grid h-7 w-7 place-items-center rounded-md backdrop-blur-md transition-colors disabled:opacity-30 ${
        danger
          ? 'bg-rose-500/80 text-white hover:bg-rose-500'
          : 'bg-ink-900/80 text-ivory hover:bg-gold hover:text-ink-900'
      }`}
    >
      {children}
    </button>
  );
}
