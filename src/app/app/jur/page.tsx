import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { NessBrand } from '@/components/shared/ness-brand';
import { PageContent } from '@/components/shared/page-content';

export default function JurPage() {
  return (
    <PageContent>
      <AppPageHeader
        title={<NessBrand suffix="JUR" />}
        subtitle="Análise de risco e conformidade."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/app/jur/risco" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50">
          <h2 className="mb-1 font-semibold text-white">Análise de Risco</h2>
          <p className="text-sm text-slate-400">Analise minutas com IA.</p>
        </Link>
        <Link href="/app/jur/conformidade" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50">
          <h2 className="mb-1 font-semibold text-white">Conformidade</h2>
          <p className="text-sm text-slate-400">LGPD, Marco Civil.</p>
        </Link>
      </div>
    </PageContent>
  );
}
