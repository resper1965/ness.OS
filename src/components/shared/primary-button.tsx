import Link from 'next/link';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 transition-colors disabled:pointer-events-none disabled:opacity-60';

/**
 * Spinner para estado de loading em botões.
 */
function Spinner() {
  return (
    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
  );
}

/**
 * Botão primário ness. para ações principais. Suporta loading (disabled + spinner).
 */
export function PrimaryButton({
  href,
  children,
  as = 'link',
  type = 'button',
  className = '',
  loading = false,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  as?: 'link' | 'button';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  /** Desabilita o botão e exibe spinner (apenas para as="button"). */
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const disabled = props.disabled ?? loading;

  if (as === 'link' && href && !loading) {
    const { onClick: _o, ...linkProps } = props;
    return (
      <Link href={href} className={`${baseClass} ${className}`} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { onClick, ...buttonProps } = props;
  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      disabled={disabled}
      aria-busy={loading}
      onClick={onClick}
      {...buttonProps}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
