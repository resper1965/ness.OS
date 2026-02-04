import Link from "next/link";

type HeroSectionProps = {
  title: string | React.ReactNode;
  subtitle?: string;
  countries?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: "full" | "compact";
  className?: string;
};

const bgPattern =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ade8' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export function HeroSection({
  title,
  subtitle,
  countries,
  description,
  primaryCta,
  secondaryCta,
  variant = "full",
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 " +
        (variant === "full" ? "min-h-[70vh] pt-32 pb-24 " : "py-24 ") +
        className
      }
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: bgPattern }}
      />
      <div className="absolute top-20 left-10 w-32 h-32 bg-ness/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-ness/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-100 leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-2xl md:text-3xl text-slate-300 font-light leading-relaxed max-w-4xl mx-auto">
              {subtitle}
            </p>
          )}
          {countries && (
            <p className="text-sm md:text-base text-slate-500 font-medium tracking-wide uppercase">
              {countries}
            </p>
          )}
          {description && (
            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-4xl mx-auto">
              {description}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center rounded-md bg-ness px-6 py-3 text-base font-medium text-white hover:bg-ness-600 transition-colors"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-md border border-slate-600 px-6 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-ness transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
