import Link from 'next/link';
import { HeroSection } from './hero-section';
import { CTABanner } from './cta-banner';
import { FeatureGrid } from './feature-grid';
import { renderHighlight } from './render-highlight';

type ContentJson = {
  hero?: { title?: string; headline?: string; description?: string; primaryCta?: string; secondaryCta?: string };
  whyItMatters?: { title?: string; subheading?: string; paragraphs?: string[] };
  useCases?: Array<{ title: string; description: string }>;
  useCasesTitle?: string;
  resources?: Array<{ title: string; description: string }>;
  resourcesTitle?: string;
  resourcesSubtitle?: string;
  metrics?: Array<{ label: string; value: string }>;
  metricsTitle?: string;
  metricsSubtitle?: string;
  process?: Array<{ step: string; title: string; description: string }>;
  processTitle?: string;
  processSubtitle?: string;
  cta?: { title?: string; description?: string; primaryCta?: string; secondaryCta?: string };
};

type Props = {
  service: { name: string; marketing_title?: string; marketing_pitch?: string; content_json?: unknown };
};

export function SolucaoDetailContent({ service }: Props) {
  const content = (service.content_json || {}) as ContentJson;
  const hasContent = content.hero || content.whyItMatters || content.useCases;

  if (!hasContent) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4 text-white">
          {service.marketing_title || service.name}
        </h1>
        {service.marketing_pitch && (
          <p className="text-lg text-slate-300 mb-8">{service.marketing_pitch}</p>
        )}
        <Link
          href="/contato"
          className="inline-flex items-center justify-center rounded-md bg-ness px-6 py-3 text-base font-medium text-white hover:bg-ness-600"
        >
          Solicitar proposta
        </Link>
      </section>
    );
  }

  return (
    <>
      <HeroSection
        title={renderHighlight(content.hero?.title || content.hero?.headline || service.marketing_title || service.name)}
        subtitle={content.hero?.headline ? undefined : (content.hero?.description || service.marketing_pitch || undefined)}
        description={content.hero?.headline ? (content.hero?.description || service.marketing_pitch || undefined) : undefined}
        primaryCta={content.hero?.primaryCta ? { label: content.hero.primaryCta, href: '/contato' } : undefined}
        secondaryCta={content.hero?.secondaryCta ? { label: content.hero.secondaryCta, href: '/solucoes' } : undefined}
      />

      {content.whyItMatters && (
        <section className="py-16 bg-slate-900">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {renderHighlight(content.whyItMatters.title || 'Por que importa')}
            </h2>
            {content.whyItMatters.subheading && (
              <p className="text-lg text-slate-300 mb-6">
                {renderHighlight(content.whyItMatters.subheading)}
              </p>
            )}
            {content.whyItMatters.paragraphs?.map((p, i) => (
              <p key={i} className="text-slate-400 leading-relaxed mb-4">
                {renderHighlight(p)}
              </p>
            ))}
          </div>
        </section>
      )}

      {content.useCases && content.useCases.length > 0 && (
        <FeatureGrid
          title={(content.useCasesTitle || 'Casos de uso típicos').replace(/<[^>]+>/g, '')}
          features={content.useCases.map((u) => ({ title: u.title, description: u.description }))}
        />
      )}

      {content.resources && content.resources.length > 0 && (
        <FeatureGrid
          title={(content.resourcesTitle || 'Recursos principais').replace(/<[^>]+>/g, '')}
          subtitle={content.resourcesSubtitle}
          features={content.resources}
        />
      )}

      {content.metrics && content.metrics.length > 0 && (
        <section className="py-16 bg-slate-800/50">
          <div className="container mx-auto px-4 md:px-6">
            {(content.metricsTitle || content.metricsSubtitle) && (
              <div className="text-center mb-12">
                {content.metricsTitle && (
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {renderHighlight(content.metricsTitle)}
                  </h2>
                )}
                {content.metricsSubtitle && (
                  <p className="text-slate-400">{content.metricsSubtitle}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {content.metrics.map((m, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-slate-800/50">
                  <div className="text-2xl font-bold text-ness">{m.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.process && content.process.length > 0 && (
        <section className="py-16 bg-slate-900">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            {content.processTitle && (
              <h2 className="text-2xl font-semibold text-white mb-2">
                {renderHighlight(content.processTitle)}
              </h2>
            )}
            {content.processSubtitle && (
              <p className="text-slate-400 mb-8">{content.processSubtitle}</p>
            )}
            <ol className="space-y-6">
              {content.process.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ness/20 text-ness flex items-center justify-center font-semibold">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-medium text-white">{s.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {content.cta && (
        <CTABanner
          title={content.cta.title ? renderHighlight(content.cta.title) : 'Pronto para começar?'}
          subtitle={content.cta.description}
          primaryCta={content.cta.primaryCta ? { label: content.cta.primaryCta, href: '/contato' } : undefined}
          secondaryCta={content.cta.secondaryCta ? { label: content.cta.secondaryCta, href: '/solucoes' } : undefined}
        />
      )}

      {!content.cta && (
        <CTABanner
          title="Pronto para transformar sua operação?"
          subtitle="Fale com nossos especialistas."
          primaryCta={{ label: 'Solicitar proposta', href: '/contato' }}
        />
      )}
    </>
  );
}
