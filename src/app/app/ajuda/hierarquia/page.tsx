import { readFile } from 'fs/promises';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';

export const metadata = {
  title: 'Guia: Hierarquia de Serviços | nessOS',
  description: 'Entenda como funciona a composição de serviços em 4 níveis',
};

export default async function HierarchyHelpPage() {
  const filePath = join(process.cwd(), 'docs', 'GUIA-HIERARQUIA-SERVICOS.md');
  const content = await readFile(filePath, 'utf-8');

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
