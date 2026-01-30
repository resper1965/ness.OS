import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { updateService } from "@/app/actions/admin-services";
import { ServiceEditForm } from "@/components/growth/service-edit-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service, error } = await supabase.from("services_catalog").select("*").eq("id", id).single();
  const { data: playbooks } = await supabase.from("playbooks").select("id, title");

  if (error || !service) notFound();

  const updateAction = (prev: unknown, fd: FormData) => updateService(id, prev, fd);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Editar: {service.name}</h1>
      <ServiceEditForm action={updateAction} service={service} playbooks={playbooks ?? []} />
    </div>
  );
}
