'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generatePostFromCase } from '@/app/actions/ai';

type Props = { caseId: string };

export function CaseToPostButton({ caseId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      const r = await generatePostFromCase(caseId);
      if (r.success) {
        router.push(`/app/growth/posts/${r.postId}`);
      } else {
        setError(r.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-md border border-ness/50 px-4 py-2 text-sm font-medium text-ness hover:bg-ness/10 disabled:opacity-50"
      >
        {loading ? 'Transformando...' : 'Transformar Case em Post'}
      </button>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      <p className="text-xs text-slate-500 mt-1">
        Cria um rascunho de post a partir dos dados brutos. Você pode editar antes de publicar.
      </p>
    </div>
  );
}
