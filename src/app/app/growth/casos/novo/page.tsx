import { createSuccessCase } from '@/app/actions/growth';
import { CaseForm } from '@/components/growth/case-form';

export default function NovoCasePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Novo caso de sucesso</h1>
      <CaseForm action={createSuccessCase} />
    </div>
  );
}
