'use client';

import { useFormState } from 'react-dom';
import { uploadAsset } from '@/app/actions/assets';

export function AssetUploadForm() {
  const [state, formAction] = useFormState(uploadAsset, {});

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-lg border border-slate-700 p-6">
      <h2 className="font-semibold text-slate-200">Upload</h2>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">Upload OK: {state.path}</p>}
      <div>
        <label className="block text-sm text-slate-300 mb-2">Pasta (opcional)</label>
        <input
          name="folder"
          type="text"
          placeholder="playbooks/manual-x"
          className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-300 mb-2">Arquivo</label>
        <input
          name="file"
          type="file"
          required
          accept="image/*,.pdf,.txt,.json"
          className="w-full text-sm text-slate-300 file:mr-4 file:rounded file:border-0 file:bg-ness file:px-4 file:py-2 file:text-white"
        />
      </div>
      <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
        Enviar
      </button>
    </form>
  );
}
