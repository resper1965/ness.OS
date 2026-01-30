'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Link from 'next/link';
import { useState } from 'react';

const playbooksTransport = new DefaultChatTransport({ api: '/api/chat/playbooks' });

export default function PlaybooksChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: playbooksTransport,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'streaming') return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/app/ops/playbooks"
          className="text-slate-400 hover:text-white text-sm"
        >
          ← Playbooks
        </Link>
        <h1 className="text-xl font-bold text-white">
          Internal Knowledge Bot
        </h1>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Pergunte sobre procedimentos dos playbooks. Ex: &quot;Como configuro o backup?&quot;
      </p>

      <div className="space-y-4 mb-6 min-h-[200px]">
        {messages.length === 0 && (
          <p className="text-slate-500 text-sm">Nenhuma mensagem ainda. Faça uma pergunta.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-lg ${
              m.role === 'user'
                ? 'bg-ness/20 text-white ml-8'
                : 'bg-slate-800 text-slate-200 mr-8'
            }`}
          >
            <div className="text-xs text-slate-500 mb-1 uppercase">{m.role}</div>
            <div className="whitespace-pre-wrap">
              {m.parts?.map((part: { type: string; text?: string }, i: number) =>
                part.type === 'text' ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sua pergunta..."
          className="flex-1 rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ness"
          disabled={status === 'streaming'}
        />
        <button
          type="submit"
          disabled={status === 'streaming'}
          className="rounded-md bg-ness px-4 py-2 text-white font-medium hover:bg-ness-600 disabled:opacity-50"
        >
          {status === 'streaming' ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
