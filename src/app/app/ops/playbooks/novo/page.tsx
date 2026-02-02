import Link from 'next/link';
import { createPlaybook } from '@/app/actions/ops';
import { PlaybookEditorForm } from '@/components/ops/playbook-editor-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default function NovoPlaybookPage() {
  return (
    <PageContent>
      <AppPageHeader
        title="Novo playbook"
        actions={
          <Link href="/app/ops/playbooks" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <PlaybookEditorForm action={createPlaybook} />
    </PageContent>
  );
}
