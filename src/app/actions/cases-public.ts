'use server';

import { createClient } from '@/lib/supabase/server';

export async function getPublishedCases() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('success_cases')
    .select('id, title, slug, summary, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getCaseBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('success_cases')
    .select('id, title, slug, summary, content_html, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return null;
  return data;
}
