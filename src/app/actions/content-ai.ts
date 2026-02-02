'use server';

import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { revalidatePath } from 'next/cache';

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
