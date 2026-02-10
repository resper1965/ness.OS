import { NextResponse } from 'next/server';
import { computeDataIndices } from '@/app/actions/data';

/**
 * Cron: calcula índices derivados (leads_mes, contratos_ativos, mrr_total) para o mês anterior.
 * Plano: .context/plans/persistencia-massa-indices-acontecimentos.md (Phase 2)
 *
 * Segurança: exige CRON_SECRET.
 * Exemplo vercel.json: "crons": [{ "path": "/api/cron/compute-data-indices", "schedule": "0 4 1 * *" }]
 * (dia 1 do mês às 04:00 — índices do mês anterior)
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

  const prevMonth = new Date();
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  const period = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;

  try {
    const result = await computeDataIndices(period);
    if (result.error) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      period,
      saved: result.saved ?? 0,
      message: `Índices para ${period}: ${result.saved ?? 0} registro(s).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao calcular índices.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
