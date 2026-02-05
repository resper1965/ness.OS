'use client';

import { ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/app/actions/auth';
import { cn } from '@/lib/utils';

export type AppUser = {
  email: string;
  name: string;
  avatarUrl?: string | null;
};

/** Variante de exibição: header = avatar compacto; sidebar = bloco com avatar + nome + email */
export type UserMenuVariant = 'header' | 'sidebar';

const TRIGGER_PADDING = 'px-3 py-2.5';

function getInitials(name: string, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'U';
}

/** Conteúdo do dropdown (compartilhado entre header e sidebar). */
function UserMenuDropdownContent({ user, initial }: { user: AppUser; initial: string }) {
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback className="rounded-full bg-slate-600 text-xs text-slate-200">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate font-medium text-slate-200">{user.name}</span>
            <span className="truncate text-xs text-slate-400">{user.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/app" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Início
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <form action={signOut} className="w-full">
          <button type="submit" className="flex w-full items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </DropdownMenuItem>
    </>
  );
}

/**
 * Menu de usuário (avatar + dropdown). Usado no header e na sidebar com o mesmo
 * componente e recursos; variant define apenas o layout do trigger.
 */
export function UserMenu({
  user,
  variant = 'header',
}: {
  user: AppUser | null;
  variant?: UserMenuVariant;
}) {
  if (!user) return null;

  const initial = getInitials(user.name, user.email);

  const trigger =
    variant === 'header' ? (
      <button
        type="button"
        className="flex shrink-0 items-center rounded-full outline-none ring-2 ring-transparent focus:ring-slate-500"
        aria-label="Menu do usuário"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback className="rounded-full bg-slate-600 text-xs text-slate-200">
            {initial}
          </AvatarFallback>
        </Avatar>
      </button>
    ) : (
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-3 rounded-md text-left text-sm transition-colors',
          TRIGGER_PADDING,
          'hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none'
        )}
        aria-label="Menu do usuário"
      >
        <Avatar className="h-9 w-9 shrink-0 rounded-full">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback className="rounded-full bg-slate-600 text-sm text-slate-200">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="grid min-w-0 flex-1 leading-tight">
          <span className="truncate font-medium text-slate-200">{user.name}</span>
          <span className="truncate text-xs text-slate-400">{user.email}</span>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
      </button>
    );

  const contentProps =
    variant === 'sidebar'
      ? { side: 'top' as const, align: 'end' as const, sideOffset: 8 }
      : { align: 'end' as const };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" {...contentProps}>
        <UserMenuDropdownContent user={user} initial={initial} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
