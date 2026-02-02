import { findRelevantPublicContent } from '@/lib/ai/embedding';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export const maxDuration = 30;

// Rate limit simples: máximo de requisições por IP (em memória - reinicia a cada cold start)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return new Response('Muitas requisições. Tente novamente em breve.', { status: 429 });
  }

  const { messages: uiMessages } = (await req.json()) as { messages: UIMessage[] };
  const modelMessages = await convertToModelMessages(uiMessages);
  const lastMsg = modelMessages[modelMessages.length - 1];
  const userQuestion = lastMsg?.role === 'user' && typeof lastMsg.content === 'string'
    ? lastMsg.content
    : Array.isArray(lastMsg?.content)
      ? (lastMsg.content.find((p) => p.type === 'text') as { text?: string } | undefined)?.text ?? ''
      : '';

  const relevantChunks = await findRelevantPublicContent(userQuestion, 4);
  const context = relevantChunks.length > 0
    ? relevantChunks.map((c) => c.content_chunk).join('\n\n---\n\n')
    : 'Nenhum conteúdo relevante encontrado.';

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Você é o assistente virtual do ness. — ecossistema de gestão e site institucional. Responda com base APENAS no contexto fornecido.

CONTEXTO (catálogo de serviços e blog):
${context}

INSTRUÇÕES:
- Responda em português, de forma amigável e profissional.
- Use SOMENTE as informações do contexto acima.
- Se não encontrar a resposta, diga que não tem essa informação e convide a entrar em contato.
- Ao final, sugira: "Quer falar com a gente? Acesse /contato ou preencha o formulário."
- Não invente informações sobre a empresa.`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
