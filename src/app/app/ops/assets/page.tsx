import { listAssets } from '@/app/actions/ops';
import { AssetUploadForm } from '@/components/ops/asset-upload-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageCard } from '@/components/shared/page-card';
import { PageContent } from '@/components/shared/page-content';

export default async function AssetsPage() {
  const files = await listAssets();

  return (
    <PageContent>
      <AppPageHeader
        title="Assets"
        subtitle="Arquivos e ativos de marca. Upload para o bucket os-assets."
      />
      <AssetUploadForm />
      <PageCard title="Arquivos">
        <ul className="divide-y divide-slate-700">
          {(files ?? []).map((f) => (
            <li key={f.path} className="px-5 py-4 text-sm text-slate-400">{f.name}</li>
          ))}
          {(!files || files.length === 0) && (
            <li className="px-4 py-8 text-center text-slate-500">Nenhum arquivo. Faça upload acima.</li>
          )}
        </ul>
      </PageCard>
    </PageContent>
  );
}
