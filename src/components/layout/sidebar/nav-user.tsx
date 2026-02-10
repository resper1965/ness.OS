'use client';

import { ThemeToggle } from '@/components/app/theme-toggle';
import { UserMenu, type AppUser } from '@/components/app/user-menu';

export type NavUserProps = {
  user: AppUser;
};

/** Rodapé do sidebar: tema + menu do usuário (variante sidebar). */
export function NavUser({ user }: NavUserProps) {
  return (
    <div className="mt-auto shrink-0 flex items-center gap-2 p-3 border-t border-slate-700">
      <ThemeToggle />
      <div className="flex-1 min-w-0">
        <UserMenu user={user} variant="sidebar" />
      </div>
    </div>
  );
}
