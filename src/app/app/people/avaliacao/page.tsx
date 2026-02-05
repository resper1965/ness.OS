import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { Feedback360Form } from '@/components/people/feedback-360-form';
import { getFeedback360ScoresBySubject } from '@/app/actions/people';

type ScoreRow = {
  subject_id: string;
  full_name: string | null;
  avg_score: number;
  count: number;
};

type FeedbackRow = {
  id: string;
  subject_id: string;
  rater_id: string;
  criteria: string | null;
  score: number | null;
  created_at: string;
};

export default async function PeopleAvaliacaoPage() {
  const supabase = await getServerClient();
  const [feedbacksRes, profilesRes, scoresBySubject] = await Promise.all([
    supabase
      .from('feedback_360')
      .select('id, criteria, score, comment, created_at, subject_id, rater_id')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('profiles').select('id, full_name').order('full_name'),
    getFeedback360ScoresBySubject(),
  ]);

  const feedbacks = (feedbacksRes.data ?? []) as FeedbackRow[];
  const profiles = profilesRes.data ?? [];
  const profileNames = new Map(profiles.map((p) => [p.id, p.full_name ?? p.id.slice(0, 8)]));
  const scores = scoresBySubject as ScoreRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Avaliação 360º"
        subtitle="Feedback contínuo e scores por colaborador. Registre feedback e consulte a média agregada."
      />
      <PageCard title="Novo feedback" className="mb-6">
        <Feedback360Form profiles={profiles} />
      </PageCard>

      <PageCard title="Média por colaborador" className="mb-6">
        <DataTable<ScoreRow>
          data={scores}
          keyExtractor={(row) => row.subject_id}
          emptyMessage="Nenhum score agregado ainda"
          emptyDescription="Registre feedbacks no formulário acima. A média por colaborador aparecerá aqui. Avaliação 360º: feedback contínuo e scores por colaborador."
          columns={[
            {
              key: 'full_name',
              header: 'Colaborador',
              render: (row) => row.full_name ?? row.subject_id.slice(0, 8),
            },
            {
              key: 'avg_score',
              header: 'Média',
              render: (row) => row.avg_score.toFixed(2),
            },
            {
              key: 'count',
              header: 'Qtd. avaliações',
              render: (row) => <span className="text-slate-400">{row.count}</span>,
            },
          ]}
        />
      </PageCard>

      <PageCard title="Últimos feedbacks">
        <DataTable<FeedbackRow>
          data={feedbacks}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum feedback registrado"
          emptyDescription="Use o formulário &quot;Novo feedback&quot; para registrar avaliações 360º. Últimos feedbacks aparecerão nesta tabela."
          columns={[
            {
              key: 'subject_id',
              header: 'Avaliado',
              render: (row) => profileNames.get(row.subject_id) ?? row.subject_id?.slice(0, 8) ?? '-',
            },
            {
              key: 'rater_id',
              header: 'Avaliador',
              render: (row) => profileNames.get(row.rater_id) ?? row.rater_id?.slice(0, 8) ?? '-',
            },
            {
              key: 'criteria',
              header: 'Critério',
              render: (row) => row.criteria ?? '-',
            },
            {
              key: 'score',
              header: 'Score',
              render: (row) => row.score ?? '-',
            },
            {
              key: 'created_at',
              header: 'Data',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.created_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
