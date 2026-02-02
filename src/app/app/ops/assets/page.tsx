import { listAssets } from '@/app/actions/ops';
import { AssetUploadForm } from "@/components/ops/asset-upload-form";

export default async function AssetsPage() {
  const files = await listAssets();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Assets (os-assets)</h1>
      <AssetUploadForm />
      <div className="mt-8 rounded-lg border border-slate-700 overflow-hidden">
        <h2 className="font-semibold text-slate-200 p-4 border-b border-slate-700">Arquivos</h2>
        <ul className="divide-y divide-slate-700">
          {(files ?? []).map((f) => (
            <li key={f.path} className="px-4 py-3 text-slate-400 text-sm">{f.name}</li>
          ))}
          {(!files || files.length === 0) && (
            <li className="px-4 py-8 text-slate-500 text-center">Nenhum arquivo. Faça upload acima.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
