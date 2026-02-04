'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Primitivo de loading: bloco animado (pulse) para tabelas e cards.
 * Para TableSkeleton ou variações, use shared/skeleton ou compor com vários Skeleton.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-700/60', className)}
      aria-hidden
      {...props}
    />
  );
}

export { Skeleton };
