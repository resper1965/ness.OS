import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { BrandAssetForm } from '@/components/growth/brand-asset-form';

export default async function GrowthBrandPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from('brand_assets')
    .select('id, name, asset_type, url, created_at')
    .order('created_at', { ascending: false });

  return (
    <PageContent>
      <AppPageHeader
        title="Brand Guardian"
        subtitle="Centraliza assets e consistência visual. Serviços e propostas podem referenciar estes assets."
      />
      <PageCard title="Novo asset" className="mb-6">
        <BrandAssetForm />
      </PageCard>
      <PageCard title="Assets cadastrados">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Nome</th>
                <th className="px-5 py-4 font-medium">Tipo</th>
                <th className="px-5 py-4 font-medium">URL</th>
                <th className="px-5 py-4 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {(assets ?? []).map((a) => (
                <tr key={a.id} className="text-slate-300">
                  <td className="px-5 py-4">{a.name}</td>
                  <td className="px-5 py-4 text-slate-400">{a.asset_type ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-400 truncate max-w-xs">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-ness hover:underline">
                        {a.url}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-400">{new Date(a.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!assets || assets.length === 0) && (
            <div className="px-4 py-12 text-center text-slate-500">Nenhum asset. Adicione acima.</div>
          )}
        </div>
      </PageCard>
    </PageContent>
  );
}
