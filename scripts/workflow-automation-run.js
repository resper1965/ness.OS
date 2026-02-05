#!/usr/bin/env node
/**
 * Automação workflow PREVC — estado atual e checklist.
 * Lê .context/workflow/status.yaml e artifacts para imprimir:
 * - Fase atual e status das fases PREVC
 * - Próximas ações (MCP ai-context: workflow-status, workflow-advance, etc.)
 * - Checklist das 10 etapas (executadas vs fila)
 *
 * Uso: node scripts/workflow-automation-run.js
 * Ver também: .context/workflow/RUNBOOK-PREVC-AUTOMATION.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WORKFLOW_DIR = path.join(ROOT, '.context', 'workflow');
const STATUS_FILE = path.join(WORKFLOW_DIR, 'status.yaml');
const EVIDENCE_FILE = path.join(WORKFLOW_DIR, 'artifacts', 'workflow-unico-phase-v-evidence.md');
const PHASE_P_ETAPAS = path.join(WORKFLOW_DIR, 'artifacts', 'workflow-unico-phase-p-etapas.md');

function readStatus() {
  if (!fs.existsSync(STATUS_FILE)) return null;
  const raw = fs.readFileSync(STATUS_FILE, 'utf8');
  const out = { project: {}, phases: {}, current_phase: null };
  let inPhases = false;
  let currentPhaseKey = null;
  const lines = raw.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('project:')) continue;
    if (trimmed.startsWith('name:') && !inPhases) {
      out.project.name = trimmed.replace(/^name:\s*/, '').trim().replace(/^["']|["']$/g, '');
      continue;
    }
    if (trimmed.startsWith('current_phase:')) {
      out.current_phase = trimmed.replace(/^current_phase:\s*/, '').trim();
      continue;
    }
    if (trimmed.startsWith('phases:')) {
      inPhases = true;
      continue;
    }
    if (inPhases) {
      const phaseMatch = trimmed.match(/^([PR.EVC]):$/);
      if (phaseMatch) {
        currentPhaseKey = phaseMatch[1];
        out.phases[currentPhaseKey] = { status: 'pending' };
        continue;
      }
      if (currentPhaseKey && trimmed.startsWith('status:')) {
        out.phases[currentPhaseKey].status = trimmed.replace(/^status:\s*/, '').trim();
        continue;
      }
    }
  }
  return out;
}

