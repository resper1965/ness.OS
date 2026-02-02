import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/app/app-sidebar';

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

  return (
    <div className="flex min-h-screen bg-slate-900">
      <AppSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
