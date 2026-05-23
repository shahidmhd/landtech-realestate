'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { X, Send, Loader2, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import { useChat, type ChatMessage } from '@/hooks/useChat';
import ChatMessageBody from './ChatMessageBody';

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale() as 'en' | 'ar';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, status, error, send, reset } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new content streams in.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, status]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || status === 'streaming') return;
    const text = input;
    setInput('');
    send(text, { locale });
  }

  function pickSuggestion(text: string) {
    if (status === 'streaming') return;
    setInput('');
    send(text, { locale });
  }

  // RTL note: positions are right-anchored in LTR, left-anchored in RTL, so
  // the chat never collides with the WhatsApp/Call floating buttons (which
  // mirror the same way).
  const side = locale === 'ar' ? 'left' : 'right';

  return (
    <>
      {/* Floating launcher button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={t('button_open')}
        className="fixed bottom-44 z-40 inline-grid h-14 w-14 place-items-center rounded-full bg-ink-800 text-gold shadow-luxe ring-1 ring-gold/40 backdrop-blur-md"
        style={{ [side]: '1rem' } as React.CSSProperties}
      >
        <Sparkles className="h-5 w-5" />
        <span className="absolute -top-1 -end-1 grid h-4 w-4 place-items-center rounded-full bg-gold-gradient text-[8px] font-bold text-ink-900">
          AI
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed bottom-6 z-50 flex h-[min(640px,calc(100vh-3rem))] w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/95 shadow-luxe backdrop-blur-2xl"
            style={{ [side]: '1rem' } as React.CSSProperties}
            role="dialog"
            aria-label={t('header_title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-ink-900 shadow-gold">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-base text-ivory">{t('header_title')}</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-ivory/45">
                    {t('header_subtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="grid h-8 w-8 place-items-center rounded-md text-ivory/55 transition-colors hover:bg-white/[0.04] hover:text-gold"
                    aria-label="New conversation"
                    title="New conversation"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-md text-ivory/65 hover:bg-white/[0.04] hover:text-ivory"
                  aria-label={t('button_close')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
              {messages.length === 0 ? (
                <Greeting onPick={pickSuggestion} />
              ) : (
                <div className="space-y-5">
                  {messages.map((m, i) => (
                    <MessageBubble
                      key={i}
                      message={m}
                      isStreaming={status === 'streaming' && i === messages.length - 1 && m.role === 'assistant'}
                    />
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error === 'rate_limit' ? t('error_rate_limit') : t('error_generic')}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={submit} className="border-t border-white/[0.06] p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-ink-800/60 px-3 py-2 focus-within:border-gold/40">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={t('input_placeholder')}
                  rows={1}
                  className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent py-1 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || status === 'streaming'}
                  aria-label={t('input_send')}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-gradient text-ink-900 shadow-gold transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  {status === 'streaming' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[10px] uppercase tracking-[0.18em] text-ivory/35">
                {t('footer_disclaimer')}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Greeting({ onPick }: { onPick: (text: string) => void }) {
  const t = useTranslations('chat');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-sm leading-relaxed text-ivory/80">{t('greeting')}</p>
      <div className="mt-5 space-y-2">
        {[t('suggestion_1'), t('suggestion_2'), t('suggestion_3')].map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(s)}
            className="block w-full rounded-lg border border-white/[0.06] bg-ink-800/40 px-3 py-2 text-start text-xs text-ivory/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({
  message, isStreaming,
}: {
  message: ChatMessage;
  isStreaming: boolean;
}) {
  const t = useTranslations('chat');

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gold-gradient px-4 py-2.5 text-sm text-ink-900 shadow-gold rtl:rounded-tl-sm rtl:rounded-tr-2xl">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant — streaming caret if mid-response, no content yet means "thinking"
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%]">
        {message.content ? (
          <ChatMessageBody text={message.content} />
        ) : (
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-ivory/50">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t('thinking')}
          </p>
        )}
        {isStreaming && message.content && (
          <span className="ms-0.5 inline-block h-3 w-1.5 animate-pulse bg-gold align-middle" />
        )}
      </div>
    </div>
  );
}

