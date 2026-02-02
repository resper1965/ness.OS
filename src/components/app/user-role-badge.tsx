'use client';

import { useRole } from './role-provider';

/** Módulo de usuário no canto direito do header da página. Exibe Role quando disponível. */
export function UserRoleBadge() {
  const role = useRole();

  return (
    <div className="flex items-center rounded-md border border-slate-600 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300">
      <span className="text-slate-500">Role:</span>
      <span className="ml-2 text-ness">{role ?? '—'}</span>
    </div>
  );
}
