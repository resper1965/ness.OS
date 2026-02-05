import { z } from 'zod';

/** Schema para Lead (formulário de contato / inbound_leads) */
export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  company: z.string().optional(),
  message: z.string().optional(),
  origin_url: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Schema para Post (public_posts) */
export const postSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens'),
  seo_description: z.string().optional(),
  content_markdown: z.string().optional(),
  is_published: z.boolean().optional(),
});

export type PostInput = z.infer<typeof postSchema>;

/** Schema para análise de risco JUR (cláusulas identificadas pela IA) */
export const riskSchema = z.object({
  clauses: z.array(z.object({
    type: z.string(),
    excerpt: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    suggestion: z.string(),
  })),
});

export type RiskAnalysisResult = z.infer<typeof riskSchema>;
