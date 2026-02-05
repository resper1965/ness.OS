import { FolderOpen } from 'lucide-react';
import { listAssets } from '@/app/actions/ops';
import { AssetUploadForm } from '@/components/ops/asset-upload-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageCard } from '@/components/shared/page-card';
import { PageContent } from '@/components/shared/page-content';
import { EmptyState } from '@/components/shared/empty-state';

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
        {(!files || files.length === 0) ? (
          <EmptyState
            icon={FolderOpen}
            title="Nenhum arquivo"
            message="Faça upload acima para enviar arquivos ao bucket os-assets."
            description="Arquivos e ativos de marca para uso em propostas e documentação."
          />
        ) : (
          <ul className="divide-y divide-slate-700">
            {files.map((f) => (
              <li key={f.path} className="px-5 py-4 text-sm text-slate-400">{f.name}</li>
            ))}
          </ul>
        )}
      </PageCard>
    </PageContent>
  );
}
