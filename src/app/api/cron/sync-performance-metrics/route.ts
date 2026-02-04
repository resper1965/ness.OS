import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';

/**
 * Cron: agrega time_entries por contract_id + mês e atualiza performance_metrics.hours_worked.
 * Plano: .context/plans/mobile-timesheet-timer.md (fase 2).
 *
 * Segurança: exige Authorization: Bearer <CRON_SECRET> ou header x-cron-secret.
 * Configurar CRON_SECRET no Vercel (ou env) e chamar este endpoint via Vercel Cron ou externo.
 *
 * Exemplo vercel.json:
 *   "crons": [{ "path": "/api/cron/sync-performance-metrics", "schedule": "0 2 * * *" }]
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const headerSecret = request.headers.get('x-cron-secret');

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET não configurado.' },
      { status: 500 }
    );
  }

  const provided = bearer ?? headerSecret;
  if (provided !== secret) {
    return NextResponse.json(
      { error: 'Não autorizado.' },
      { status: 401 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc('sync_performance_metrics_from_time_entries');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const count = Array.isArray(data) ? data.length : 0;
    return NextResponse.json({
      ok: true,
      updated: count,
      message: `${count} registro(s) de performance_metrics atualizado(s) a partir do timer.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao sincronizar.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
