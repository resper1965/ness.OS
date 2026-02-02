import { HeroSection } from "@/components/site/hero-section";
import { CTABanner } from "@/components/site/cta-banner";
import { HomeServicesSection } from "@/components/site/home-services-section";
import { HomeBlogSection } from "@/components/site/home-blog-section";
import { getActiveServices, getPosts } from "@/app/actions/growth";

export default async function HomePage() {
  const [services, posts] = await Promise.all([
    getActiveServices(),
    getPosts(6),
  ]);

  return (
    <>
      <HeroSection
        title={
          <>
            Invisíveis quando{" "}
            <span className="text-ness">tudo funciona</span>. Presentes quando{" "}
            <span className="text-ness">mais importa</span>.
          </>
        }
        subtitle="Operamos hoje. Melhoramos agora. Medimos sempre."
        primaryCta={{ label: "Fale com um especialista", href: "/contato" }}
        secondaryCta={{ label: "Ver soluções", href: "/solucoes" }}
      />
      <HomeServicesSection services={services} />
      <HomeBlogSection posts={posts} />
      <CTABanner
        title="Pronto para transformar sua TI?"
        subtitle="Converse com nossos especialistas e descubra como podemos ajudar sua organização a operar e evoluir ambientes de TI de ponta a ponta."
        primaryCta={{ label: "Fale com um especialista", href: "/contato" }}
      />
    </>
  );
}
