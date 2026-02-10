'use server';

import { getServerClient, withSupabase } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { leadSchema, postSchema } from '@/lib/validators/schemas';
import { emitModuleEvent } from '@/lib/events/emit';
import { processModuleEvent } from '@/lib/events/process';
import { getOmieFaturamentoForPeriod } from '@/app/actions/data';
import { callGemini } from '@/lib/ai/gemini';

const VALID_STATUSES = ['new', 'qualified', 'proposal', 'won', 'lost'] as const;

// === DASHBOARD COMERCIAL (C-level) — índices baseados em Omie + growth ===

export type GrowthPipelineStage = {
  id: string;
  name: string;
  count: number;
  value: number;
  color: string;
};

export type LeadBySourceItem = { source: string; count: number };

export type GrowthDashboardData = {
  totalCustomers: number;
  totalCustomersOmie: number;
  totalDeals: number;
  totalRevenue: number;
  omieRevenueMonth: number | null;
  leadsTotal: number;
  leadsByStatus: Record<string, number>;
  leadsBySource: LeadBySourceItem[];
  pipelineStages: GrowthPipelineStage[];
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    origin_url: string | null;
    created_at: string;
  }>;
};

/** Normaliza origin_url para rótulo de origem (site, contato, solução, etc.). */
function normalizeLeadSource(origin_url: string | null): string {
  if (!origin_url || !origin_url.trim()) return 'Site';
  const u = origin_url.toLowerCase();
  if (u.includes('contato') || u.includes('contact')) return 'Contato';
  if (u.includes('solucoes') || u.includes('solucao') || u.includes('/s')) return 'Soluções';
  if (u.includes('blog') || u.includes('/blog')) return 'Blog';
  if (u.includes('casos')) return 'Casos';
  return 'Outros';
}

/**
 * Dados do dashboard comercial/marketing (ness.GROWTH).
 * Usa: clients (base Omie), contracts (MRR/deals), inbound_leads (funil e origem), faturamento Omie do mês.
 */
export async function getGrowthDashboardData(): Promise<GrowthDashboardData> {
  const supabase = await getServerClient();

  const [clientsRes, contractsRes, leadsRes] = await Promise.all([
    supabase.from('clients').select('id, omie_codigo'),
    supabase.from('contracts').select('id, client_id, mrr'),
    supabase
      .from('inbound_leads')
      .select('id, name, email, company, status, origin_url, created_at')
      .order('created_at', { ascending: false }),
  ]);

  const clients = clientsRes.data ?? [];
  const contracts = contractsRes.data ?? [];
  const leads = leadsRes.data ?? [];

  const totalCustomers = clients.length;
  const totalCustomersOmie = clients.filter((c) => c.omie_codigo).length;
  const totalDeals = contracts.length;
  const totalRevenue = contracts.reduce((s, c) => s + Number(c.mrr ?? 0), 0);

  const byStatus: Record<string, number> = {
    new: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  };
  const bySource: Record<string, number> = {};
  for (const l of leads) {
    const st = (l.status ?? 'new') in byStatus ? (l.status ?? 'new') : 'new';
    byStatus[st]++;
    const src = normalizeLeadSource(l.origin_url ?? null);
    bySource[src] = (bySource[src] ?? 0) + 1;
  }
  const leadsBySource: LeadBySourceItem[] = Object.entries(bySource).map(([source, count]) => ({
    source,
    count,
  }));

  const pipelineColors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-slate-500',
  ] as const;
  const stageLabels: Record<string, string> = {
    new: 'Novo',
    qualified: 'Qualificado',
    proposal: 'Proposta',
    won: 'Ganho',
    lost: 'Perdido',
  };
  const pipelineStages: GrowthPipelineStage[] = (['new', 'qualified', 'proposal', 'won', 'lost'] as const).map(
    (id, i) => ({
      id,
      name: stageLabels[id],
      count: byStatus[id],
      value: id === 'won' ? totalRevenue : 0,
      color: pipelineColors[i] ?? 'bg-slate-500',
    })
  );

  let omieRevenueMonth: number | null = null;
  try {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const fat = await getOmieFaturamentoForPeriod({ dataInicio: fmt(first), dataFim: fmt(last) });
    omieRevenueMonth = Object.values(fat).reduce((a, v) => a + v, 0);
  } catch {
    // Omie opcional
  }

  const recentLeads = leads.slice(0, 10).map((l) => ({
    id: l.id,
    name: l.name ?? '',
    email: l.email ?? '',
    company: l.company ?? null,
    status: l.status ?? 'new',
    origin_url: l.origin_url ?? null,
    created_at: l.created_at ?? '',
  }));

  return {
    totalCustomers,
    totalCustomersOmie,
    totalDeals,
    totalRevenue,
    omieRevenueMonth,
    leadsTotal: leads.length,
    leadsByStatus: byStatus,
    leadsBySource,
    pipelineStages,
    recentLeads,
  };
}

