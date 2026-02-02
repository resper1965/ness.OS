import { PolicyForm } from '@/components/gov/policy-form';
import { createPolicyFromForm } from '@/app/actions/policies';
import Link from 'next/link';

export default function GovPoliticasNovoPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/app/gov/politicas" className="text-ness hover:underline text-sm">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Nova política</h1>
      </div>
      <PolicyForm action={createPolicyFromForm} />
    </div>
  );
}
