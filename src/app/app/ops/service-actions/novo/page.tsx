import Link from 'next/link';
import { createServiceAction } from '@/app/actions/ops';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default function NovoServiceActionPage() {
  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-ness focus:ring-ness';

  return (
    <PageContent>
      <AppPageHeader
        title="Nova Service Action"
        actions={
          <Link href="/app/ops/service-actions" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      
      <div className="max-w-2xl mx-auto rounded-lg border border-slate-700 bg-slate-800/50 p-8 shadow-xl">
        <form 
          action={async (formData) => {
            'use server';
            await createServiceAction(null, formData);
          }} 
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Título do Job</label>
            <input name="title" required className={inputClass} placeholder="Ex: Onboarding Cloud Enterprise" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Slug (opcional)</label>
            <input name="slug" className={inputClass} placeholder="Ex: onboarding-cloud-enterprise" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
            <textarea name="description" rows={4} className={inputClass} placeholder="Descreva o que este conjunto de playbooks entrega..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Fator de Complexidade</label>
            <input name="complexity_factor" type="number" step="0.1" defaultValue="1.0" className={inputClass} />
            <p className="text-xs text-slate-500 mt-1">Multiplicador de margem/risco. 1.0 = valor base.</p>
          </div>
          
          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 shadow-lg shadow-ness/20">
              Criar Action
            </button>
            <Link href="/app/ops/service-actions" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </PageContent>
  );
}
