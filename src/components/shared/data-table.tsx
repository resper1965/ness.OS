type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'Nenhum registro encontrado.',
  emptyDescription,
  emptyAction,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/50 text-slate-300">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3 font-medium"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 text-slate-400">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center">
                <p className="text-slate-400">{emptyMessage}</p>
                {emptyDescription && <p className="mt-2 text-sm text-slate-500">{emptyDescription}</p>}
                {emptyAction && <div className="mt-4">{emptyAction}</div>}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-800/20">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? '-')}
                  </td>
                ))}
                {actions && <td className="px-4 py-3">{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
