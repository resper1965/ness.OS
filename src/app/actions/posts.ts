'use server';

import { createClient } from '@/lib/supabase/server';

export async function getPosts(limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('public_posts')
    .select('id, slug, title, seo_description, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('public_posts')
    .select('id, slug, title, content_markdown, seo_description, published_at, author_id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data;
}