export type LeadFormState = { success?: boolean; error?: string };
export type PostFormState = { success?: boolean; error?: string };

// === LEADS ===

/** Submit lead (formulário público de contato) */
export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') || undefined,
    message: formData.get('message') || undefined,
    origin_url: formData.get('origin_url') || undefined,
  });

  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const msg = Object.values(firstError).flat().join(', ') || 'Dados inválidos';
    return { error: msg };
  }

  const supabase = await getServerClient();
  const { data: inserted, error } = await supabase
    .from('inbound_leads')
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? null,
      message: parsed.data.message ?? null,
      origin_url: parsed.data.origin_url ?? null,
      status: 'new',
    })
    .select('id')
    .single();

  if (error) return { error: 'Erro ao enviar. Tente novamente.' };

  const payload = {
    entity_id: inserted?.id ?? null,
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company ?? null,
  };
  await emitModuleEvent('growth', 'lead.created', inserted?.id ?? null, payload);
  await processModuleEvent('growth', 'lead.created', payload);

  return { success: true };
}

/** Update lead status (Kanban admin) */
export async function updateLeadStatus(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { error: 'Status inválido.' };
  }

  const supabase = await getServerClient();
  const { error } = await supabase
    .from('inbound_leads')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/app/growth/leads');
  return { success: true };
}

// === POSTS ===

export async function getPosts(limit = 10) {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('public_posts')
      .select('id, slug, title, seo_description, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (e) throw new Error(e.message);
    return d ?? [];
  });
  return error ? [] : data ?? [];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('public_posts')
      .select('id, slug, title, content_markdown, seo_description, published_at, author_id')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (e || !d) return null;
    return d;
  });
  return error ? null : data ?? null;
}

export async function createPost(
  _prevState: unknown,
  formData: FormData
): Promise<PostFormState> {
  const parsed = postSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    seo_description: formData.get('seo_description') || undefined,
    content_markdown: formData.get('content_markdown') || undefined,
    is_published: formData.get('is_published') === 'on',
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };

  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { error } = await supabase.from('public_posts').insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    seo_description: parsed.data.seo_description ?? null,
    content_markdown: parsed.data.content_markdown ?? null,
    is_published: parsed.data.is_published ?? false,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
    author_id: user.id,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/growth/posts');
  revalidatePath('/blog');
  return { success: true };
}

/** Wrapper para useFormState: lê id do formData e chama updatePost. */
export async function updatePostFromForm(
  _prevState: unknown,
  formData: FormData
): Promise<PostFormState> {
  const id = formData.get('_id') as string;
  if (!id) return { error: 'ID do post não encontrado.' };
  return updatePost(id, _prevState, formData);
}

export async function updatePost(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<PostFormState> {
  const parsed = postSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    seo_description: formData.get('seo_description') || undefined,
    content_markdown: formData.get('content_markdown') || undefined,
    is_published: formData.get('is_published') === 'on',
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };

  const supabase = await getServerClient();
  const payload: Record<string, unknown> = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    seo_description: parsed.data.seo_description ?? null,
    content_markdown: parsed.data.content_markdown ?? null,
    is_published: parsed.data.is_published ?? false,
  };
  if (parsed.data.is_published) payload.published_at = new Date().toISOString();

  const { error } = await supabase.from('public_posts').update(payload).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/growth/posts');
  revalidatePath(`/app/growth/posts/${id}`);
  revalidatePath('/blog');
  return { success: true };
}

// === SERVICES ===

/** Serviços ativos para home e listagens (id, name, slug, marketing_pitch) */
export async function getActiveServices() {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('services_catalog')
      .select('id, name, slug, marketing_pitch, delivery_type')
      .eq('is_active', true)
      .order('name');
    if (e) throw new Error(e.message);
    return d ?? [];
  });
  return error ? [] : data ?? [];
}

