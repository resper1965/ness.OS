'use client';

import { useState } from 'react';
import { generateProposalWithAI } from '@/app/actions/growth';
import { Button } from '@/components/ui/button'; // Assumindo shadcn ou similar, se não houver, usarei vanilla
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles, Loader2, Copy, Check, FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProposalPDFDocument } from './proposal-pdf-document';

export function AIProposalButton({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setProposal(null);
    try {
      const res = await generateProposalWithAI(serviceId);
      if (res.error) {
        alert(res.error);
        return;
      }
      setProposal(res.text ?? null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-ness/20 bg-ness/5 text-ness hover:bg-ness/10 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Gerar Proposta IA
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ness" />
            Proposta IA — {serviceName}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Baseada na hierarquia operacional de Jobs e Playbooks vinculados.
          </DialogDescription>
        </DialogHeader>

        {!proposal && !loading && (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-800 rounded-full">
              <Sparkles className="w-8 h-8 text-ness animate-pulse" />
            </div>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Clique no botão abaixo para gerar um rascunho técnico baseado no escopo operacional deste serviço.
            </p>
            <button
              onClick={handleGenerate}
              className="mt-2 inline-flex items-center gap-2 bg-ness hover:bg-ness-hover text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Iniciar Geração
            </button>
          </div>
        )}

        {loading && (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-ness animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Os Robôs estão analisando os Playbooks...</p>
          </div>
        )}

        {proposal && (
          <div className="relative mt-4">
            <div className="absolute top-4 right-4 flex gap-2">
              {proposal && (
                <PDFDownloadLink
                  document={<ProposalPDFDocument serviceName={serviceName} content={proposal} />}
                  fileName={`proposta-${serviceName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors flex items-center gap-2 text-xs text-slate-300"
                >
                  {({ loading: pdfLoading }) => (
                    <>
                      {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                      {pdfLoading ? 'Prep...' : 'PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              )}
              <button
                onClick={handleCopy}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors flex items-center gap-2 text-xs text-slate-300"
                title="Copiar Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>
            <div className="prose prose-invert prose-slate max-w-none bg-slate-950 p-6 rounded-lg border border-slate-800">
              <ReactMarkdown>{proposal}</ReactMarkdown>
            </div>
            <div className="mt-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 italic">
                Revise as informações técnicas e preços antes de enviar ao cliente.
              </p>
              <button
                onClick={handleGenerate}
                className="text-xs text-ness hover:underline font-bold uppercase tracking-wider"
              >
                Gerar Novamente
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
