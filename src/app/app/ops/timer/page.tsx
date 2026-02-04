import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { TimerUI } from '@/components/ops/timer-ui';
import {
  getClientsForTimer,
  getPlaybooksForTimer,
  getActiveTimer,
  getTimeEntriesToday,
  getTimeEntriesSummaryThisMonth,
} from '@/app/actions/timesheet';

export default async function TimerPage() {
  const [clients, playbooks, activeTimer, timeEntriesToday, summaryThisMonth] = await Promise.all([
    getClientsForTimer(),
    getPlaybooksForTimer(),
    getActiveTimer(),
    getTimeEntriesToday(),
    getTimeEntriesSummaryThisMonth(),
  ]);

  return (
    <PageContent>
      <AppPageHeader
        title="Timer"
        subtitle="Registre horas por cliente/contrato/playbook. Inicie e pare o timer; os registros alimentam métricas e rentabilidade."
      />
      <PageCard>
        <TimerUI
          clients={clients}
          playbooks={playbooks}
          activeTimer={activeTimer}
          timeEntriesToday={timeEntriesToday}
          summaryThisMonth={summaryThisMonth}
        />
      </PageCard>
    </PageContent>
  );
}
