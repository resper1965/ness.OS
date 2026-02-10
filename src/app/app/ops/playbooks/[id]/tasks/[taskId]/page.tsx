import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateTaskFromForm, getTask } from '@/app/actions/ops';
import { TaskEditForm } from '@/components/ops/task-edit-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { createClient } from '@/lib/supabase/server';

type Props = { params: Promise<{ id: string; taskId: string }> };

export default async function EditarTaskPage({ params }: Props) {
  const { id: playbookId, taskId } = await params;
  const task = await getTask(taskId);

  if (!task || task.playbook_id !== playbookId) notFound();

  const supabase = await createClient();
  const { data: playbook } = await supabase.from('playbooks').select('title').eq('id', playbookId).single();

  return (
    <PageContent>
      <AppPageHeader
        title={`Editar task: ${task.title}`}
        actions={
          <Link href={`/app/ops/playbooks/${playbookId}`} className="text-sm text-slate-400 hover:text-ness">
            ← Voltar ao playbook{playbook?.title ? ` "${playbook.title}"` : ''}
          </Link>
        }
      />
      <TaskEditForm
        action={updateTaskFromForm}
        playbookId={playbookId}
        initialValues={{
          _task_id: task.id,
          title: task.title,
          slug: task.slug,
          description: task.description ?? '',
          estimated_duration_minutes: task.estimated_duration_minutes ?? undefined,
          estimated_value: task.estimated_value ?? undefined,
        }}
      />
    </PageContent>
  );
}
