'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ArrowUp, ArrowDown, Pilcrow, Heading2, Heading3,
  Quote, List, Image as ImageIcon, Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import type { BlogBlock } from '@/types/property';
import { inputCls } from './Form';

interface Props {
  value: BlogBlock[];
  onChange: (next: BlogBlock[]) => void;
}

export default function BlockEditor({ value, onChange }: Props) {
  function add(type: BlogBlock['type']) {
    const fresh = blank(type);
    onChange([...value, fresh]);
  }

  function update(i: number, patch: Partial<BlogBlock>) {
    onChange(value.map((b, idx) => (idx === i ? { ...b, ...patch } as BlogBlock : b)));
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {value.map((b, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-white/[0.08] bg-ink-900/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-gold/85">
                  <BlockIcon type={b.type} />
                  {LABELS[b.type]}
                </span>
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn onClick={() => move(i, 1)} disabled={i === value.length - 1} title="Move down">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn onClick={() => remove(i)} title="Delete" danger>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconBtn>
                </div>
              </div>

              <BlockEditorRow block={b} onPatch={(p) => update(i, p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-dashed border-white/[0.08] bg-ink-900/30 p-3">
        <AddButton onClick={() => add('p')} Icon={Pilcrow} label="Paragraph" />
        <AddButton onClick={() => add('h2')} Icon={Heading2} label="Heading" />
        <AddButton onClick={() => add('h3')} Icon={Heading3} label="Subheading" />
        <AddButton onClick={() => add('quote')} Icon={Quote} label="Quote" />
        <AddButton onClick={() => add('list')} Icon={List} label="List" />
        <AddButton onClick={() => add('image')} Icon={ImageIcon} label="Image" />
      </div>
    </div>
  );
}

const LABELS: Record<BlogBlock['type'], string> = {
  p: 'Paragraph',
  h2: 'Heading',
  h3: 'Subheading',
  quote: 'Quote',
  list: 'List',
  image: 'Image',
};

function blank(type: BlogBlock['type']): BlogBlock {
  switch (type) {
    case 'p': return { type: 'p', text: '' };
    case 'h2': return { type: 'h2', text: '' };
    case 'h3': return { type: 'h3', text: '' };
    case 'quote': return { type: 'quote', text: '', attribution: '' };
    case 'list': return { type: 'list', items: [''] };
    case 'image': return { type: 'image', src: '', caption: '' };
  }
}

function BlockIcon({ type }: { type: BlogBlock['type'] }) {
  const Icon = {
    p: Pilcrow, h2: Heading2, h3: Heading3, quote: Quote, list: List, image: ImageIcon,
  }[type];
  return <Icon className="h-3.5 w-3.5" />;
}

function BlockEditorRow({
  block, onPatch,
}: {
  block: BlogBlock; onPatch: (p: Partial<BlogBlock>) => void;
}) {
  switch (block.type) {
    case 'p':
      return (
        <textarea
          value={block.text}
          onChange={(e) => onPatch({ text: e.target.value })}
          rows={4}
          placeholder="Write your paragraph…"
          className={`${inputCls} resize-y`}
        />
      );
    case 'h2':
    case 'h3':
      return (
        <input
          value={block.text}
          onChange={(e) => onPatch({ text: e.target.value })}
          placeholder={block.type === 'h2' ? 'Section heading' : 'Sub-heading'}
          className={`${inputCls} ${block.type === 'h2' ? 'font-display text-2xl' : 'font-display text-xl'}`}
        />
      );
    case 'quote':
      return (
        <div className="space-y-2">
          <textarea
            value={block.text}
            onChange={(e) => onPatch({ text: e.target.value })}
            rows={3}
            placeholder="Pull quote…"
            className={`${inputCls} italic`}
          />
          <input
            value={block.attribution || ''}
            onChange={(e) => onPatch({ attribution: e.target.value })}
            placeholder="Attribution (optional)"
            className={inputCls}
          />
        </div>
      );
    case 'list':
      return (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <input
                value={item}
                onChange={(e) => {
                  const next = block.items.slice();
                  next[i] = e.target.value;
                  onPatch({ items: next });
                }}
                placeholder={`Item ${i + 1}`}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => onPatch({ items: block.items.filter((_, j) => j !== i) })}
                className="grid h-7 w-7 place-items-center rounded-md text-ivory/60 hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onPatch({ items: [...block.items, ''] })}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-gold hover:text-ivory"
          >
            <Plus className="h-3 w-3" /> Add item
          </button>
        </div>
      );
    case 'image':
      return <ImageBlockEditor block={block} onPatch={onPatch} />;
  }
}

function ImageBlockEditor({
  block, onPatch,
}: {
  block: Extract<BlogBlock, { type: 'image' }>;
  onPatch: (p: Partial<BlogBlock>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);

  async function upload(file: File | undefined) {
    if (!file || uploading.current) return;
    uploading.current = true;
    try {
      const res = await api.upload<{ status: 'success'; data: { url: string }[] }>('/uploads', [file]);
      onPatch({ src: res.data[0].url });
    } catch (e) {
      // swallow — UI shows the existing src
    } finally {
      uploading.current = false;
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      {block.src ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink-900">
          <Image src={block.src} alt={block.caption || ''} fill sizes="600px" className="object-cover" unoptimized />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-8 text-sm text-ivory/70 hover:border-gold/40 hover:text-gold"
        >
          {uploading.current ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          Upload image
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => upload(e.target.files?.[0])}
        className="hidden"
      />
      <input
        value={block.caption || ''}
        onChange={(e) => onPatch({ caption: e.target.value })}
        placeholder="Caption (optional)"
        className={inputCls}
      />
    </div>
  );
}

function AddButton({
  onClick, Icon, label,
}: { onClick: () => void; Icon: typeof Pilcrow; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-ink-900/40 px-3 py-2 text-xs uppercase tracking-[0.18em] text-ivory/80 transition-colors hover:border-gold hover:text-gold"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function IconBtn({
  onClick, disabled, danger, title, children,
}: {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded-md transition-colors disabled:opacity-30 ${
        danger ? 'text-ivory/65 hover:bg-rose-500/15 hover:text-rose-300' : 'text-ivory/65 hover:bg-white/[0.04] hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}
