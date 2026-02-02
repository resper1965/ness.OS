import Link from "next/link";

type Service = {
  id: string;
  name: string;
  slug: string;
  marketing_pitch: string | null;
};

type Props = {
  services: Service[];
  title?: string;
  subtitle?: string;
};

/** Renderiza nome com destaque no ponto (ness. -> ness<span>.</span>) */
function renderBrandName(name: string) {
  const parts = name.split(".");
  if (parts.length <= 1) return name;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-ness">.</span>}
        </span>
      ))}
    </>
  );
}

const VERTICAL_SLUGS = ["forense", "trustness"];

export function HomeServicesSection({
  services,
  title = "nossas soluções",
  subtitle = "Entregamos soluções especializadas para organizações que buscam operação e evolução de ambientes de TI de ponta a ponta.",
}: Props) {
  const operational = services.filter((s) => !VERTICAL_SLUGS.includes(s.slug));
  const verticals = services.filter((s) => VERTICAL_SLUGS.includes(s.slug));
  const hasOperational = operational.length > 0;
  const hasVerticals = verticals.length > 0;
  if (!hasOperational && !hasVerticals) return null;

  const renderGrid = (items: Service[], cols: string, centered?: boolean) => {
    const grid = (
      <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {items.map((s) => (
            <Link
              key={s.id}
              href={`/solucoes/${s.slug}`}
              className="block rounded-2xl border border-slate-800/50 bg-slate-850/30 p-8 transition-all duration-300 hover:bg-slate-850/50 hover:border-ness/20"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-normal text-slate-100">
                    {renderBrandName(s.name)}
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed font-light text-[15px]">
                  {s.marketing_pitch || "Saiba mais."}
                </p>
                <span className="inline-flex items-center text-slate-400 hover:text-ness text-sm font-medium transition-colors">
                  Saiba mais →
                </span>
              </div>
            </Link>
          ))}
      </div>
    );
    return centered ? <div className="max-w-5xl mx-auto">{grid}</div> : grid;
  };

  return (
    <>
      {hasOperational && (
        <section className="py-24 bg-slate-900">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-slate-100">
                {title.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-ness font-normal">
                  {title.split(" ").slice(-1)[0]}
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>
            {renderGrid(operational, "md:grid-cols-2 lg:grid-cols-3")}
          </div>
        </section>
      )}
      {hasVerticals && (
        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-slate-100">
                nossas verticais{" "}
                <span className="text-ness font-normal">.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
                Soluções especializadas para necessidades específicas de mercado.
              </p>
            </div>
            {renderGrid(verticals, "lg:grid-cols-2", true)}
          </div>
        </section>
      )}
    </>
  );
}
