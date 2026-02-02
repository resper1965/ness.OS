'use server';

import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { revalidatePath } from 'next/cache';

export type ProposalMinuta = { escopo: string; termos: string };

/** Agente de Conteúdo: Transforma case em post de blog */
export async function generatePostFromCase(
  caseId: string
): Promise<{ success: true; postId: string } | { success: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const { data: caseData, error } = await supabase
    .from('success_cases')
    .select('title, raw_data, summary')
    .eq('id', caseId)
    .single();

  if (error || !caseData) return { success: false, error: 'Caso não encontrado.' };

  const raw = caseData.raw_data || caseData.summary || caseData.title || '';
  if (!raw.trim()) return { success: false, error: 'O caso não tem dados brutos para transformar.' };

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `Você é o agente de conteúdo do ness.OS. Transforme dados técnicos de projetos em um post de blog amigável.
Retorne o conteúdo em Markdown, pronto para publicar. Use linguagem acessível, sem jargões excessivos.
Inclua: introdução, seções com ##, e uma conclusão. Não inclua o título no markdown (será o título do post).`,
    prompt: `Transforme este caso de sucesso em um post de blog:

Título: ${caseData.title}

Dados técnicos:
${raw}

Gere o corpo do post em Markdown (sem o título).`,
  });

  const slug = caseData.title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60);

  const { data: post, error: insertErr } = await supabase
    .from('public_posts')
    .insert({
      title: caseData.title,
      slug: slug || `case-${caseId.slice(0, 8)}`,
      content_markdown: text.trim(),
      is_published: false,
      author_id: user.id,
    })
    .select('id')
    .single();

  if (insertErr || !post) return { success: false, error: insertErr?.message ?? 'Erro ao criar post.' };

  revalidatePath('/app/growth/posts');
  revalidatePath('/app/growth/casos');
  return { success: true, postId: post.id };
}

/** Agente de Propostas: Gera minuta técnica e comercial */
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
