import { getServerClient } from '@/lib/supabase/queries/base';
import { notFound } from 'next/navigation';
import { ContractJobsManager } from '@/components/fin/contract-jobs-manager';
import { getServiceActions } from '@/app/actions/ops';

type PageProps = {
  params: { id: string };
};

export default async function ContractJobsPage({ params }: PageProps) {
  const { id } = params;
  const supabase = await getServerClient();

  // Fetch contract
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select('*, clients(name)')
    .eq('id', id)
    .single();

  if (contractError || !contract) {
    notFound();
  }

  // Fetch linked service actions
  const { data: linkedActions } = await supabase
    .from('contracts_service_actions')
    .select(`
      *,
      service_actions (
        id,
        title,
        slug,
        estimated_cost_total,
        estimated_duration_total,
        complexity_factor
      )
    `)
    .eq('contract_id', id);

  // Fetch all available service actions
  const availableActions = await getServiceActions();

  const clientName = (contract.clients as { name?: string } | null)?.name ?? 'Cliente desconhecido';

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Jobs do Contrato</h1>
        <p className="text-muted-foreground mt-1">
          Cliente: <span className="font-semibold">{clientName}</span> | MRR: R$ {contract.mrr ?? 0}
        </p>
      </div>

      <ContractJobsManager
        contractId={id}
        linkedActions={linkedActions ?? []}
        availableActions={availableActions}
      />
    </div>
  );
}
