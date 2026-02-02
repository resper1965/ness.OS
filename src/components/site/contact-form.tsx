"use client";

import { useFormState } from "react-dom";
import { submitLead } from '@/app/actions/growth';

const initialState: { success?: boolean; error?: string } = {};

const inputClass =
  "w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness focus-visible:border-ness";

export function ContactForm() {
  const [state, formAction] = useFormState(submitLead, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-300">
          Nome *
        </label>
        <input
          id="name"
          name="name"
          required
          className={inputClass}
          placeholder="João Silva"
        />
        <p className="text-xs text-slate-500 mt-1">Seu nome ou da pessoa responsável.</p>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
          E-mail *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="joao@empresa.com.br"
        />
        <p className="text-xs text-slate-500 mt-1">Usaremos para responder sua mensagem.</p>
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-2 text-slate-300">
          Empresa
        </label>
        <input id="company" name="company" className={inputClass} placeholder="ness. Tecnologia" />
        <p className="text-xs text-slate-500 mt-1">Opcional — ajuda na triagem.</p>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-slate-300">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Gostaria de conhecer a solução de SecOps. Podemos agendar uma apresentação?"
        />
        <p className="text-xs text-slate-500 mt-1">Descreva como podemos ajudar. Se for proposta, inclua porte da empresa e necessidade.</p>
      </div>
      <input type="hidden" name="origin_url" value="/contato" />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-400">Mensagem enviada com sucesso!</p>
      )}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 transition-colors"
      >
        Enviar
      </button>
    </form>
  );
}
