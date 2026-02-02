/** Converte <highlight>texto</highlight> em span com text-ness */
export function renderHighlight(text: string | null | undefined): React.ReactNode {
  if (!text || typeof text !== 'string') return null;
  const parts = text.split(/(<highlight>|<\/highlight>)/g);
  const result: React.ReactNode[] = [];
  let inHighlight = false;
  for (const p of parts) {
    if (p === '<highlight>') {
      inHighlight = true;
    } else if (p === '</highlight>') {
      inHighlight = false;
    } else if (inHighlight) {
      result.push(<span key={result.length} className="text-ness">{p}</span>);
    } else {
      result.push(p);
    }
  }
  return result.length === 1 ? result[0] : <>{result}</>;
}
