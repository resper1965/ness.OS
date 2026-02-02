import { createClient } from '@/lib/supabase/server';

export default async function GrowthBrandPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from('brand_assets')
    .select('id, name, asset_type, url, created_at')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Brand Guardian</h1>
      <p className="text-slate-400 mb-6">Centraliza assets e consistência visual.</p>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(assets ?? []).map((a) => (
              <tr key={a.id} className="text-slate-300">
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3 text-slate-400">{a.asset_type ?? '-'}</td>
                <td className="px-4 py-3 text-slate-400 truncate max-w-xs">{a.url ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!assets || assets.length === 0) && (
          <div className="px-4 py-12 text-center text-slate-500">Nenhum asset.</div>
        )}
      </div>
    </div>
  );
}
