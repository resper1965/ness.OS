/**
 * Cliente Gemini para agentes da aplicação (rex.*).
 * Usa variável de ambiente GEMINI_API_KEY; nunca commitar a chave.
 * @see docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md
 */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-1.5-flash';

export interface CallGeminiResult {
  text: string | null;
  error: string | null;
}

/**
 * Chama a API Gemini com o prompt fornecido.
 * Retorna o texto da primeira resposta ou erro.
 */
export async function callGemini(
  prompt: string,
  options?: { model?: string; systemInstruction?: string }
): Promise<CallGeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    return { text: null, error: 'GEMINI_API_KEY não configurada.' };
  }

  const model = options?.model ?? DEFAULT_MODEL;
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  };
  if (options?.systemInstruction) {
    body.systemInstruction = { parts: [{ text: options.systemInstruction }] };
  }

  try {
    const res = await fetch(
      `${GEMINI_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { text: null, error: `Gemini API ${res.status}: ${errText.slice(0, 200)}` };
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    return { text, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { text: null, error: msg };
  }
}