export async function getServiceBySlug(slug: string) {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('services_catalog')
      .select('id, name, slug, marketing_title, marketing_body, marketing_pitch, marketing_features, cover_image_url, content_json')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (e || !d) return null;
    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      marketing_title: d.marketing_title ?? null,
      marketing_body: d.marketing_body ?? null,
      marketing_pitch: d.marketing_pitch,
      marketing_features: d.marketing_features,
      cover_image_url: d.cover_image_url,
      content_json: d.content_json ?? null,
    };
  });
  return error ? null : data ?? null;
}

export async function createService(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const serviceActionIds = (formData.getAll('service_action_ids') as string[]).filter(Boolean);
  const pitch = (formData.get('marketing_pitch') as string) || null;
  const marketingTitle = (formData.get('marketing_title') as string)?.trim() || null;
  const marketingBody = (formData.get('marketing_body') as string)?.trim() || null;
  if (!name || !slug) return { error: 'Nome e slug obrigatórios.' };
  if (serviceActionIds.length === 0) return { error: 'Adicione pelo menos uma Service Action (Job).' };

  const supabase = await getServerClient();
  const { data: service, error: insertErr } = await supabase.from('services_catalog').insert({
    name, slug, marketing_pitch: pitch,
    marketing_title: marketingTitle, marketing_body: marketingBody, is_active: false,
  }).select('id').single();
  if (insertErr || !service) return { error: insertErr?.message ?? 'Erro ao criar serviço.' };

  const rows = serviceActionIds.map((said, i) => ({ service_id: service.id, service_action_id: said, sort_order: i }));
  const { error: saErr } = await supabase.from('services_service_actions').insert(rows);
  if (saErr) return { error: saErr.message };
  revalidatePath('/app/growth/services');
  revalidatePath('/solucoes');
  return { success: true };
}

/** Wrapper para useFormState: lê id do formData e chama updateService. */
export async function updateServiceFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const id = formData.get('_id') as string;
  if (!id) return { error: 'ID do serviço não encontrado.' };
  return updateService(id, _prev, formData);
}

export async function updateService(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const serviceActionIds = (formData.getAll('service_action_ids') as string[]).filter(Boolean);
  const deliveryTypeRaw = (formData.get('delivery_type') as string) || 'service';
  const deliveryType = ['service', 'product', 'vertical'].includes(deliveryTypeRaw) ? deliveryTypeRaw : 'service';
  const pitch = (formData.get('marketing_pitch') as string) || null;
  const marketingTitle = (formData.get('marketing_title') as string)?.trim() || null;
  const marketingBody = (formData.get('marketing_body') as string)?.trim() || null;
  const isActive = formData.get('is_active') === 'on';
  if (!name || !slug) return { error: 'Nome e slug obrigatórios.' };
  if (serviceActionIds.length === 0) return { error: 'Adicione pelo menos uma Service Action (Job).' };

  const supabase = await getServerClient();
  const { error } = await supabase.from('services_catalog').update({
    name, slug, delivery_type: deliveryType,
    marketing_pitch: pitch,
    marketing_title: marketingTitle, marketing_body: marketingBody, is_active: isActive,
  }).eq('id', id);
  if (error) return { error: error.message };

  await supabase.from('services_service_actions').delete().eq('service_id', id);
  const rows = serviceActionIds.map((said, i) => ({ service_id: id, service_action_id: said, sort_order: i }));
  const { error: saErr } = await supabase.from('services_service_actions').insert(rows);
  if (saErr) return { error: saErr.message };
  revalidatePath('/app/growth/services');
  revalidatePath('/solucoes');
  return { success: true };
}

// === SUCCESS CASES ===

