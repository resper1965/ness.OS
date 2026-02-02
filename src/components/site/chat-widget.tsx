'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const publicTransport = new DefaultChatTransport({ api: '/api/chat/public' });

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: publicTransport,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'streaming') return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ness text-white shadow-lg hover:bg-ness-600 transition-colors"
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-lg border border-slate-700 bg-slate-900 shadow-xl flex flex-col max-h-[500px]">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Chat ness.</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.length === 0 && (
              <p className="text-slate-500 text-sm">
                Olá! Pergunte sobre nossos serviços e soluções.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg text-sm ${
                  m.role === 'user'
                    ? 'bg-ness/20 text-white ml-4'
                    : 'bg-slate-800 text-slate-200 mr-4'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {m.parts?.map((part: { type: string; text?: string }, i: number) =>
                    part.type === 'text' ? <span key={i}>{part.text}</span> : null
                  )}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Sua pergunta..."
                className="flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ness"
                disabled={status === 'streaming'}
              />
              <button
                type="submit"
                disabled={status === 'streaming'}
                className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 disabled:opacity-50"
              >
                {status === 'streaming' ? '...' : 'Enviar'}
              </button>
            </div>
            <Link
              href="/contato"
              className="mt-2 block text-center text-xs text-ness hover:underline"
            >
              Falar com a gente →
            </Link>
          </form>
        </div>
      )}
    </>
  );
}
