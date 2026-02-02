import { getPolicyById, updatePolicyFromForm } from '@/app/actions/gov';
import { PolicyForm } from '@/components/gov/policy-form';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

export default async function GovPoliticasEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const policy = await getPolicyById(id);
  if (!policy) notFound();

  const versions = (policy.policy_versions as { version: number; content_text: string }[] | null) ?? [];
  const latest = versions.sort((a, b) => b.version - a.version)[0];
  const defaultContent = latest?.content_text ?? '';

  return (
    <PageContent>
      <AppPageHeader
        title={`Editar: ${policy.title}`}
        subtitle="Ao salvar, será criada uma nova versão."
        actions={
          <Link href="/app/gov/politicas" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />
      <PolicyForm
        action={updatePolicyFromForm}
        policyId={id}
        defaultTitle={policy.title}
        defaultSlug={policy.slug ?? ''}
        defaultContent={defaultContent}
      />
    </PageContent>
  );
}
