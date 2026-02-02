import Link from 'next/link';
import { createPolicyFromForm } from '@/app/actions/gov';
import { PolicyForm } from '@/components/gov/policy-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default function GovPoliticasNovoPage() {
  return (
    <PageContent>
      <AppPageHeader
        title="Nova política"
        actions={
          <Link href="/app/gov/politicas" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <PolicyForm action={createPolicyFromForm} />
    </PageContent>
  );
}
