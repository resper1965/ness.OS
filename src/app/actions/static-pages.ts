'use server';

import { createClient } from '@/lib/supabase/server';

export async function getStaticPageBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('static_pages')
      .select('id, slug, title, seo_description, content_json, last_updated')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getStaticPageSlugs() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('static_pages').select('slug');
    return (data ?? []).map((r) => r.slug);
  } catch {
    return [];
  }
}
