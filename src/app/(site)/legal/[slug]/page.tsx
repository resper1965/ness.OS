import { getStaticPageBySlug } from "@/app/actions/static-pages";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/site/hero-section";

type Props = { params: Promise<{ slug: string }> };

type ContentSection = {
  title?: string;
  content?: string;
  items?: string[];
  note?: string;
};

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);

  if (!page) notFound();

  const sections = (page.content_json?.sections ?? page.content_json) as
    | ContentSection[]
    | undefined;

  return (
    <>
      <HeroSection
        title={page.title}
        subtitle={
          page.last_updated
            ? `Última atualização: ${new Date(page.last_updated).toLocaleDateString("pt-BR")}`
            : undefined
        }
        variant="compact"
      />
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 text-slate-300">
            {Array.isArray(sections) ? (
              sections.map((section, i) => (
                <section key={i}>
                  {section.title && (
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {section.title}
                    </h2>
                  )}
                  {section.content && (
                    <p className="leading-relaxed">{section.content}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      {section.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <p className="leading-relaxed mt-4 italic">{section.note}</p>
                  )}
                </section>
              ))
            ) : (
              <p>Conteúdo em construção.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
