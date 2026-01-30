import { getPostBySlug } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/site/hero-section";
import { ProseContent } from "@/components/site/prose-content";
import { CTABanner } from "@/components/site/cta-banner";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const content = post.content_markdown ?? "";
  const isHtml = content.trim().startsWith("<");

  return (
    <>
      <HeroSection
        title={post.title}
        subtitle={publishedDate ? `Publicado em ${publishedDate}` : undefined}
        variant="compact"
      />
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="text-sm text-slate-400 hover:text-ness mb-6 inline-block"
            >
              ← Voltar ao Blog
            </Link>
            {content && (
              <div className="mt-8">
                {isHtml ? (
                  <ProseContent content={content} />
                ) : (
                  <ProseContent
                    content={`<div class="whitespace-pre-wrap text-slate-300">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <CTABanner
        title="Precisa de ajuda?"
        subtitle="Fale com nossa equipe e descubra como podemos transformar sua operação."
        primaryCta={{ label: "Fale conosco", href: "/contato" }}
      />
    </>
  );
}
