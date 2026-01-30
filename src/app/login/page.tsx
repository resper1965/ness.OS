import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-slate-700 bg-slate-800/50 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">
            ness<span className="text-ness">.</span>OS
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Área administrativa
          </p>
        </div>
        <LoginForm />
        <Link
          href="/"
          className="block w-full text-center text-sm text-slate-400 hover:text-ness transition-colors"
        >
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