export async function createSuccessCase(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const rawData = (formData.get('raw_data') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const isPublished = formData.get('is_published') === 'on';
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const supabase = await getServerClient();
  const { data: inserted, error } = await supabase
    .from('success_cases')
    .insert({
      title, slug, raw_data: rawData, summary, is_published: isPublished,
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  const caseId = inserted?.id ?? null;
  await emitModuleEvent('growth', 'case.created', caseId, { title, slug });
  await processModuleEvent('growth', 'case.created', { title, slug });
  revalidatePath('/app/growth/casos');
  revalidatePath('/casos');
  return { success: true };
}

/** Wrapper para useFormState: lê id do formData e chama updateSuccessCase. */
export async function updateSuccessCaseFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const id = formData.get('_id') as string;
  if (!id) return { error: 'ID do caso não encontrado.' };
  return updateSuccessCase(id, _prev, formData);
}

export async function updateSuccessCase(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const rawData = (formData.get('raw_data') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const contentHtml = (formData.get('content_html') as string)?.trim() || null;
  const isPublished = formData.get('is_published') === 'on';
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const supabase = await getServerClient();
  const { error } = await supabase
    .from('success_cases')
    .update({ title, slug, raw_data: rawData, summary, content_html: contentHtml, is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };
  await emitModuleEvent('growth', 'case.updated', id, { title, slug });
  await processModuleEvent('growth', 'case.updated', { title, slug });
  revalidatePath('/app/growth/casos');
  revalidatePath(`/app/growth/casos/${id}`);
  revalidatePath('/casos');
  return { success: true };
}

// === BRAND ASSETS (ness.GROWTH — Brand Guardian) ===

export async function createBrandAssetFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  if (!name) return { error: 'Nome obrigatório.' };

  const supabase = await getServerClient();
  const { error } = await supabase.from('brand_assets').insert({
    name,
    asset_type: (formData.get('asset_type') as string)?.trim() || null,
    url: (formData.get('url') as string)?.trim() || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/app/growth/brand');
  return { success: true };
}

/**
 * Gera uma proposta técnica detalhada usando IA (Gemini).
 * Baseia-se no Catálogo de Serviços -> Service Actions -> Playbooks -> Tasks.
 */
export async function generateProposalWithAI(serviceId: string): Promise<{ text?: string; error?: string }> {
  const supabase = await getServerClient();

  // 1. Buscar a estrutura completa do serviço
  const { data: service, error: fetchErr } = await supabase
    .from('services_catalog')
    .select(`
      id,
      name,
      marketing_pitch,
      base_price,
      services_service_actions (
        sort_order,
        service_actions (
          title,
          description,
          complexity_factor,
          service_action_playbooks (
            sort_order,
            playbooks (
              title,
              content_markdown,
              tasks (
                title,
                description,
                estimated_duration_minutes
              )
            )
          )
        )
      )
    `)
    .eq('id', serviceId)
    .single();

  if (fetchErr || !service) return { error: fetchErr?.message ?? 'Serviço não encontrado.' };

  // 2. Construir o contexto para a IA
  const serviceActions = (service as any).services_service_actions ?? [];
  let context = `Serviço: ${service.name}\nPitch: ${service.marketing_pitch}\nPreço Base: R$ ${service.base_price}\n\nEscopo Operacional:\n`;

  serviceActions.forEach((ssa: any) => {
    const sa = ssa.service_actions;
    context += `- Job: ${sa.title}\n  Descrição: ${sa.description}\n`;
    
    sa.service_action_playbooks?.forEach((sap: any) => {
      const pb = sap.playbooks;
      context += `  * Playbook: ${pb.title}\n`;
      pb.tasks?.forEach((tk: any) => {
        context += `    - Task: ${tk.title} (${tk.estimated_duration_minutes} min): ${tk.description}\n`;
      });
    });
  });

  const prompt = `
    Você é um Engenheiro de Vendas da nessOS, uma empresa de Cybersecurity de elite.
    Gere uma PROPOSTA TÉCNICA profissional em Markdown para o serviço abaixo.
    Use um tom executivo, confiante e focado em valor vs custo.

    CONTEXTO DO SERVIÇO:
    ${context}

    ESTRUTURA DA PROPOSTA:
    1. # Proposta Técnica: [Nome do Serviço]
    2. ## Resumo Executivo (Foque no pitch e valor de negócio)
    3. ## Escopo de Atendimento (Detalhe o que será feito com base nos Jobs e Playbooks)
    4. ## Diferenciais Técnicos (Foque na padronização via nessOS Ops)
    5. ## Investimento (Use o preço base R$ ${service.base_price})
    6. ## Conclusão

    IMPORTANTE: Retorne APENAS o Markdown da proposta. Não inclua comentários.
  `;

  // 3. Chamar a IA
  const result = await callGemini(prompt, {
    systemInstruction: 'Você é um consultor de vendas especializado em Cybersecurity e MSSP.',
  });

  if (result.error) return { error: result.error };
  return { text: result.text ?? 'Não foi possível gerar a proposta.' };
}