function readEvidenceEtapas() {
  if (!fs.existsSync(EVIDENCE_FILE)) return { executed: [], queue: [] };
  const raw = fs.readFileSync(EVIDENCE_FILE, 'utf8');
  const executed = [];
  const queue = [];
  const execSection = raw.match(/## Etapas executadas[^\n]*\n([\s\S]*?)(?=\n---|\n## Etapas na fila|$)/i);
  const queueSection = raw.match(/## Etapas na fila[^\n]*\n([\s\S]*?)(?=\n---|\n## |$)/i);
  if (execSection) {
    const table = execSection[1];
    const rows = table.match(/\|\s*(\d+)\s*\|/g);
    if (rows) for (const row of rows) {
      const num = row.match(/\d+/);
      if (num) executed.push(Number(num[0]));
    }
  }
  if (queueSection) {
    const table = queueSection[1];
    const rows = table.match(/\|\s*(\d+)\s*\|/g);
    if (rows) for (const row of rows) {
      const num = row.match(/\d+/);
      if (num) queue.push(Number(num[0]));
    }
  }
  return { executed, queue };
}

const ETAPAS = [
  { n: 1, name: 'Ajuste UX/UI Fase 5', plan: 'ajuste-ux-ui-nessos' },
  { n: 2, name: 'Theme-customizer Fase 3', plan: 'bundui-theme-customizer-nessos' },
  { n: 3, name: 'Mobile Timesheet PWA', plan: 'mobile-timesheet-timer' },
  { n: 4, name: 'Bundui Breadcrumb', plan: 'bundui-layout-components-nessos' },
  { n: 5, name: 'Bundui ui-primitivos', plan: 'bundui-ui-primitivos-nessos' },
  { n: 6, name: 'Fluxo explicativo inputs', plan: 'fluxo-explicativo-inputs' },
  { n: 7, name: 'Fluxos integração IA/automação', plan: 'fluxos-integracao-ia-automacao' },
  { n: 8, name: 'Migração corp site / site legacy', plan: 'migracao-corp-site-ness, migracao-site-legacy' },
  { n: 9, name: 'Redução complexidade codebase', plan: 'reducao-complexidade-codebase' },
  { n: 10, name: 'Planos por módulo', plan: 'ness-fin, ness-gov, ness-growth, etc.' },
];

function main() {
  console.log('=== Workflow PREVC — Estado e checklist (ai-context) ===\n');

  const status = readStatus();
  if (!status) {
    console.log('Arquivo status.yaml não encontrado em .context/workflow/');
    console.log('Ação: Inicialize o workflow com MCP workflow-init (name: "workflow-unico-etapas-abertas-nessos").');
    process.exit(1);
  }

  const { executed, queue } = readEvidenceEtapas();
  const phase = status.current_phase || '?';

  console.log('--- Estado atual ---');
  console.log('Workflow:', status.project.name || '—');
  console.log('Fase atual:', phase);
  console.log('Fases PREVC:', Object.entries(status.phases).map(([k, v]) => `${k}=${v.status}`).join(', '));
  console.log('Etapas executadas (evidência):', executed.length ? executed.join(', ') : 'nenhuma');
  console.log('Etapas na fila (evidência):', queue.length ? queue.join(', ') : 'nenhuma');
  console.log('');

  console.log('--- Próximas ações (usar MCP user-ai-context) ---');
  if (phase === 'P') {
    console.log('1. Garantir artifacts/workflow-unico-phase-p-etapas.md preenchido.');
    console.log('2. workflow-advance({ outputs: ["artifacts/workflow-unico-phase-p-etapas.md"] })');
  } else if (phase === 'R') {
    console.log('1. Revisar ordem/escopo em workflow-unico-phase-p-etapas.md.');
    console.log('2. workflow-manage({ action: "approvePlan", planSlug: "workflow-unico-etapas-abertas-nessos" }) se necessário.');
    console.log('3. workflow-advance({ outputs: [] })');
  } else if (phase === 'E') {
    console.log('1. workflow-status — confirmar fase.');
    if (queue.length > 0) {
      console.log('2. Executar etapas na fila:', queue.join(', '), '— atualizar workflow-unico-phase-v-evidence.md.');
      console.log('3. workflow-advance({ outputs: ["artifacts/workflow-unico-phase-v-evidence.md"] }) ao concluir lote.');
    } else {
      console.log('2. Todas as etapas já na evidência; avançar com workflow-advance.');
    }
  } else if (phase === 'V') {
    console.log('1. Rodar npm run build e npm run validate:ux (verificar verde).');
    console.log('2. workflow-advance({ outputs: ["artifacts/workflow-unico-phase-v-evidence.md"] })');
  } else if (phase === 'C') {
    console.log('1. Atualizar pendencias-abertas-nessos.md (itens concluídos → Concluído).');
    console.log('2. workflow-advance({ outputs: ["artifacts/workflow-unico-phase-v-evidence.md"] }) para fechar.');
  } else {
    console.log('1. workflow-status — obter fase atual.');
    console.log('2. Seguir .context/workflow/RUNBOOK-PREVC-AUTOMATION.md conforme fase.');
  }
  console.log('');

  console.log('--- Checklist 10 etapas (nada para trás) ---');
  const execSet = new Set(executed);
  const queueSet = new Set(queue);
  for (const e of ETAPAS) {
    const inExec = execSet.has(e.n);
    const inQueue = queueSet.has(e.n);
    const statusStr = inExec ? 'CONCLUÍDA' : inQueue ? 'FILA' : '?';
    console.log(`  ${String(e.n).padStart(2)}. [${statusStr.padEnd(9)}] ${e.name} (${e.plan})`);
  }
  console.log('');
  console.log('Runbook completo: .context/workflow/RUNBOOK-PREVC-AUTOMATION.md');
}

main();
