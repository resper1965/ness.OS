import { getServiceBySlug } from '@/app/actions/growth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SolucaoDetailContent } from '@/components/site/solucao-detail-content';

type Props = { params: Promise<{ slug: string }> };

export default async function SolucaoPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/solucoes"
          className="text-sm text-slate-400 hover:text-ness mb-6 inline-block"
        >
          ← Voltar
        </Link>
      </div>
      <SolucaoDetailContent service={service} />
    </>
  );
}
