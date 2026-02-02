import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';

export default function GovPage() {
  return (
    <div>
      <AppPageHeader title="ness.GOV" subtitle="Políticas e rastreabilidade." />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/app/gov/politicas" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50">
          <h2 className="font-semibold text-white mb-1">Políticas</h2>
        </Link>
        <Link href="/app/gov/aceites" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50">
          <h2 className="font-semibold text-white mb-1">Aceites</h2>
        </Link>
      </div>
    </div>
  );
}
