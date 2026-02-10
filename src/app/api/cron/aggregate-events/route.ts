import { NextResponse } from 'next/server';
import { aggregateModuleEventsForPeriod } from '@/app/actions/data';

/**
 * Cron: agrega module_events do dia anterior em event_aggregates (acontecimentos).
 * Plano: .context/plans/persistencia-massa-indices-acontecimentos.md
 *
 * Segurança: exige CRON_SECRET.
 * Exemplo vercel.json: "crons": [{ "path": "/api/cron/aggregate-events", "schedule": "0 3 * * *" }]
 * (diário às 03:00 — agregação de ontem)
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

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const period = yesterday.toISOString().slice(0, 10);

  try {
    const result = await aggregateModuleEventsForPeriod(period);
    if (result.error) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      period,
      rowsAffected: result.rowsAffected ?? 0,
      message: `Eventos agregados para ${period}: ${result.rowsAffected ?? 0} grupo(s).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao agregar eventos.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
