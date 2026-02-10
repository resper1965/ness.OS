'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notifications } from './data';

export function HeaderNotifications() {
  const unread = notifications.filter((n) => !n.read);
  const hasUnread = unread.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-slate-400 hover:text-slate-200"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ness text-[10px] font-medium text-white">
              {unread.length > 9 ? '9+' : unread.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        {notifications.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-slate-500">Nenhuma notificação.</div>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <DropdownMenuItem key={n.id} asChild>
              {n.href ? (
                <Link href={n.href} className="flex flex-col gap-0.5">
                  <span className={n.read ? 'font-normal text-slate-300' : 'font-medium text-slate-200'}>
                    {n.title}
                  </span>
                  {n.description && <span className="text-xs text-slate-500">{n.description}</span>}
                </Link>
              ) : (
                <span className="flex flex-col gap-0.5">
                  <span className={n.read ? 'font-normal text-slate-300' : 'font-medium text-slate-200'}>
                    {n.title}
                  </span>
                  {n.description && <span className="text-xs text-slate-500">{n.description}</span>}
                </span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
