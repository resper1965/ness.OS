'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { navModules, getAllItems, type NavModule, type NavItem } from '@/lib/nav-config';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const MENU_ITEM_PADDING = 'px-3 py-2.5';

function isItemActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  if (item.href !== '/app' && pathname.startsWith(item.href + '/')) return true;
  return false;
}

function CollapsibleGroup({
  module: mod,
  isOpen,
  onToggle,
  pathname,
  onNavigate,
}: {
  module: NavModule;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isInicio = mod.id === 'inicio';

  if (isInicio) {
    const item = mod.items![0];
    return (
      <div className="space-y-1">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'block rounded-md text-sm font-medium transition-colors',
            MENU_ITEM_PADDING,
            pathname === item.href
              ? 'bg-slate-700/50 text-white'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          )}
        >
          {item.label}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between rounded-md text-left text-xs font-semibold uppercase tracking-wider transition-colors',
          MENU_ITEM_PADDING,
          'text-slate-500 hover:bg-slate-700/30 hover:text-slate-400'
        )}
      >
        <span>{mod.title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
      </button>
      {isOpen && (
        <div className="mt-2 space-y-3">
          {mod.areas ? (
            mod.areas.map((area) => (
              <div key={area.id}>
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {area.title}
                </div>
                <div className="space-y-1">
                  {area.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'block rounded-md text-sm font-medium transition-colors',
                        MENU_ITEM_PADDING,
                        isItemActive(pathname, item)
                          ? 'bg-slate-700/50 text-white'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            mod.items!.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'block rounded-md text-sm font-medium transition-colors',
                  MENU_ITEM_PADDING,
                  isItemActive(pathname, item)
                    ? 'bg-slate-700/50 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export type NavMainProps = {
  onNavigate?: () => void;
};

/** Navegação principal do sidebar — módulos e áreas a partir de nav-config. */
export function NavMain({ onNavigate }: NavMainProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const path = pathname ?? '';
    const open = new Set<string>();
    for (const mod of navModules) {
      if (getAllItems(mod).some((i) => isItemActive(path, i))) {
        open.add(mod.title);
        return open;
      }
    }
    open.add('Início');
    return open;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.clear();
        next.add(title);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col gap-3 p-5">
          {navModules.map((mod) => (
          <CollapsibleGroup
            key={mod.id}
            module={mod}
            isOpen={openGroups.has(mod.title)}
            onToggle={() => toggleGroup(mod.title)}
            pathname={pathname ?? ''}
            onNavigate={onNavigate}
          />
        ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
