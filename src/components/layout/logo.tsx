'use client';

import Link from 'next/link';
import { NessBrand } from '@/components/shared/ness-brand';
import { cn } from '@/lib/utils';

type LayoutLogoProps = {
  suffix?: string;
  compact?: boolean;
  className?: string;
};

export function LayoutLogo({ suffix = 'OS', compact, className }: LayoutLogoProps) {
  if (compact) {
    return (
      <Link
        href="/app"
        className={cn('flex items-center justify-center text-white hover:text-ness transition-colors', className)}
        title="ness.OS"
      >
        <span className="text-lg font-semibold brand-dot">n</span>
      </Link>
    );
  }
  return (
    <Link
      href="/app"
      className={cn('flex items-center text-lg font-semibold text-white hover:text-ness transition-colors', className)}
    >
      <NessBrand suffix={suffix} />
    </Link>
  );
}
