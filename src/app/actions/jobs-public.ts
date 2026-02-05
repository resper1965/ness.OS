'use server';

import { getServerClient } from '@/lib/supabase/queries/base';

export async function getOpenJobs() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('public_jobs')
    .select('id, slug, title, department')
    .eq('is_open', true)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getJobBySlug(slug: string) {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('public_jobs')
    .select('id, slug, title, description_html, department')
    .eq('slug', slug)
    .eq('is_open', true)
    .single();
  return data;
}
