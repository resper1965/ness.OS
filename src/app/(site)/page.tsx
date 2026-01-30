import { HeroSection } from "@/components/site/hero-section";
import { CTABanner } from "@/components/site/cta-banner";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection
        title={
          <>
            ness<span className="text-ness">.</span> — onde tudo funciona
          </>
        }
        subtitle="Ecossistema unificado: Site institucional + Plataforma de gestão."
        primaryCta={{ label: "Fale conosco", href: "/contato" }}
        secondaryCta={{ label: "Nossas soluções", href: "/solucoes" }}
      />
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-light text-slate-100 mb-6">
            Tecnologia e segurança para sua empresa
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            Integramos operação, vendas e gestão em uma única plataforma que alimenta
            seu site e gera resultados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/solucoes"
              className="text-ness hover:underline font-medium"
            >
              Ver soluções →
            </Link>
            <Link
              href="/blog"
              className="text-ness hover:underline font-medium"
            >
              Blog →
            </Link>
            <Link
              href="/carreiras"
              className="text-ness hover:underline font-medium"
            >
              Carreiras →
            </Link>
          </div>
        </div>
      </section>
      <CTABanner
        title="Pronto para transformar sua operação?"
        subtitle="Fale com nossos especialistas e descubra como o ness.OS pode ajudar sua empresa."
        primaryCta={{ label: "Solicitar contato", href: "/contato" }}
      />
    </>
  );
}
