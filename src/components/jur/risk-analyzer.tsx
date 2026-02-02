'use client';

import { useState } from 'react';

type Clause = { type: string; excerpt: string; severity: string; suggestion: string };

export function RiskAnalyzer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [clauses, setClauses] = useState<Clause[] | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setClauses(null);
    try {
      const res = await fetch('/api/jur/risk/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = res.ok ? await res.json() : { clauses: [] };
      setClauses(data.clauses ?? []);
    } catch {
      setClauses([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white font-mono"
        placeholder="Cole o texto da minuta..."
      />
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 disabled:opacity-50"
      >
        {loading ? 'Analisando...' : 'Analisar com IA'}
      </button>
      {clauses !== null && (
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <h3 className="font-semibold text-white p-4 bg-slate-800/50">
            {clauses.length === 0 ? 'Nenhuma cláusula de risco' : `${clauses.length} cláusula(s) encontrada(s)`}
          </h3>
          <div className="divide-y divide-slate-700">
            {clauses.map((c, i) => (
              <div key={i} className="p-4">
                <span className={`rounded px-2 py-0.5 text-xs ${c.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-slate-600 text-slate-300'}`}>
                  {c.severity}
                </span>
                <span className="ml-2 text-sm font-medium text-slate-300">{c.type}</span>
                <p className="text-sm text-slate-400 mt-2">&quot;{c.excerpt}&quot;</p>
                <p className="text-xs text-ness mt-1">{c.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
