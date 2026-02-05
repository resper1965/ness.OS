'use server';

import { withSupabase } from '@/lib/supabase/queries/base';

export async function getStaticPageBySlug(slug: string) {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('static_pages')
      .select('id, slug, title, seo_description, content_json, last_updated')
      .eq('slug', slug)
      .single();
    if (e || !d) return null;
    return d;
  });
  return error ? null : data ?? null;
}

export async function getStaticPageSlugs() {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb.from('static_pages').select('slug');
    if (e) throw new Error(e.message);
    return (d ?? []).map((r) => r.slug);
  });
  return error ? [] : data ?? [];
}
