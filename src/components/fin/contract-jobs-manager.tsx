'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { linkServiceActionToContractForm, unlinkServiceActionFromContractForm } from '@/app/actions/contract-jobs';
import type { ServiceActionRow } from '@/app/actions/ops';

type LinkedAction = {
  contract_id: string;
  service_action_id: string;
  quantity: number;
  unit_price: number | null;
  service_actions: ServiceActionRow;
};

type Props = {
  contractId: string;
  linkedActions: LinkedAction[];
  availableActions: ServiceActionRow[];
};

export function ContractJobsManager({ contractId, linkedActions, availableActions }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [linkState, linkAction] = useFormState(linkServiceActionToContractForm, null);

  // Filter out already linked actions
  const unlinkedActions = availableActions.filter(
    (action) => !linkedActions.some((linked) => linked.service_action_id === action.id)
  );

  // Calculate total estimated cost
  const totalEstimatedCost = linkedActions.reduce((sum, linked) => {
    const cost = linked.service_actions.estimated_cost_total ?? 0;
    const unitPrice = linked.unit_price ?? cost;
    return sum + unitPrice * linked.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-2">Resumo do Contrato</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Jobs Vinculados</p>
            <p className="text-2xl font-bold">{linkedActions.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Custo Estimado Total</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalEstimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Linked Actions Table */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Service Actions Vinculados</h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {isAdding ? 'Cancelar' : '+ Adicionar Job'}
          </button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <form action={linkAction} className="p-6 border-b bg-muted/50">
            <input type="hidden" name="contract_id" value={contractId} />
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Service Action</label>
                <select
                  name="service_action_id"
                  className="w-full rounded-md border px-3 py-2"
                  required
                >
                  <option value="">Selecionar...</option>
                  {unlinkedActions.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.title} (R$ {action.estimated_cost_total?.toFixed(2) ?? 0})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantidade</label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue="1"
                  min="0.1"
                  step="0.1"
                  className="w-full rounded-md border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço Unitário (opcional)</label>
                <input
                  type="number"
                  name="unit_price"
                  placeholder="Auto"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Adicionar
              </button>
              {linkState?.error && (
                <p className="text-red-600 text-sm self-center">{linkState.error}</p>
              )}
              {linkState?.success && (
                <p className="text-green-600 text-sm self-center">✓ Adicionado com sucesso!</p>
              )}
            </div>
          </form>
        )}

        {/* List */}
        <div className="p-6">
          {linkedActions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum Job vinculado a este contrato. Clique em &ldquo;Adicionar Job&rdquo; para começar.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3">Service Action</th>
                  <th className="pb-3 text-right">Duração (min)</th>
                  <th className="pb-3 text-right">Custo Base</th>
                  <th className="pb-3 text-right">Qtd</th>
                  <th className="pb-3 text-right">Preço Unit.</th>
                  <th className="pb-3 text-right">Subtotal</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {linkedActions.map((linked) => {
                  const sa = linked.service_actions;
                  const costBase = sa.estimated_cost_total ?? 0;
                  const unitPrice = linked.unit_price ?? costBase;
                  const subtotal = unitPrice * linked.quantity;

                  return (
                    <tr key={linked.service_action_id} className="border-b last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{sa.title}</p>
                        <p className="text-sm text-muted-foreground">{sa.slug}</p>
                      </td>
                      <td className="py-3 text-right text-sm">{sa.estimated_duration_total ?? 0}</td>
                      <td className="py-3 text-right text-sm">
                        R$ {costBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right text-sm">{linked.quantity}</td>
                      <td className="py-3 text-right text-sm">
                        R$ {unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right font-semibold">
                        R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <form action={async (formData) => {
                          await unlinkServiceActionFromContractForm(formData);
                        }}>
                          <input type="hidden" name="contract_id" value={contractId} />
                          <input type="hidden" name="service_action_id" value={linked.service_action_id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remover
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold">
                  <td colSpan={5} className="py-3 text-right">Total Estimado:</td>
                  <td className="py-3 text-right text-lg">
                    R$ {totalEstimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
