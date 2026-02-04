import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateServiceFromForm } from '@/app/actions/growth';
import { ServiceEditForm } from '@/components/growth/service-edit-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services_catalog")
    .select("*, services_playbooks(playbook_id)")
    .eq("id", id)
    .single();
  const { data: playbooks } = await supabase.from("playbooks").select("id, title");

  if (error || !service) notFound();

  const playbookIds = Array.isArray(service?.services_playbooks)
    ? (service.services_playbooks as { playbook_id: string }[]).map((sp) => sp.playbook_id)
    : [];

  return (
    <PageContent>
      <AppPageHeader
        title={`Editar: ${service.name}`}
        actions={
          <Link href="/app/growth/services" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <ServiceEditForm action={updateServiceFromForm} service={{ ...service, id: service.id, playbook_ids: playbookIds }} playbooks={playbooks ?? []} />
    </PageContent>
  );
}
