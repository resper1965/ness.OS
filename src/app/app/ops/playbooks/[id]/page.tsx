import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updatePlaybook } from '@/app/actions/playbooks';
import { PlaybookEditorForm } from '@/components/ops/playbook-editor-form';

type Props = { params: Promise<{ id: string }> };

export default async function EditarPlaybookPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: playbook, error } = await supabase
    .from('playbooks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !playbook) notFound();

  const updateAction = (prev: unknown, fd: FormData) => updatePlaybook(id, prev, fd);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Editar: {playbook.title}</h1>
      <PlaybookEditorForm action={updateAction} initialValues={playbook} />
    </div>
  );
}
