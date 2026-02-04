'use client';

import Link from 'next/link';

type Contract = { id: string; clients: { name?: string } | { name?: string }[] | null };

type Props = { contracts: Contract[]; currentContractId?: string };

function getClientName(c: Contract): string {
  const clients = c.clients;
  if (!clients) return 'Sem cliente';
  const name = Array.isArray(clients) ? (clients[0] as { name?: string })?.name : (clients as { name?: string })?.name;
  return name ?? 'Sem nome';
}

export function VagasContractFilter({ contracts, currentContractId }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400">Filtrar por contrato:</span>
      <Link
        href="/app/people/vagas"
        className={`rounded-md px-3 py-1.5 text-sm ${!currentContractId ? 'bg-ness text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
      >
        Todos
      </Link>
      {contracts.map((c) => {
        const isActive = currentContractId === c.id;
        return (
          <Link
            key={c.id}
            href={`/app/people/vagas?contract_id=${c.id}`}
            className={`rounded-md px-3 py-1.5 text-sm truncate max-w-[180px] ${isActive ? 'bg-ness text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            title={getClientName(c)}
          >
            {getClientName(c)}
          </Link>
        );
      })}
    </div>
  );
}
