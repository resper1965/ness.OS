/**
 * Exporta array de objetos para CSV e dispara download.
 * Escapa aspas e vírgulas nos valores.
 */
export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T | string; header: string }[],
  filename: string
): void {
  const escape = (v: unknown): string => {
    const s = v == null ? '' : String(v);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = columns.map((c) => escape(c.header)).join(',');
  const lines = rows.map((row) => columns.map((c) => escape((row as Record<string, unknown>)[c.key as string])).join(','));
  const csv = [header, ...lines].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
