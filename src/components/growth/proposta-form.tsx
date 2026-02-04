'use client';

import { useState } from 'react';
import { gerarPropostaPDF } from './proposta-pdf';
import { generateProposalWithAI } from '@/app/actions/ai';

type Props = {
  clients: { id: string; name: string }[];
  services: { id: string; name: string }[];
};

export function PropostaForm({ clients, services }: Props) {
  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [escopo, setEscopo] = useState('');
  const [termos, setTermos] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';

  async function handleGerarComIA() {
    if (!cliente || !servico) {
      setAiError('Selecione cliente e serviço primeiro.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    try {
      const r = await generateProposalWithAI(cliente, servico);
      if (r.success) {
        setEscopo(r.minuta.escopo);
        setTermos(r.minuta.termos);
      } else {
        setAiError(r.error);
      }
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const c = clients.find((x) => x.id === cliente)?.name ?? cliente;
    const s = services.find((x) => x.id === servico)?.name ?? servico;
    if (!c || !s || !valor) return;
    setLoading(true);
    try {
      await gerarPropostaPDF(c, s, valor, escopo || undefined, termos || undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-4 rounded-lg border border-slate-700 p-6">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Cliente</label>
        <select
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Selecione</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Serviço</label>
        <select
          value={servico}
          onChange={(e) => setServico(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Selecione</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Valor mensal (R$)</label>
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          required
          className={inputClass}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGerarComIA}
          disabled={aiLoading}
          className="rounded-md border border-ness/50 px-4 py-2 text-sm font-medium text-ness hover:bg-ness/10 disabled:opacity-50"
        >
          {aiLoading ? 'Gerando...' : 'Gerar com IA'}
        </button>
        {aiError && <span className="text-sm text-red-400">{aiError}</span>}
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Escopo técnico</label>
        <textarea
          value={escopo}
          onChange={(e) => setEscopo(e.target.value)}
          rows={5}
          className={inputClass + ' resize-y'}
          placeholder="Escopo da proposta (ou use Gerar com IA)"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Termos comerciais</label>
        <textarea
          value={termos}
          onChange={(e) => setTermos(e.target.value)}
          rows={4}
          className={inputClass + ' resize-y'}
          placeholder="Termos (ou use Gerar com IA)"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 disabled:opacity-50"
      >
        {loading ? 'Gerando...' : 'Gerar PDF'}
      </button>
    </form>
  );
}
