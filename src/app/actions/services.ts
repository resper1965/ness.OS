'use server';

import { createClient } from '@/lib/supabase/server';

export async function getServiceBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('services_catalog')
    .select('id, name, slug, marketing_pitch, marketing_features, cover_image_url, content_json')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  // Nunca expor base_price, technical_scope no site público
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    marketing_pitch: data.marketing_pitch,
    marketing_features: data.marketing_features,
    cover_image_url: data.cover_image_url,
    content_json: data.content_json ?? null,
  };
}
