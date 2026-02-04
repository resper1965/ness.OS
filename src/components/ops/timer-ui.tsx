'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getContractsByClient,
  getPlaybooksForTimer,
  startTimer,
  stopTimer,
  updateTimeEntry,
} from '@/app/actions/timesheet';

type Client = { id: string; name: string };
type Contract = { id: string; mrr: number; start_date: string | null; end_date: string | null };
type Playbook = { id: string; title: string };
type ActiveTimer = {
  id: string;
  contract_id: string;
  playbook_id: string | null;
  started_at: string;
  contracts?: { clients?: { name: string } | null } | null;
  playbooks?: { title: string } | null;
} | null;
type Entry = {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  notes: string | null;
  contracts?: { clients?: { name: string } | null } | null;
  playbooks?: { title: string } | null;
};
type SummaryRow = { contract_id: string; client_name: string | null; month: string; total_minutes: number; total_hours: number };

export function TimerUI({
  clients,
  playbooks,
  activeTimer: initialActiveTimer,
  timeEntriesToday,
  summaryThisMonth,
}: {
  clients: Client[];
  playbooks: Playbook[];
  activeTimer: ActiveTimer;
  timeEntriesToday: Entry[];
  summaryThisMonth: SummaryRow[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [contractId, setContractId] = useState('');
  const [playbookId, setPlaybookId] = useState('');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editEndedAt, setEditEndedAt] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const editModalFirstInputRef = useRef<HTMLInputElement>(null);
  const activeTimer = initialActiveTimer;

  const closeEditModal = useCallback(() => {
    setEditingEntry(null);
    setEditEndedAt('');
    setEditNotes('');
  }, []);

  const openEditModal = useCallback((entry: Entry) => {
    setEditingEntry(entry);
    setEditEndedAt(entry.ended_at ? entry.ended_at.slice(0, 16) : '');
    setEditNotes(entry.notes ?? '');
  }, []);

  useEffect(() => {
    if (!editingEntry) return;
    editModalFirstInputRef.current?.focus();
  }, [editingEntry]);

  useEffect(() => {
    if (!editingEntry) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEditModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingEntry, closeEditModal]);

  useEffect(() => {
    if (!clientId) {
      setContracts([]);
      setContractId('');
      return;
    }
    setLoadingContracts(true);
    setContractId('');
    getContractsByClient(clientId)
      .then(setContracts)
      .finally(() => setLoadingContracts(false));
  }, [clientId]);

  useEffect(() => {
    if (!activeTimer?.started_at) return;
    const started = new Date(activeTimer.started_at).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - started) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeTimer?.id, activeTimer?.started_at]);

  const handleStart = useCallback(async () => {
    if (!contractId) return;
    setStarting(true);
    try {
      const res = await startTimer(contractId, playbookId || null);
      if (res.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    } finally {
      setStarting(false);
    }
  }, [contractId, playbookId, router]);

  const handleStop = useCallback(async () => {
    if (!activeTimer?.id) return;
    setStopping(true);
    try {
      const res = await stopTimer(activeTimer.id);
      if (res.error) {
        alert(res.error);
        return;
      }
      router.refresh();
    } finally {
      setStopping(false);
    }
  }, [activeTimer?.id, router]);

  const handleSaveEdit = useCallback(async () => {
    if (!editingEntry) return;
    setSavingEdit(true);
    try {
      const originalEndedAt = editingEntry.ended_at ? editingEntry.ended_at.slice(0, 16) : '';
      const payload: { ended_at?: string | null; notes?: string | null } = {};
      if (editEndedAt !== originalEndedAt) {
        payload.ended_at = editEndedAt ? new Date(editEndedAt).toISOString() : null;
      }
      if (editNotes !== (editingEntry.notes ?? '')) payload.notes = editNotes.trim() || null;
      if (Object.keys(payload).length === 0) {
        closeEditModal();
        return;
      }
      const res = await updateTimeEntry(editingEntry.id, payload);
      if (res.error) {
        alert(res.error);
        return;
      }
      closeEditModal();
      router.refresh();
    } finally {
      setSavingEdit(false);
    }
  }, [editingEntry, editEndedAt, editNotes, closeEditModal, router]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':');
  };

  const clientName = activeTimer?.contracts?.clients?.name ?? '-';
  const playbookTitle = activeTimer?.playbooks?.title;

  return (
    <div className="flex flex-col gap-6">
      {activeTimer ? (
        <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <p className="mb-2 text-sm text-slate-400">Em andamento</p>
          <p className="font-medium text-slate-200">
            {clientName}
            {playbookTitle ? ` · ${playbookTitle}` : ''}
          </p>
          <p className="mt-2 text-3xl font-mono tabular-nums text-green-400">{formatElapsed(elapsed)}</p>
          <button
            type="button"
            onClick={handleStop}
            disabled={stopping}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {stopping ? 'Parando...' : 'Parar'}
          </button>
        </section>
      ) : (
        <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <p className="mb-3 text-sm text-slate-400">Cliente · Contrato · Playbook (opcional)</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-200"
            >
              <option value="">Cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              disabled={!clientId || loadingContracts}
              className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-200 disabled:opacity-50"
            >
              <option value="">Contrato</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  MRR R$ {Number(c.mrr).toLocaleString('pt-BR')}
                </option>
              ))}
            </select>
            <select
              value={playbookId}
              onChange={(e) => setPlaybookId(e.target.value)}
              className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-200"
            >
              <option value="">Playbook (opcional)</option>
              {playbooks.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleStart}
              disabled={!contractId || starting}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
            >
              {starting ? 'Iniciando...' : 'Iniciar'}
            </button>
          </div>
        </section>
      )}

      {summaryThisMonth.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-400">Seu resumo do mês</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Horas</th>
                  <th className="px-4 py-3 font-medium">Minutos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-300">
                {summaryThisMonth.map((row) => (
                  <tr key={row.contract_id}>
                    <td className="px-4 py-3">{row.client_name ?? '-'}</td>
                    <td className="px-4 py-3">{Number(row.total_hours).toFixed(2)} h</td>
                    <td className="px-4 py-3">{Number(row.total_minutes).toFixed(0)} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-medium text-slate-400">Hoje</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Cliente / Playbook</th>
                <th className="px-4 py-3 font-medium">Início</th>
                <th className="px-4 py-3 font-medium">Fim</th>
                <th className="px-4 py-3 font-medium">Duração</th>
                <th className="px-4 py-3 font-medium">Observações</th>
                <th className="px-4 py-3 font-medium w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-300">
              {timeEntriesToday.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3">
                    {e.contracts?.clients?.name ?? '-'}
                    {e.playbooks?.title ? ` · ${e.playbooks.title}` : ''}
                  </td>
                  <td className="px-4 py-3">{new Date(e.started_at).toLocaleTimeString('pt-BR')}</td>
                  <td className="px-4 py-3">{e.ended_at ? new Date(e.ended_at).toLocaleTimeString('pt-BR') : '-'}</td>
                  <td className="px-4 py-3">{e.duration_minutes != null ? `${Number(e.duration_minutes).toFixed(1)} min` : '-'}</td>
                  <td className="max-w-[12rem] truncate px-4 py-3 text-slate-500" title={e.notes ?? undefined}>
                    {e.notes ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(e)}
                      className="rounded border border-slate-600 bg-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600"
                    >
                      Corrigir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {timeEntriesToday.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">Nenhum registro hoje.</div>
          )}
        </div>
      </section>

      {editingEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-entry-title"
          onClick={(e) => e.target === e.currentTarget && closeEditModal()}
        >
          <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-xl">
            <h2 id="edit-entry-title" className="mb-3 text-sm font-medium text-slate-200">
              Corrigir registro — {editingEntry.contracts?.clients?.name ?? '-'}
            </h2>
            <p className="mb-3 text-xs text-slate-500">
              Início: {new Date(editingEntry.started_at).toLocaleString('pt-BR')}
            </p>
            <div className="mb-3">
              <label className="mb-1 block text-xs text-slate-400">Fim (data/hora) — deixe vazio para limpar</label>
              <input
                ref={editModalFirstInputRef}
                type="datetime-local"
                value={editEndedAt}
                onChange={(e) => setEditEndedAt(e.target.value)}
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-200"
                aria-describedby="edit-ended-hint"
              />
              <span id="edit-ended-hint" className="sr-only">
                Deixe vazio para remover o horário de fim do registro
              </span>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs text-slate-400">Observações</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-200"
                placeholder="Ex.: reunião de alinhamento"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
              >
                {savingEdit ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
