import { createPlaybook } from '@/app/actions/playbooks';
import { PlaybookEditorForm } from '@/components/ops/playbook-editor-form';

export default function NovoPlaybookPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Novo playbook</h1>
      <PlaybookEditorForm action={createPlaybook} />
    </div>
  );
}
