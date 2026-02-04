import type { Metadata } from "next";
import Link from "next/link";
import {
  Cpu,
  Database,
  GitBranch,
  Layers,
  BookOpen,
  ArrowRight,
} from "lucide-react";

function renderBrandText(text: string) {
  if (!text.includes(".")) return text;
  const parts = text.split(".");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? <span className="text-ness">.</span> : null}
        </span>
      ))}
    </>
  );
}

const NAV_ANCHORS = [
  { href: "#o-que-e", label: "O que é" },
  { href: "#modulos", label: "Módulos" },
  { href: "#fluxos", label: "Fluxos" },
  { href: "#stack", label: "Stack" },
  { href: "#detalhamento", label: "Detalhamento" },
  { href: "#referencias", label: "Referências" },
];

const MODULOS_RESUMO = [
  { modulo: "ness.GROWTH", foco: "Vendas, Precificação, Marketing", resumo: "Propostas inteligentes, CMS, chatbot RAG, branding." },
  { modulo: "ness.OPS", foco: "Playbooks, Métricas, Timer", resumo: "Padronização, ingestão de indicadores, mapeamento de recursos." },
  { modulo: "ness.FIN", foco: "Rentabilidade, Contratos", resumo: "CFO digital, custo real por contrato, ciclo de vida." },
  { modulo: "ness.JUR", foco: "Jurídico e Compliance", resumo: "Análise de contratos, conformidade legal (LGPD, Marco Civil)." },
  { modulo: "ness.GOV", foco: "Governança interna", resumo: "Políticas, rastreabilidade de aceites." },
  { modulo: "ness.PEOPLE", foco: "Talentos e ATS", resumo: "Recrutamento, avaliação 360º, treinamento orientado a gaps." },
  { modulo: "ness.DATA", foco: "Camada de dados", resumo: "Ingestão ERP (Omie), consultas para módulos; sem verticais." },
];

const FLUXO_SITE_APP = [
  { origem: "Visitante", acao: "Preenche contato", destino: "inbound_leads" },
  { origem: "Visitante", acao: "Candidata a vaga", destino: "job_applications" },
  { origem: "Visitante", acao: "Lê blog, vagas, soluções", destino: "public_posts, public_jobs, services_catalog (leitura)" },
  { origem: "Usuário logado", acao: "Cria post, serviço, lead", destino: "Mesmas tabelas (escrita)" },
  { origem: "Usuário logado", acao: "Cria playbook, contrato, métrica", destino: "playbooks, contracts, performance_metrics" },
];

const CICLO_VALOR = [
  { modulo: "ness.OPS", funcao: "Define *como* fazemos (Playbooks)." },
  { modulo: "ness.GROWTH", funcao: "Vende *apenas* o que sabemos fazer (Catálogo travado por Playbooks)." },
  { modulo: "ness.FIN", funcao: "Mede se o que vendemos deu lucro real (Receita - Custo Operacional)." },
  { modulo: "ness.PEOPLE", funcao: "Treina o time onde a operação falhou (Gaps por auditoria)." },
  { modulo: "ness.WEB", funcao: "Vitrine automática do que acontece dentro do OS." },
];

export const metadata: Metadata = {
  title: "ness.OS — O Sistema Operacional de Gestão | ness.",
  description:
    "Plataforma de gestão e inteligência corporativa: 6 módulos (GROWTH, OPS, FIN, JUR, GOV, PEOPLE) + ness.DATA. Conhecimento padronizado, rentabilidade real, gestão ativa.",
  keywords:
    "ness.OS, gestão empresarial, sistema nervoso digital, GROWTH, OPS, FIN, JUR, GOV, PEOPLE, ness.DATA",
};

