/**
 * Design Tokens — ness.OS
 * Baseado em 8pt grid para ritmo visual consistente.
 * Referência: ajuste-ux-ui-nessos, AVALIACAO-FRONTEND-ESPACAMENTO
 */

/** Escala de espaçamento (8pt grid): 4, 8, 12, 16, 24, 32, 40, 48px */
export const SPACING = {
  xs: 4,   // space-1
  sm: 8,   // space-2
  md: 12,  // space-3
  lg: 16,  // space-4
  xl: 24,  // space-6
  '2xl': 32, // space-8
  '3xl': 40, // space-10
  '4xl': 48, // space-12
} as const;

/** Largura máxima de formulários — evita rolagem excessiva em forms longos */
export const FORM_WIDTH = {
  /** Formulários curtos (1-4 campos): 576px */
  short: 'max-w-xl',
  /** Formulários médios (5-8 campos): 672px */
  medium: 'max-w-2xl',
  /** Formulários longos (9+ campos, textareas grandes): 896px — reduz rolagem */
  long: 'max-w-4xl',
} as const;

/** Classes Tailwind para uso consistente */
export const SPACING_CLASSES = {
  /** Entre itens de lista/menu: 8px */
  listItem: 'space-y-2',
  /** Entre grupos/seções: 16px */
  section: 'gap-4',
  /** Entre seções de página: 32px */
  pageSection: 'space-y-8',
  /** Entre campos de formulário: 24px */
  formField: 'space-y-6',
  /** Entre label e input: 8px */
  labelInput: 'mb-2',
  /** Padding de container: 24px */
  container: 'p-6',
  /** Padding de container grande: 32px */
  containerLg: 'p-8',
  /** Gap entre botões: 12px */
  buttonGroup: 'gap-3',
} as const;
