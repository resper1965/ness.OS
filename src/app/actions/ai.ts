'use server';

import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { revalidatePath } from 'next/cache';

export type ProposalMinuta = { escopo: string; termos: string };

/** Formato retornado pelo Gerar com IA para catálogo de serviços */
export type ServiceCatalogAIPayload = {
  slug: string;
  titulo_site: string;
  pitch: string;
  corpo_site: string;
};

/** Agente de Catálogo: Gera slug, título, pitch e corpo (Markdown) para serviço */
export async function generateServiceCatalogWithAI(
  name: string,
  playbookTitles: string[]
): Promise<{ success: true; data: ServiceCatalogAIPayload } | { success: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado.' };

  const nameTrimmed = name?.trim();
  if (!nameTrimmed) return { success: false, error: 'Informe o nome do serviço.' };

  const playbooksContext = playbookTitles.length > 0
    ? `Playbooks vinculados: ${playbookTitles.join(', ')}. Redija o corpo_site conectando as atividades desses playbooks.`
    : '';

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `Você é um especialista em DevSecOps da empresa ness. Gere um JSON com slug, titulo_site, pitch e corpo_site (Markdown) baseado no Nome do serviço e nos Playbooks selecionados.
Retorne APENAS um JSON válido com as chaves: slug, titulo_site, pitch, corpo_site.
- slug: minúsculo, hífens, sem acentos (ex: n-secops)
- titulo_site: título para a página do serviço no site
- pitch: 1-2 frases para cards de soluções
- corpo_site: conteúdo em Markdown para a página do serviço, com seções ##, conectando as atividades dos playbooks quando houver`,
    prompt: `Nome do serviço: ${nameTrimmed}
${playbooksContext}

Gere o JSON.`,
  });

  try {
    const json = JSON.parse(text.trim()) as ServiceCatalogAIPayload;
    if (typeof json.slug !== 'string' || typeof json.titulo_site !== 'string' || typeof json.pitch !== 'string' || typeof json.corpo_site !== 'string') {
      return { success: false, error: 'Resposta da IA em formato inválido.' };
    }
    return { success: true, data: json };
  } catch {
    return { success: false, error: 'Não foi possível interpretar a resposta da IA.' };
  }
}

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
    .select('name, marketing_title, marketing_body, services_playbooks(playbook_id)')
    .eq('id', serviceId)
    .single();

  if (!client || !service) return { success: false, error: 'Cliente ou serviço não encontrado.' };

  let playbookContent = '';
  const playbookIds = Array.isArray(service?.services_playbooks)
    ? (service.services_playbooks as { playbook_id: string }[]).map((sp) => sp.playbook_id)
    : [];
  if (playbookIds.length > 0) {
    const { data: playbooks } = await supabase
      .from('playbooks')
      .select('content_markdown, title')
      .in('id', playbookIds)
      .order('title');
    if (playbooks?.length) {
      playbookContent = playbooks
        .map((p) => (p?.content_markdown ? `\n\nPLAYBOOK "${p.title}":\n${p.content_markdown}` : ''))
        .filter(Boolean)
        .join('\n');
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
