import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ServiceForm } from '@/components/growth/service-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';

export default async function GrowthServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from('services_catalog')
    .select('id, name, slug, is_active, services_playbooks(playbooks(title))')
    .order('name');
  const { data: playbooks } = await supabase.from('playbooks').select('id, title').order('title');

  return (
    <PageContent>
      <AppPageHeader
        title="Catálogo de Serviços"
        subtitle="Serviços vendáveis. Só podem ficar ativos se tiverem playbook vinculado (Trava Growth×OPS)."
      />
      <ServiceForm playbooks={playbooks ?? []} />
      <PageCard title="Catálogo de Serviços">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr className="h-[52px]">
              <th className="px-5 py-4 font-medium">Nome</th>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Playbook</th>
              <th className="px-5 py-4 font-medium">Ativo</th>
              <th className="px-5 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-400">
            {(services ?? []).map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4">{s.name}</td>
                <td className="px-5 py-4">{s.slug}</td>
                <td className="px-5 py-4">
                  {Array.isArray(s.services_playbooks) && (s.services_playbooks as { playbooks?: { title?: string } }[]).length > 0
                    ? (s.services_playbooks as { playbooks?: { title?: string } }[]).map((sp) => sp.playbooks?.title).filter(Boolean).join(', ')
                    : '-'}
                </td>
                <td className="px-5 py-4">{s.is_active ? "Sim" : "Não"}</td>
                <td className="px-5 py-4">
                  <Link href={`/app/growth/services/${s.id}`} className="text-ness hover:underline">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </PageCard>
    </PageContent>
  );
}
