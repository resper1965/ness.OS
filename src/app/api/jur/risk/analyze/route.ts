import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const riskSchema = z.object({
  clauses: z.array(z.object({
    type: z.string(),
    excerpt: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    suggestion: z.string(),
  })),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Não autenticado', { status: 401 });

  const { text } = (await req.json()) as { text: string };
  if (!text?.trim()) return new Response('Texto obrigatório', { status: 400 });

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: riskSchema,
    prompt: `Analise esta minuta e identifique cláusulas de risco (SLA desproporcional, responsabilidade ilimitada, multas abusivas). Retorne array vazio se não houver. Texto: ${text.slice(0, 12000)}`,
  });

  return Response.json(object);
}
