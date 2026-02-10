'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { navModules, getAllItems } from '@/lib/nav-config';

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const run = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-slate-400 hover:text-slate-200"
        aria-label="Buscar (Ctrl+K)"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas… (⌘K)" />
        <CommandList>
          <CommandEmpty>Nenhum resultado.</CommandEmpty>
          {navModules.map((mod) => {
            const items = getAllItems(mod);
            if (items.length === 0) return null;
            return (
              <CommandGroup key={mod.id} heading={mod.title}>
                {items.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${item.label} ${mod.title}`}
                    onSelect={() => run(item.href)}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
