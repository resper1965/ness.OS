import { getServiceBySlug } from "@/app/actions/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProseContent } from "@/components/site/prose-content";

type Props = { params: Promise<{ slug: string }> };

export default async function SolucaoPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <section className="container mx-auto px-4 py-16">
      <Link
        href="/solucoes"
        className="text-sm text-slate-400 hover:text-ness mb-6 block"
      >
        ← Voltar
      </Link>
      <h1 className="text-3xl font-bold mb-4 text-white">
        {service.marketing_title || service.name}
      </h1>
      {service.marketing_pitch && (
        <p className="text-lg text-slate-300 mb-6">{service.marketing_pitch}</p>
      )}
      {service.marketing_body && (
        <div className="mb-8">
          <ProseContent content={service.marketing_body} className="prose-slate" />
        </div>
      )}
      {service.marketing_features &&
        Array.isArray(service.marketing_features) && (
          <ul className="list-disc list-inside space-y-2 mb-8 text-slate-300">
            {(service.marketing_features as string[]).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
      <Link
        href="/contato"
        className="inline-flex items-center justify-center rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 transition-colors"
      >
        Solicitar proposta
      </Link>
    </section>
  );
}
