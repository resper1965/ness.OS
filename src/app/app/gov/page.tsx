import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { NessBrand } from '@/components/shared/ness-brand';

export default function GovPage() {
  return (
    <PageContent>
      <AppPageHeader
        title={<NessBrand suffix="GOV" />}
        subtitle="Políticas e rastreabilidade."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/app/gov/politicas" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50">
          <h2 className="mb-1 font-semibold text-white">Políticas</h2>
        </Link>
        <Link href="/app/gov/aceites" className="block rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50">
          <h2 className="mb-1 font-semibold text-white">Aceites</h2>
        </Link>
      </div>
    </PageContent>
  );
}
