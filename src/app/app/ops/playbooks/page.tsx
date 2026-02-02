import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PrimaryButton } from '@/components/shared/primary-button';

export default async function PlaybooksPage() {
  const supabase = await createClient();
  const { data: playbooks } = await supabase
    .from('playbooks')
    .select('id, title, slug, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <PageContent>
      <AppPageHeader
        title="Playbooks"
        subtitle="Manuais técnicos que definem &quot;como fazemos&quot;. Todo serviço vendido deve ter um playbook vinculado."
        actions={<PrimaryButton href="/app/ops/playbooks/novo">Novo playbook</PrimaryButton>}
      />
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Atualizado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(playbooks ?? []).map((pb) => (
              <tr key={pb.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="px-4 py-3">{pb.title}</td>
                <td className="px-4 py-3 text-slate-400">{pb.slug}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(pb.updated_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <Link href={`/app/ops/playbooks/${pb.id}`} className="text-ness hover:underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!playbooks || playbooks.length === 0) && (
          <div className="px-4 py-12 text-center">
            <p className="text-slate-400">Nenhum playbook cadastrado.</p>
            <p className="mt-2 text-sm text-slate-500">Crie o primeiro para documentar procedimentos e habilitar o Knowledge Bot.</p>
            <div className="mt-4">
              <PrimaryButton href="/app/ops/playbooks/novo">Novo playbook</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </PageContent>
  );
}
