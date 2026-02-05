import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { riskSchema } from '@/lib/validators/schemas';
import { getServerClient } from '@/lib/supabase/queries/base';

export async function POST(req: Request) {
  const supabase = await getServerClient();
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