export default function NessOSPage() {
  return (
    <>
      {/* Hero + Nav âncoras */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {renderBrandText("ness.OS")} — O Sistema Operacional de Gestão
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Plataforma central que atua como o &quot;Sistema Nervoso Digital&quot; da {renderBrandText("ness.")} — integrando operação técnica, inteligência financeira, gestão jurídica, capital humano e expansão comercial em um único ecossistema auditável.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-3 mt-8" aria-label="Navegação na página">
            {NAV_ANCHORS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-md border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-200 hover:border-ness hover:bg-slate-700/50 transition-colors"
              >
                {a.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* 2.1 O que é */}
      <section id="o-que-e" className="py-16 bg-slate-800 scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-ness" aria-hidden />
            O que é o {renderBrandText("ness.OS")}
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
            <p>
              O {renderBrandText("ness.OS")} é a plataforma central que atua como o &quot;Sistema Nervoso Digital&quot; da {renderBrandText("ness.")} Ele integra a operação técnica, a inteligência financeira, a gestão jurídica, o capital humano e a expansão comercial em um único ecossistema auditável.
            </p>
            <p>
              <strong>Missão:</strong> Transformar a empresa de uma prestadora de serviços (baseada em esforço) em uma orquestradora de negócios (baseada em <strong>conhecimento padronizado, rentabilidade real e gestão ativa</strong>).
            </p>
            <p>
              Ecossistema unificado: site institucional público (ness.WEB) + plataforma de gestão interna ({renderBrandText("ness.OS")}). O {renderBrandText("ness.OS")} atua como orquestrador de negócios com foco em conhecimento padronizado, rentabilidade real e gestão ativa.
            </p>
          </div>
        </div>
      </section>

      {/* 2.2 Os 6 módulos + ness.DATA */}
      <section id="modulos" className="py-16 bg-slate-900 scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-8 h-8 text-ness" aria-hidden />
            Os 6 módulos + ness.DATA
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-600 rounded-lg overflow-hidden text-left">
              <thead>
                <tr className="bg-slate-800 text-slate-200">
                  <th className="px-4 py-3 font-semibold border-b border-slate-600">Módulo</th>
                  <th className="px-4 py-3 font-semibold border-b border-slate-600">Foco</th>
                  <th className="px-4 py-3 font-semibold border-b border-slate-600">Capabilidades (resumo)</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {MODULOS_RESUMO.map((row) => (
                  <tr key={row.modulo} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-white">{row.modulo}</td>
                    <td className="px-4 py-3">{row.foco}</td>
                    <td className="px-4 py-3">{row.resumo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2.3 Fluxos de valor e dados */}
      <section id="fluxos" className="py-16 bg-slate-800 scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <GitBranch className="w-8 h-8 text-ness" aria-hidden />
            Fluxos de valor e dados
          </h2>

          <div className="space-y-12">
            {/* 2.3.1 Ciclo de valor (flywheel) */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Ciclo de valor (flywheel)</h3>
              <p className="text-slate-300 mb-4">
                O {renderBrandText("ness.OS")} não é um dashboard. É um <strong>Orquestrador de Negócios</strong>. A {renderBrandText("ness.")} migra de &quot;Esforço&quot; (vender horas) para &quot;Conhecimento&quot; (vender padrões). O ciclo:
              </p>
              <div className="rounded-lg border border-slate-600 bg-slate-900/50 p-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-sm">
                      <th className="pb-2 pr-4">Módulo</th>
                      <th className="pb-2">Função</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {CICLO_VALOR.map((r) => (
                      <tr key={r.modulo} className="border-t border-slate-700">
                        <td className="py-2 pr-4 font-medium text-white">{r.modulo}</td>
                        <td className="py-2">{r.funcao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Fluxo: OPS (Playbooks) → GROWTH (Catálogo travado) → FIN (Rentabilidade) → PEOPLE (Gaps/Treinamento) → WEB (Vitrine) → …
              </p>
            </div>

            {/* 2.3.2 Timer → OPS → FIN */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Fluxo Timer → OPS → FIN</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Timer</strong> — Colaborador registra sessões em /app/ops/timer; dados vão para <code className="bg-slate-700 px-1 rounded">time_entries</code>.</li>
                <li><strong>Agregação</strong> — Job (cron ou manual) soma time_entries por contract_id + mês e atualiza <code className="bg-slate-700 px-1 rounded">performance_metrics.hours_worked</code>.</li>
                <li><strong>Métricas</strong> — Em /app/ops/metricas: edição manual ou botão &quot;Sincronizar horas do timer&quot;.</li>
                <li><strong>Rentabilidade</strong> — View <code className="bg-slate-700 px-1 rounded">contract_rentability</code> usa performance_metrics para margem por contrato; exibida em /app/fin/rentabilidade.</li>
              </ol>
            </div>

            {/* 2.3.3 Site ↔ App */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Site ↔ App</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-slate-600 rounded-lg overflow-hidden text-left">
                  <thead>
                    <tr className="bg-slate-800 text-slate-200">
                      <th className="px-4 py-3 font-semibold border-b border-slate-600">Origem</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-600">Ação</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-600">Destino</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {FLUXO_SITE_APP.map((row, i) => (
                      <tr key={i} className="border-b border-slate-700">
                        <td className="px-4 py-3">{row.origem}</td>
                        <td className="px-4 py-3">{row.acao}</td>
                        <td className="px-4 py-3 font-mono text-sm">{row.destino}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2.3.4 ness.DATA e integrações */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">ness.DATA e integrações externas</h3>
              <p className="text-slate-300">
                ness.DATA é a camada única que colhe, normaliza e disponibiliza dados de ERPs e outras fontes (Omie primeiro). Os módulos de negócio <strong>consomem</strong> via consultas/actions; não integram diretamente com o Omie. Evolução: novas fontes (outro ERP, BCB, ingestão de indicadores) entram em ness.DATA; módulos não precisam saber da origem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.4 Stack e arquitetura */}
      <section id="stack" className="py-16 bg-slate-900 scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-8 h-8 text-ness" aria-hidden />
            Stack e arquitetura
          </h2>
          <ul className="space-y-2 text-slate-300 mb-6">
            <li><strong className="text-white">Frontend:</strong> Next.js 14 (App Router), Tailwind CSS, shadcn/ui.</li>
            <li><strong className="text-white">Backend:</strong> Supabase (Auth, Postgres, pgvector, Storage, Realtime).</li>
            <li><strong className="text-white">Deploy:</strong> Vercel. IA: Vercel AI SDK, pgvector (RAG).</li>
          </ul>
          <h3 className="text-xl font-semibold text-white mb-3">Rotas</h3>
          <ul className="space-y-1 text-slate-300 mb-6">
            <li><code className="bg-slate-700 px-1 rounded">app/(site)/</code> — Site público (blog, carreiras, contato, soluções, casos).</li>
            <li><code className="bg-slate-700 px-1 rounded">app/app/</code> — Dashboard interno (growth, ops, fin, people, jur, gov).</li>
            <li><code className="bg-slate-700 px-1 rounded">app/api/</code> — API routes (chat/playbooks, chat/public, jur/risk, cron).</li>
          </ul>
          <h3 className="text-xl font-semibold text-white mb-3">Camadas</h3>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li><strong>Pages</strong> — Server Components, fetch via createClient.</li>
            <li><strong>Actions</strong> — Server Actions em data, growth, ops, fin, people, jur, gov, ai.</li>
            <li><strong>Components</strong> — Client/Server, shared (DataTable, StatusBadge), por módulo.</li>
            <li><strong>Lib</strong> — supabase, validators/schemas, ai/embedding, data/omie.</li>
          </ol>
        </div>
      </section>

      {/* 2.5 Detalhamento por módulo */}
      <section id="detalhamento" className="py-16 bg-slate-800 scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <Layers className="w-8 h-8 text-ness" aria-hidden />
            Detalhamento por módulo
          </h2>

          <div className="space-y-10">
            <DetalheModulo
              titulo="ness.GROWTH"
              foco="Vendas Inteligentes, Presença Digital e Gestão de Conteúdo."
              capacidades={[
                { cap: "Smart Proposals (Engenharia de Vendas)", desc: "IA gera propostas técnicas baseadas em Base de Conhecimento de Sucesso; analisa contratos históricos para replicar escopos seguros." },
                { cap: "Precificação e Upsell", desc: "Calcula preço considerando custos e riscos de penalidades; monitora consumo para alertas de novas vendas." },
                { cap: "Motor de Conteúdo e Site (CMS Inteligente)", desc: "Blog e CMS headless; ingestão de Casos de Sucesso e dados operacionais para posts via IA." },
                { cap: "Chatbot Inteligente (RAG)", desc: "Assistente no site consultando base de conhecimento real (manuais e portfólio)." },
                { cap: "Branding e Ativos", desc: "Manual da Marca e brand assets; proposta e comunicação seguem identidade visual." },
              ]}
            />
            <DetalheModulo
              titulo="ness.OPS"
              foco="Padronização, Execução Técnica e Eficiência."
              capacidades={[
                { cap: "Engenharia de Processos (Playbook)", desc: "Mapeia e padroniza rituais técnicos; homogeniza em Manuais de Procedimentos." },
                { cap: "Ingestão de Indicadores", desc: "Centraliza métricas de performance de ferramentas técnicas para métricas do setor." },
                { cap: "Mapeamento de Recursos", desc: "Mede consumo por contrato (horas, licenças, nuvem) para FIN e precificação." },
              ]}
            />
            <DetalheModulo
              titulo="ness.FIN"
              foco="Rentabilidade Real e Ciclo de Vida."
              capacidades={[
                { cap: "CFO Digital", desc: "Cruza Receita x Despesa em tempo real com dados do ERP (ness.DATA)." },
                { cap: "Gestão de Custos e Rentabilidade", desc: "Custo real por contrato: RH + Ferramentas + Impostos + Rateio; rentabilidade líquida por cliente." },
                { cap: "Ciclo de Vida do Contrato", desc: "Datas críticas; alertas de renovação, reajustes (IGPM/IPCA), vencimento e cobrança." },
              ]}
            />
            <DetalheModulo
              titulo="ness.JUR"
              foco="Blindagem e Segurança Jurídica."
              capacidades={[
                { cap: "Análise de Contratos", desc: "Avalia minutas e contratos vigentes; identifica riscos e inconformidades." },
                { cap: "Conformidade Legal", desc: "Aderência à LGPD, Marco Civil da Internet e legislações trabalhistas." },
              ]}
            />
            <DetalheModulo
              titulo="ness.GOV"
              foco="Políticas Internas e Organização."
              capacidades={[
                { cap: "Gestão de Políticas", desc: "Criação, distribuição e atualização de normas e políticas internas." },
                { cap: "Rastreabilidade de Aceite", desc: "Documentação por colaborador: termos, NDAs e aceites de políticas desde onboarding." },
              ]}
            />
            <DetalheModulo
              titulo="ness.PEOPLE"
              foco="Desempenho, Recrutamento e Cultura."
              capacidades={[
                { cap: "Recrutamento Integrado (ATS)", desc: "Vagas com base em perfis técnicos dos contratos; publicação em Trabalhe Conosco; candidaturas." },
                { cap: "Avaliação 360º e Liderança", desc: "Dados qualitativos e quantitativos para análise de desempenho." },
                { cap: "Treinamento Orientado", desc: "Cruza falhas operacionais (OPS) com necessidade de capacitação; sugere treinamentos." },
              ]}
            />
            <DetalheModulo
              titulo="ness.DATA"
              foco="Ingestão e exposição de dados de fontes externas."
              capacidades={[
                { cap: "Ingestão ERP (Omie)", desc: "Sync centralizado: clientes, contas a receber/pagar, produtos; log erp_sync_log." },
                { cap: "Consultas e exposição", desc: "Server Actions expõem dados tratados para FIN, OPS, GROWTH, PEOPLE." },
                { cap: "Evolução", desc: "Novas fontes entram em ness.DATA; módulos não precisam saber da origem." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 2.6 Referências e ai-context */}
      <section id="referencias" className="py-16 bg-slate-900 scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Database className="w-8 h-8 text-ness" aria-hidden />
            Referências e ai-context
          </h2>
          <p className="text-slate-300 mb-6">
            Esta página é mantida em sync com o ai-context do repositório (<code className="bg-slate-700 px-1 rounded">.context/docs</code> e <code className="bg-slate-700 px-1 rounded">.context/plans</code>).
          </p>
          <ul className="space-y-2 text-slate-300">
            <li><strong className="text-white">Docs:</strong> project-overview, architecture, data-flow, glossary.</li>
            <li><strong className="text-white">Planos:</strong> ness-os-definicao-visao, ness-os-sistema-nervoso; planos por módulo (ness-growth-inteligencia-comercial, ness-ops-engenharia-processos, ness-fin-cfo-digital, ness-jur-juridico-compliance, ness-gov-governanca-interna, ness-people-talentos-cultura, ness-data-modulo-dados).</li>
            <li><strong className="text-white">Spec desta página:</strong> docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md.</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-ness to-ness-600 px-5 py-2.5 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Sobre a {renderBrandText("ness.")}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center rounded-md border border-slate-500 px-5 py-2.5 text-slate-300 font-medium hover:bg-slate-700/50 transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function DetalheModulo({
  titulo,
  foco,
  capacidades,
}: {
  titulo: string;
  foco: string;
  capacidades: { cap: string; desc: string }[];
}) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/50 p-6">
      <h3 className="text-xl font-semibold text-white mb-1">{titulo}</h3>
      <p className="text-slate-400 text-sm mb-4">{foco}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-slate-600 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-800 text-slate-200">
              <th className="px-4 py-2 font-semibold border-b border-slate-600 text-sm">Capabilidade</th>
              <th className="px-4 py-2 font-semibold border-b border-slate-600 text-sm">Descrição</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 text-sm">
            {capacidades.map((c) => (
              <tr key={c.cap} className="border-b border-slate-700">
                <td className="px-4 py-3 font-medium text-white">{c.cap}</td>
                <td className="px-4 py-3">{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
