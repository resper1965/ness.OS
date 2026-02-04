import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { Feedback360Form } from '@/components/people/feedback-360-form';
import { getFeedback360ScoresBySubject } from '@/app/actions/people';

export default async function PeopleAvaliacaoPage() {
  const supabase = await createClient();
  const [feedbacksRes, profilesRes, scoresBySubject] = await Promise.all([
    supabase
      .from('feedback_360')
      .select('id, criteria, score, comment, created_at, subject_id, rater_id')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('profiles').select('id, full_name').order('full_name'),
    getFeedback360ScoresBySubject(),
  ]);

  const feedbacks = feedbacksRes.data ?? [];
  const profiles = profilesRes.data ?? [];

  const profileNames = new Map(profiles.map((p) => [p.id, p.full_name ?? p.id.slice(0, 8)]));

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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Colaborador</th>
                <th className="px-5 py-4 font-medium">Média</th>
                <th className="px-5 py-4 font-medium">Qtd. avaliações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {scoresBySubject.map((s) => (
                <tr key={s.subject_id} className="text-slate-300">
                  <td className="px-5 py-4">{s.full_name ?? s.subject_id.slice(0, 8)}</td>
                  <td className="px-5 py-4">{s.avg_score.toFixed(2)}</td>
                  <td className="px-5 py-4 text-slate-400">{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {scoresBySubject.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">Nenhum score agregado ainda.</div>
          )}
        </div>
      </PageCard>

      <PageCard title="Últimos feedbacks">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Avaliado</th>
                <th className="px-5 py-4 font-medium">Avaliador</th>
                <th className="px-5 py-4 font-medium">Critério</th>
                <th className="px-5 py-4 font-medium">Score</th>
                <th className="px-5 py-4 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {feedbacks.map((f) => (
                <tr key={f.id} className="text-slate-300">
                  <td className="px-5 py-4">{profileNames.get(f.subject_id) ?? f.subject_id?.slice(0, 8) ?? '-'}</td>
                  <td className="px-5 py-4">{profileNames.get(f.rater_id) ?? f.rater_id?.slice(0, 8) ?? '-'}</td>
                  <td className="px-5 py-4">{f.criteria ?? '-'}</td>
                  <td className="px-5 py-4">{f.score ?? '-'}</td>
                  <td className="px-5 py-4 text-slate-400">{new Date(f.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {feedbacks.length === 0 && (
            <div className="px-4 py-12 text-center text-slate-500">Nenhum feedback registrado.</div>
          )}
        </div>
      </PageCard>
    </PageContent>
  );
}
