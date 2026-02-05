import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';
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
      <PageCard title="Playbooks">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Título</th>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Atualizado</th>
              <th className="px-5 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(playbooks ?? []).map((pb) => (
              <tr key={pb.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="px-5 py-4">{pb.title}</td>
                <td className="px-5 py-4 text-slate-400">{pb.slug}</td>
                <td className="px-5 py-4 text-slate-400">{new Date(pb.updated_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-5 py-4">
                  <Link href={`/app/ops/playbooks/${pb.id}`} className="text-ness hover:underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!playbooks || playbooks.length === 0) && (
          <EmptyState
            icon={BookOpen}
            title="Nenhum playbook cadastrado"
            message="Crie o primeiro para documentar procedimentos e habilitar o Knowledge Bot."
            description="Todo serviço vendido deve ter um playbook vinculado."
            action={<PrimaryButton href="/app/ops/playbooks/novo">Novo playbook</PrimaryButton>}
          />
        )}
        </div>
      </PageCard>
    </PageContent>
  );
}
