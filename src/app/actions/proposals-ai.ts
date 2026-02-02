'use server';

import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export type ProposalMinuta = { escopo: string; termos: string };

export async function generateProposalWithAI(
  clientId: string,
  serviceId: string
): Promise<{ success: true; minuta: ProposalMinuta } | { success: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const { data: client } = await supabase.from('clients').select('name').eq('id', clientId).single();
  const { data: service } = await supabase
    .from('services_catalog')
    .select('name, marketing_title, marketing_body, playbook_id')
    .eq('id', serviceId)
    .single();

  if (!client || !service) return { success: false, error: 'Cliente ou serviço não encontrado.' };

  let playbookContent = '';
  if (service.playbook_id) {
    const { data: playbook } = await supabase
      .from('playbooks')
      .select('content_markdown, title')
      .eq('id', service.playbook_id)
      .single();
    if (playbook?.content_markdown) {
      playbookContent = `\n\nPLAYBOOK "${playbook.title}":\n${playbook.content_markdown}`;
    }
  }

  const serviceContext = [
    service.marketing_title || service.name,
    service.marketing_body || '',
  ].filter(Boolean).join('\n');

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `Você é o agente de propostas do ness.OS. Gere uma minuta de proposta técnica e comercial em português, baseada nos dados fornecidos.
Retorne APENAS um JSON válido com duas chaves:
- "escopo": string com o escopo técnico do serviço (o que será entregue, metodologia, entregáveis).
- "termos": string com termos comerciais gerais (vigência, SLA, responsabilidades, confidencialidade).
Use o playbook e o marketing do serviço como base. Seja conciso e profissional.`,
    prompt: `Cliente: ${client.name}
Serviço: ${service.name}

Marketing do serviço:
${serviceContext}
${playbookContent}

Gere o JSON com escopo e termos.`,
  });

  try {
    const json = JSON.parse(text.trim()) as ProposalMinuta;
    if (typeof json.escopo !== 'string' || typeof json.termos !== 'string') {
      return { success: false, error: 'Resposta da IA em formato inválido.' };
    }
    return { success: true, minuta: { escopo: json.escopo, termos: json.termos } };
  } catch {
    return { success: false, error: 'Não foi possível interpretar a resposta da IA.' };
  }
}
