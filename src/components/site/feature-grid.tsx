import { LucideIcon } from "lucide-react";

export type FeatureItem = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

type FeatureGridProps = {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3;
  className?: string;
};

export function FeatureGrid({
  title,
  subtitle,
  features,
  columns = 3,
  className = "",
}: FeatureGridProps) {
  return (
    <section className={`py-24 bg-slate-900 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {(title || subtitle) && (
          <div className="text-center mb-16 space-y-6">
            {title && (
              <h2 className="text-4xl md:text-5xl font-light text-slate-100">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div
          className={`grid gap-6 ${
            columns === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-8 backdrop-blur-sm hover:bg-slate-900/80 hover:border-ness/20 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {Icon && (
                    <div className="w-12 h-12 bg-gradient-to-br from-ness/10 to-ness-600/10 rounded-xl flex items-center justify-center group-hover:from-ness/20 group-hover:to-ness-600/20 transition-all duration-300">
                      <Icon className="w-6 h-6 text-ness" />
                    </div>
                  )}
                  <h3 className="text-xl font-medium text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed font-light text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
