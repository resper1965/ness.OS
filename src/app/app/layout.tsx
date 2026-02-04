import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppHeader } from '@/components/app/app-header';
import { RoleProvider } from '@/components/app/role-provider';
import { SidebarProvider, SidebarInset } from '@/components/app/sidebar-context';
import { TooltipProvider } from '@/components/ui/tooltip';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/app');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string) ?? null;

  return (
    <RoleProvider role={role}>
      <TooltipProvider delayDuration={200} skipDelayDuration={0}>
        <SidebarProvider>
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-16 rounded-md bg-ness px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Ir para o conteúdo
          </a>
          <div className="flex min-h-screen bg-slate-900">
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <AppHeader />
              <main id="main-content" className="min-w-0 flex-1 p-8" tabIndex={-1}>
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </RoleProvider>
  );
}
