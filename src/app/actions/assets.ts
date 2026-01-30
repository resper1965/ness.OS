'use server';

import { createClient } from '@/lib/supabase/server';

const BUCKET = 'os-assets';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadAsset(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string; path?: string }> {
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || '';

  if (!file || file.size === 0) return { error: 'Selecione um arquivo.' };
  if (file.size > MAX_SIZE) return { error: 'Arquivo muito grande (máx. 10MB).' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const ext = file.name.split('.').pop() || 'bin';
  const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const path = folder ? `${folder}/${name}` : name;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) return { error: error.message };
  return { success: true, path };
}

export async function listAssets(folder = ''): Promise<{ name: string; path: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from(BUCKET).list(folder || undefined, { limit: 100 });

    if (error) return [];

    const items = (data ?? []).filter((f) => f.name);
    return items.map((f) => ({
      name: f.name as string,
      path: folder ? `${folder}/${f.name}` : (f.name as string),
    }));
  } catch {
    return [];
  }
}
