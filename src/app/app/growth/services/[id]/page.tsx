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
    .select("*, services_service_actions(service_action_id)")
    .eq("id", id)
    .single();
  const { data: serviceActions } = await supabase.from("service_actions").select("id, title");

  if (error || !service) notFound();

  const serviceActionIds = Array.isArray(service?.services_service_actions)
    ? (service.services_service_actions as { service_action_id: string }[]).map((ssa) => ssa.service_action_id)
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
      <ServiceEditForm action={updateServiceFromForm} service={{ ...service, id: service.id, service_action_ids: serviceActionIds }} serviceActions={serviceActions ?? []} />
    </PageContent>
  );
}
