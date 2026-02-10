import { NextResponse } from 'next/server';
import { syncOmieRevenueSnapshot } from '@/app/actions/data';

/**
 * Cron: sincroniza snapshot de faturamento Omie para o mês anterior.
 * Persiste em erp_revenue_snapshot para que reconciliação, relatório Omie, CFO e GROWTH leiam da base.
 * Plano: docs/PLANO-GESTAO-DADOS-PERSISTENCIA.md (Fase 1).
 *
 * Segurança: exige Authorization: Bearer <CRON_SECRET> ou header x-cron-secret.
 * Exemplo vercel.json: "crons": [{ "path": "/api/cron/sync-omie-revenue", "schedule": "0 2 1 * *" }]
 * (dia 1 de cada mês às 02:00 — sync do mês anterior)
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

  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const period = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;

  try {
    const result = await syncOmieRevenueSnapshot(period);
    if (result.error) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      period,
      recordCount: result.recordCount ?? 0,
      message: `Snapshot Omie para ${period}: ${result.recordCount ?? 0} cliente(s).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao sincronizar snapshot Omie.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
