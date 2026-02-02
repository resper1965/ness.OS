import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updateJob } from '@/app/actions/people';
import { JobEditForm } from '@/components/people/job-edit-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditarVagaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job, error } = await supabase.from('public_jobs').select('*').eq('id', id).single();
  if (error || !job) notFound();
  const updateAction = (prev: unknown, fd: FormData) => updateJob(id, prev, fd);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Editar: {job.title}</h1>
      <JobEditForm action={updateAction} job={job} />
    </div>
  );
}
