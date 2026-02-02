import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateJob } from '@/app/actions/people';
import { JobEditForm } from '@/components/people/job-edit-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

type Props = { params: Promise<{ id: string }> };

export default async function EditarVagaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job, error } = await supabase.from('public_jobs').select('*').eq('id', id).single();
  if (error || !job) notFound();
  const updateAction = (prev: unknown, fd: FormData) => updateJob(id, prev, fd);

  return (
    <PageContent>
      <AppPageHeader
        title={`Editar: ${job.title}`}
        actions={
          <Link href="/app/people/vagas" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <JobEditForm action={updateAction} job={job} />
    </PageContent>
  );
}
