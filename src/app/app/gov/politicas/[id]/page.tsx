import { getPolicyById, updatePolicyFromForm } from '@/app/actions/gov';
import { PolicyForm } from '@/components/gov/policy-form';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    <div>
      <div className="mb-6">
        <Link href="/app/gov/politicas" className="text-ness hover:underline text-sm">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Editar: {policy.title}</h1>
        <p className="text-slate-400 text-sm mt-1">
          Ao salvar, será criada uma nova versão.
        </p>
      </div>
      <PolicyForm
        action={updatePolicyFromForm}
        policyId={id}
        defaultTitle={policy.title}
        defaultSlug={policy.slug ?? ''}
        defaultContent={defaultContent}
      />
    </div>
  );
}
