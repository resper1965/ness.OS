import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateService } from '@/app/actions/growth';
import { ServiceEditForm } from '@/components/growth/service-edit-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service, error } = await supabase.from("services_catalog").select("*").eq("id", id).single();
  const { data: playbooks } = await supabase.from("playbooks").select("id, title");

  if (error || !service) notFound();

  const updateAction = (prev: unknown, fd: FormData) => updateService(id, prev, fd);

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
      <ServiceEditForm action={updateAction} service={service} playbooks={playbooks ?? []} />
    </PageContent>
  );
}
