'use client';

import { useState } from 'react';
import { gerarPropostaPDF } from './proposta-pdf';

type Props = {
  clients: { id: string; name: string }[];
  services: { id: string; name: string }[];
};

export function PropostaForm({ clients, services }: Props) {
  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const c = clients.find((x) => x.id === cliente)?.name ?? cliente;
    const s = services.find((x) => x.id === servico)?.name ?? servico;
    if (!c || !s || !valor) return;
    setLoading(true);
    try {
      await gerarPropostaPDF(c, s, valor);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6">
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
