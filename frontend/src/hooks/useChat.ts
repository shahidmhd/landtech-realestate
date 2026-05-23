'use client';

import { useCallback, useRef, useState } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type Status = 'idle' | 'streaming' | 'error';

interface SendOptions {
  locale: 'en' | 'ar';
}

/**
 * Talks to the backend /chat endpoint over SSE. Maintains the conversation
 * locally and exposes a streaming-friendly API.
 *
 * Wire format from the backend (matches chat.controller.ts):
 *   event: delta    data: { text: string }
 *   event: done     data: { stopReason, usage }
 *   event: error    data: { message }
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (text: string, { locale }: SendOptions) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError(null);
    setStatus('streaming');

    // Snapshot the conversation including the new user turn; this is the
    // payload to the backend AND the new state on the client.
    const conversation: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: '' }, // placeholder we'll stream into
    ];
    setMessages(conversation);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/chat`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        // Send everything EXCEPT the empty placeholder
        body: JSON.stringify({
          messages: conversation.slice(0, -1),
          locale,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let msg = 'Request failed';
        if (res.status === 429) msg = 'rate_limit';
        else if (res.status === 503) msg = 'unavailable';
        else {
          try {
            const data = await res.json();
            msg = (data as { message?: string }).message || msg;
          } catch {}
        }
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by blank lines (\n\n).
        let eventEnd: number;
        while ((eventEnd = buffer.indexOf('\n\n')) !== -1) {
          const rawEvent = buffer.slice(0, eventEnd);
          buffer = buffer.slice(eventEnd + 2);
          const { event, data } = parseSseEvent(rawEvent);
          if (!event) continue;

          if (event === 'delta') {
            const delta = (data as { text?: string }).text || '';
            // Append delta to the last assistant message immutably.
            setMessages((prev) => {
              const next = prev.slice();
              const last = next[next.length - 1];
              if (last && last.role === 'assistant') {
                next[next.length - 1] = { ...last, content: last.content + delta };
              }
              return next;
            });
          } else if (event === 'error') {
            const message = (data as { message?: string }).message || 'Something went wrong';
            throw new Error(message);
          } else if (event === 'done') {
            // nothing to do for the UI
          }
        }
      }

      setStatus('idle');
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setStatus('idle');
        return;
      }
      // Drop the empty assistant placeholder if we never got any text
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '') return prev.slice(0, -1);
        return prev;
      });
      const code = err instanceof Error ? err.message : 'unknown';
      setError(code === 'rate_limit' ? 'rate_limit' : 'generic');
      setStatus('error');
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, [messages]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStatus('idle');
  }, []);

  return { messages, status, error, send, cancel, reset };
}

function parseSseEvent(raw: string): { event: string | null; data: unknown } {
  let event: string | null = null;
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  if (!dataLines.length) return { event, data: null };
  try {
    return { event, data: JSON.parse(dataLines.join('\n')) };
  } catch {
    return { event, data: null };
  }
}
