/** Componente para branding ness. — o ponto é parte da marca (text-ness). */

type NessBrandProps = {
  /** Sufixo após o ponto, ex: "OS", "GROWTH" */
  suffix?: string;
  /** Apenas "ness." sem sufixo */
  dotOnly?: boolean;
  className?: string;
};

export function NessBrand({ suffix, dotOnly, className = '' }: NessBrandProps) {
  if (dotOnly) {
    return (
      <span className={className}>
        ness<span className="text-ness">.</span>
      </span>
    );
  }
  return (
    <span className={className}>
      ness<span className="text-ness">.</span>
      {suffix ?? ''}
    </span>
  );
}
