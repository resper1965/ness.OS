import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { BrandAssetForm } from '@/components/growth/brand-asset-form';

type AssetRow = {
  id: string;
  name: string;
  asset_type: string | null;
  url: string | null;
  created_at: string;
};

export default async function GrowthBrandPage() {
  const supabase = await getServerClient();
  const { data: assets } = await supabase
    .from('brand_assets')
    .select('id, name, asset_type, url, created_at')
    .order('created_at', { ascending: false });

  const rows = (assets ?? []) as AssetRow[];

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
        <DataTable<AssetRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum ativo de marca"
          emptyDescription="Centraliza assets e consistência visual. Adicione acima. Serviços e propostas podem referenciar estes assets. Brand Guardian: logos, cores, tipografia."
          columns={[
            { key: 'name', header: 'Nome' },
            {
              key: 'asset_type',
              header: 'Tipo',
              render: (row) => <span className="text-slate-400">{row.asset_type ?? '-'}</span>,
            },
            {
              key: 'url',
              header: 'URL',
              render: (row) =>
                row.url ? (
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ness hover:underline truncate max-w-xs block"
                  >
                    {row.url}
                  </a>
                ) : (
                  '-'
                ),
            },
            {
              key: 'created_at',
              header: 'Data',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.created_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
