import { GoogleGenAI, ApiError } from '@google/genai';
import { z } from 'zod';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';
import { getCachedSystemPrompt } from '@/utils/property-context';

const messageSchema = z.object({
  // Frontend uses Anthropic-style 'assistant'; we translate to Gemini's 'model' below.
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  body: z.object({
    messages: z.array(messageSchema).min(1).max(40),
    locale: z.enum(['en', 'ar']).default('en'),
  }),
});

// One client per process.
let gemini: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!env.GEMINI_API_KEY) {
    throw new AppError(
      'Chat is not configured. Set GEMINI_API_KEY on the backend.',
      503
    );
  }
  if (!gemini) {
    gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return gemini;
}

export const chat = catchAsync(async (req, res) => {
  const client = getClient();
  const { messages, locale } = req.body as z.infer<typeof chatRequestSchema>['body'];

  // SSE setup — disable proxy buffering so chunks reach the browser as
  // they stream.
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Abort the Gemini call if the client closes the connection.
  const controller = new AbortController();
  req.on('close', () => controller.abort());

  try {
    const systemPrompt = await getCachedSystemPrompt();
    const localeNote = locale === 'ar'
      ? 'The visitor is reading the site in Arabic. Respond in Arabic.'
      : 'The visitor is reading the site in English. Respond in English.';

    // Gemini uses 'user' and 'model' (not 'assistant'). Translate at the boundary.
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

    const stream = await client.models.generateContentStream({
      model: env.GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: `${systemPrompt}\n\n${localeNote}`,
        maxOutputTokens: 1024,
        temperature: 0.7,
        abortSignal: controller.signal,
      },
    });

    let usage:
      | { input: number; output: number; total: number }
      | null = null;

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        send('delta', { text });
      }
      // The final chunk carries cumulative usage metadata.
      if (chunk.usageMetadata) {
        usage = {
          input: chunk.usageMetadata.promptTokenCount ?? 0,
          output: chunk.usageMetadata.candidatesTokenCount ?? 0,
          total: chunk.usageMetadata.totalTokenCount ?? 0,
        };
      }
    }

    send('done', { usage });
    res.end();
  } catch (err) {
    // 429 from Gemini = rate limit / quota; everything else is a generic
    // unavailability for the visitor-facing error message.
    const isRateLimit = err instanceof ApiError && err.status === 429;
    const isAbort = err instanceof Error && err.name === 'AbortError';

    if (isAbort) {
      // Client disconnected — nothing to send.
      res.end();
      return;
    }

    const message = isRateLimit
      ? 'Too many requests — please wait a moment and try again.'
      : 'The assistant is temporarily unavailable.';

    logger.error({ err }, 'Chat stream failed');
    try { send('error', { message }); } catch {}
    res.end();
  }
});
