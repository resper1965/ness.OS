import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updateSuccessCase } from '@/app/actions/success-cases';
import { CaseForm } from '@/components/growth/case-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditarCasePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: caseData, error } = await supabase.from('success_cases').select('*').eq('id', id).single();
  if (error || !caseData) notFound();

  const action = (prev: unknown, fd: FormData) => updateSuccessCase(id, prev, fd);
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Editar: {caseData.title}</h1>
      <CaseForm action={action} initialValues={caseData} />
    </div>
  );
}
