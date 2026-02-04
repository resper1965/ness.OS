import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { NessBrand } from '@/components/shared/ness-brand';
import { PageContent } from '@/components/shared/page-content';
import { getWidgetsForRole } from '@/lib/dashboard-widgets';

export default async function AppDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string) || 'employee';
  const widgets = getWidgetsForRole(role);

  return (
    <PageContent>
      <AppPageHeader
        title={
          <>
            Dashboard <NessBrand suffix="OS" />
          </>
        }
        subtitle={
          <>
            Central de gestão do <NessBrand suffix="OS" />. Aqui você organiza operação, vendas, pessoas e financeiro.
          </>
        }
      />

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((w) => (
          <Link
            key={w.key}
            href={w.href}
            className="block min-w-0 rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
          >
            <div className="min-h-[52px] flex flex-col justify-center">
              <h2 className="font-semibold text-white mb-1">{w.title}</h2>
              <p className="text-sm text-slate-400">{w.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 text-sm text-slate-400">
        <strong className="text-slate-300">Fluxo:</strong> Playbooks (ness.OPS) → Serviços (ness.GROWTH) → Contratos (ness.FIN) → Métricas (ness.OPS).
        O site público consome o que você publica aqui.
      </div>
    </PageContent>
  );
}
