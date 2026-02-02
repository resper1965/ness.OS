import { createClient } from '@/lib/supabase/server';
import { PropostaForm } from '@/components/growth/proposta-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default async function PropostasPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase.from('clients').select('id, name').order('name');
  const { data: services } = await supabase.from('services_catalog').select('id, name').eq('is_active', true);

  return (
    <PageContent>
      <AppPageHeader
        title="Propostas PDF"
        subtitle="Gere propostas técnicas e comerciais com IA."
      />
      <PropostaForm clients={clients ?? []} services={services ?? []} />
    </PageContent>
  );
}
