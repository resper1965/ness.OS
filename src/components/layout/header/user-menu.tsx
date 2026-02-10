'use client';

import { UserMenu as AppUserMenu, type AppUser } from '@/components/app/user-menu';

export type { AppUser };

/** Menu do usuário no header (reutiliza UserMenu do app). */
export function HeaderUserMenu({ user }: { user: AppUser }) {
  return <AppUserMenu user={user} />;
}
