'use client';

import { useFormState } from 'react-dom';
import { signIn } from '@/app/actions/auth';

export function LoginForm() {
  const [state, formAction] = useFormState(signIn, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness"
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ness"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600 transition-colors"
      >
        Entrar
      </button>
    </form>
  );
}
