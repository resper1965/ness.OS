import { findRelevantPlaybookContent } from '@/lib/ai/embedding';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Não autenticado', { status: 401 });
  }

  const { messages: uiMessages } = (await req.json()) as { messages: UIMessage[] };
  const modelMessages = await convertToModelMessages(uiMessages);
  const lastMsg = modelMessages[modelMessages.length - 1];
  const userQuestion = lastMsg?.role === 'user' && typeof lastMsg.content === 'string'
    ? lastMsg.content
    : Array.isArray(lastMsg?.content)
      ? (lastMsg.content.find((p) => p.type === 'text') as { text?: string } | undefined)?.text ?? ''
      : '';

  const relevantChunks = await findRelevantPlaybookContent(userQuestion, 4);
  const context = relevantChunks.length > 0
    ? relevantChunks.map((c) => c.content_chunk).join('\n\n---\n\n')
    : 'Nenhum trecho relevante encontrado nos playbooks.';

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Você é o assistente interno de conhecimento técnico do ness.OS. Sua função é responder APENAS com base nos Playbooks cadastrados.

CONTEXTO DOS PLAYBOOKS:
${context}

INSTRUÇÕES:
- Responda em português.
- Use SOMENTE as informações do contexto acima.
- Se o contexto não contiver a resposta, diga: "Não encontrei essa informação nos playbooks. Verifique se há um playbook relacionado ou consulte a equipe de OPS."
- Não invente procedimentos ou informações que não estejam no contexto.`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
