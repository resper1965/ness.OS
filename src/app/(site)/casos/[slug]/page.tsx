import { getCaseBySlug } from '@/app/actions/cases-public';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProseContent } from '@/components/site/prose-content';

type Props = { params: Promise<{ slug: string }> };

export default async function CasoPage({ params }: Props) {
  const { slug } = await params;
  const caseData = await getCaseBySlug(slug);
  if (!caseData) notFound();

  return (
    <section className="container mx-auto px-4 py-16">
      <Link href="/casos" className="text-sm text-slate-400 hover:text-ness mb-6 block">
        ← Voltar aos casos
      </Link>
      <h1 className="text-3xl font-bold mb-4 text-white">{caseData.title}</h1>
      {caseData.summary && (
        <p className="text-lg text-slate-300 mb-6">{caseData.summary}</p>
      )}
      {caseData.content_html && (
        <div className="mt-6">
          <ProseContent content={caseData.content_html} />
        </div>
      )}
      {!caseData.content_html && caseData.summary && (
        <p className="text-slate-500 text-sm">Conteúdo em breve.</p>
      )}
    </section>
  );
}
