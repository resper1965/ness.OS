import Link from 'next/link';
import { createSuccessCase } from '@/app/actions/growth';
import { CaseForm } from '@/components/growth/case-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default function NovoCasePage() {
  return (
    <PageContent>
      <AppPageHeader
        title="Novo caso de sucesso"
        actions={
          <Link href="/app/growth/casos" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <CaseForm action={createSuccessCase} />
    </PageContent>
  );
}
