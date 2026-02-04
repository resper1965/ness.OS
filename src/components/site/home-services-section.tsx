import Link from "next/link";

type Service = {
  id: string;
  name: string;
  slug: string;
  marketing_pitch: string | null;
  delivery_type?: string | null;
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

const SECTION_CONFIG = {
  service: { label: "nossas soluções", subtitle: "Entregamos soluções especializadas para organizações que buscam operação e evolução de ambientes de TI de ponta a ponta." },
  product: { label: "nossos produtos", subtitle: "Plataformas e soluções SaaS para automatizar processos e governar conformidade." },
  vertical: { label: "nossas verticais", subtitle: "Soluções especializadas para necessidades específicas de mercado." },
} as const;

function resolveDeliveryType(s: Service): "service" | "product" | "vertical" {
  if (s.delivery_type && ["service", "product", "vertical"].includes(s.delivery_type)) {
    return s.delivery_type as "service" | "product" | "vertical";
  }
  if (["forense", "trustness"].includes(s.slug)) return "vertical";
  if (["nprivacy", "nfaturasons", "nflow", "ndiscovery"].includes(s.slug)) return "product";
  return "service";
}

export function HomeServicesSection({
  services,
  title = "nossas soluções",
  subtitle = "Entregamos soluções especializadas para organizações que buscam operação e evolução de ambientes de TI de ponta a ponta.",
}: Props) {
  const byType = {
    service: services.filter((s) => resolveDeliveryType(s) === "service"),
    product: services.filter((s) => resolveDeliveryType(s) === "product"),
    vertical: services.filter((s) => resolveDeliveryType(s) === "vertical"),
  };
  const hasService = byType.service.length > 0;
  const hasProduct = byType.product.length > 0;
  const hasVertical = byType.vertical.length > 0;
  if (!hasService && !hasProduct && !hasVertical) return null;

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

  const renderSection = (type: "service" | "product" | "vertical", items: Service[], cols: string, centered?: boolean) => {
    const config = SECTION_CONFIG[type];
    return (
      <section key={type} className={type === "vertical" ? "py-24 bg-slate-950" : "py-24 bg-slate-900"}>
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-light text-slate-100">
              {config.label.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-ness font-normal">
                {config.label.split(" ").slice(-1)[0]}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
              {config.subtitle}
            </p>
          </div>
          {renderGrid(items, cols, centered)}
        </div>
      </section>
    );
  };

  return (
    <>
      {hasService && renderSection("service", byType.service, "md:grid-cols-2 lg:grid-cols-3")}
      {hasProduct && renderSection("product", byType.product, "md:grid-cols-2 lg:grid-cols-4")}
      {hasVertical && renderSection("vertical", byType.vertical, "lg:grid-cols-2", true)}
    </>
  );
}
