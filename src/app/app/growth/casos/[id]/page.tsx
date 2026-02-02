import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateSuccessCase } from '@/app/actions/growth';
import { CaseForm } from '@/components/growth/case-form';
import { CaseToPostButton } from '@/components/growth/case-to-post-button';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

type Props = { params: Promise<{ id: string }> };

export default async function EditarCasePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: caseData, error } = await supabase.from('success_cases').select('*').eq('id', id).single();
  if (error || !caseData) notFound();

  const action = (prev: unknown, fd: FormData) => updateSuccessCase(id, prev, fd);
  return (
    <PageContent>
      <AppPageHeader
        title={`Editar: ${caseData.title}`}
        actions={
          <>
            <Link href="/app/growth/casos" className="text-sm text-slate-400 hover:text-ness">
              ← Voltar
            </Link>
            <CaseToPostButton caseId={id} />
          </>
        }
      />
      <CaseForm action={action} initialValues={caseData} />
    </PageContent>
  );
}
