import { createClient } from '@/lib/supabase/server';

export default async function PeopleAvaliacaoPage() {
  const supabase = await createClient();
  const { data: feedbacks } = await supabase
    .from('feedback_360')
    .select('id, criteria, score, comment, created_at, subject_id, rater_id')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Avaliação 360º</h1>
      <p className="text-slate-400 mb-6">
        Feedback contínuo e scores por colaborador.
      </p>
      <div className="rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Avaliado</th>
              <th className="px-4 py-3 font-medium">Avaliador</th>
              <th className="px-4 py-3 font-medium">Critério</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(feedbacks ?? []).map((f) => (
              <tr key={f.id} className="text-slate-300">
                <td className="px-4 py-3">{f.subject_id?.slice(0, 8) ?? '-'}</td>
                <td className="px-4 py-3">{f.rater_id?.slice(0, 8) ?? '-'}</td>
                <td className="px-4 py-3">{f.criteria ?? '-'}</td>
                <td className="px-4 py-3">{f.score ?? '-'}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(f.created_at).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!feedbacks || feedbacks.length === 0) && (
          <div className="px-4 py-12 text-center text-slate-500">
            Nenhum feedback registrado.
          </div>
        )}
      </div>
    </div>
  );
}
