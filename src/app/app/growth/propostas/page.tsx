import { createClient } from "@/lib/supabase/server";
import { PropostaForm } from "@/components/growth/proposta-form";

export default async function PropostasPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase.from("clients").select("id, name").order("name");
  const { data: services } = await supabase.from("services_catalog").select("id, name").eq("is_active", true);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Propostas PDF</h1>
      <PropostaForm clients={clients ?? []} services={services ?? []} />
    </div>
  );
}
