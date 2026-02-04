import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updatePlaybookFromForm } from '@/app/actions/ops';
import { PlaybookEditorForm } from '@/components/ops/playbook-editor-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

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

  return (
    <PageContent>
      <AppPageHeader
        title={`Editar: ${playbook.title}`}
        actions={
          <Link href="/app/ops/playbooks" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <PlaybookEditorForm action={updatePlaybookFromForm} initialValues={{ ...playbook, id: playbook.id }} />
    </PageContent>
  );
}
