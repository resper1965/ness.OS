'use client';

import { useFormState } from 'react-dom';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { generateServiceCatalogWithAI } from '@/app/actions/ai';

const LABEL_CLASS = 'block text-sm font-medium text-slate-300 mb-2';
const INPUT_CLASS = 'w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500';
const HELP_CLASS = 'text-xs text-slate-500 mt-1';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || '';
}

type FormServiceCatalogProps = {
  mode: 'create' | 'edit';
  action: (prev: unknown, fd: FormData) => Promise<{ success?: boolean; error?: string }>;
  service?: {
    id?: string;
    name: string;
    slug: string;
    playbook_ids?: string[];
    delivery_type?: string | null;
    marketing_pitch: string | null;
    marketing_title?: string | null;
    marketing_body?: string | null;
    is_active: boolean;
  };
  playbooks: { id: string; title: string }[];
};

export function FormServiceCatalog({ mode, action, service, playbooks }: FormServiceCatalogProps) {
  const [state, formAction] = useFormState(action, {});

  const [name, setName] = useState(service?.name ?? '');
  const [slug, setSlug] = useState(service?.slug ?? '');
  const [marketingTitle, setMarketingTitle] = useState(service?.marketing_title ?? '');
  const [marketingPitch, setMarketingPitch] = useState(service?.marketing_pitch ?? '');
  const [marketingBody, setMarketingBody] = useState(service?.marketing_body ?? '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    setSlug(slugify(v));
  }, []);

  const handleGenerateWithAI = useCallback(async () => {
    const nameInput = (document.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
    const checked = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="playbook_ids"]:checked'));
    const playbookTitles = checked
      .map((cb) => playbooks.find((p) => p.id === cb.value)?.title)
      .filter((t): t is string => !!t);

    if (!nameInput) {
      setAiError('Informe o nome do serviço antes de gerar.');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    const result = await generateServiceCatalogWithAI(nameInput, playbookTitles);
    setAiLoading(false);

    if (result.success) {
      setSlug(result.data.slug);
      setMarketingTitle(result.data.titulo_site);
      setMarketingPitch(result.data.pitch);
      setMarketingBody(result.data.corpo_site);
    } else {
      setAiError(result.error);
    }
  }, [playbooks]);

  if (state?.success && mode === 'edit') {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-500/10 p-6 text-green-400">
        Serviço atualizado. <Link href="/app/growth/services" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-4xl space-y-6">
      {service?.id && <input type="hidden" name="_id" value={service.id} />}
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && mode === 'create' && <p className="text-sm text-green-400">Serviço criado.</p>}

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-200">
          {mode === 'create' ? 'Novo serviço' : 'Editar serviço'}
        </h2>
        <button
          type="button"
          onClick={handleGenerateWithAI}
          disabled={aiLoading}
          className="flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {aiLoading ? 'Gerando...' : 'Gerar com IA'}
        </button>
      </div>
      {aiError && <p className="text-sm text-amber-400">{aiError}</p>}

      <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
        <div>
          <label className={LABEL_CLASS}>Nome</label>
          <input
            name="name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            className={INPUT_CLASS}
            placeholder="N-SecOps"
          />
          <p className={HELP_CLASS}>Nome exibido em /solucoes.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Slug</label>
          <input
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={INPUT_CLASS}
            placeholder="n-secops"
          />
          <p className={HELP_CLASS}>Minúsculo, hífens. Gerado automaticamente a partir do nome.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Playbooks</label>
          <div className="space-y-2 max-h-48 overflow-y-auto rounded-md border border-slate-600 bg-slate-800 p-3">
            {playbooks.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 hover:text-white">
                <input
                  type="checkbox"
                  name="playbook_ids"
                  value={p.id}
                  defaultChecked={service?.playbook_ids?.includes(p.id)}
                  className="rounded border-slate-600 bg-slate-700 text-ness"
                />
                <span className="text-sm">{p.title}</span>
              </label>
            ))}
          </div>
          <p className={HELP_CLASS}>Selecione um ou mais playbooks. Serviço ativo exige pelo menos um. Trava Growth×OPS.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Título (site)</label>
          <input
            name="marketing_title"
            type="text"
            value={marketingTitle}
            onChange={(e) => setMarketingTitle(e.target.value)}
            className={INPUT_CLASS}
            placeholder="N-SecOps — Segurança Operacional"
          />
          <p className={HELP_CLASS}>Título em /solucoes/[slug]. Se vazio, usa o nome.</p>
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Pitch</label>
        <textarea
          name="marketing_pitch"
          rows={3}
          value={marketingPitch}
          onChange={(e) => setMarketingPitch(e.target.value)}
          className={INPUT_CLASS}
          placeholder="Segurança e compliance automatizados."
        />
        <p className={HELP_CLASS}>1–2 frases. Aparece nos cards de soluções.</p>
      </div>

      <div>
        <label className={LABEL_CLASS}>Corpo (site)</label>
        <textarea
          name="marketing_body"
          rows={10}
          value={marketingBody}
          onChange={(e) => setMarketingBody(e.target.value)}
          className={INPUT_CLASS}
          placeholder="Conteúdo completo da página. Markdown suportado."
        />
        <p className={HELP_CLASS}>Conteúdo principal da página do serviço no site público. Markdown.</p>
      </div>

      {mode === 'edit' && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Classificação</label>
              <select
                name="delivery_type"
                className={INPUT_CLASS}
                defaultValue={service?.delivery_type ?? 'service'}
              >
                <option value="service">Serviço</option>
                <option value="product">Produto</option>
                <option value="vertical">Vertical</option>
              </select>
              <p className={HELP_CLASS}>Define em qual seção aparece: Serviços, Produtos ou Verticais.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              id="active"
              defaultChecked={service?.is_active}
              className="rounded border-slate-600 bg-slate-800 text-ness"
            />
            <label htmlFor="active" className="text-sm text-slate-300">Ativo no site</label>
          </div>
          <p className={HELP_CLASS}>Se marcado, o serviço aparece em /solucoes.</p>
        </>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600"
        >
          {mode === 'create' ? 'Criar serviço' : 'Salvar'}
        </button>
        {mode === 'edit' && (
          <Link
            href="/app/growth/services"
            className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancelar
          </Link>
        )}
      </div>
    </form>
  );
}
