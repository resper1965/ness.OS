import Link from 'next/link';

/**
 * Botão primário ness. para ações principais.
 */
export function PrimaryButton({
  href,
  children,
  as = 'link',
  type = 'button',
  className = '',
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  as?: 'link' | 'button';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  const baseClass =
    'inline-flex items-center justify-center rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 transition-colors';

  if (as === 'link' && href) {
    return (
      <Link href={href} className={`${baseClass} ${className}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
