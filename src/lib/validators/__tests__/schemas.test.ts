import { describe, expect, it } from 'vitest';
import { leadSchema, postSchema } from '../schemas';

describe('leadSchema', () => {
  it('aceita nome e email válidos', () => {
    const result = leadSchema.safeParse({ name: 'João Silva', email: 'joao@empresa.com' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('João Silva');
      expect(result.data.email).toBe('joao@empresa.com');
    }
  });

  it('aceita campos opcionais', () => {
    const result = leadSchema.safeParse({
      name: 'Maria',
      email: 'maria@test.com',
      company: 'Acme',
      message: 'Olá',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBe('Acme');
      expect(result.data.message).toBe('Olá');
    }
  });

  it('rejeita nome com menos de 2 caracteres', () => {
    const result = leadSchema.safeParse({ name: 'A', email: 'a@b.com' });
    expect(result.success).toBe(false);
  });

  it('rejeita email inválido', () => {
    const result = leadSchema.safeParse({ name: 'João', email: 'nao-e-email' });
    expect(result.success).toBe(false);
  });

  it('rejeita quando name está vazio', () => {
    const result = leadSchema.safeParse({ name: '', email: 'x@y.com' });
    expect(result.success).toBe(false);
  });
});

describe('postSchema', () => {
  it('aceita título e slug válidos', () => {
    const result = postSchema.safeParse({
      title: 'Meu Post',
      slug: 'meu-post',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Meu Post');
      expect(result.data.slug).toBe('meu-post');
    }
  });

  it('aceita slug com números e hífens', () => {
    const result = postSchema.safeParse({
      title: 'Post 2024',
      slug: 'post-2024-01',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita slug com caracteres inválidos', () => {
    const result = postSchema.safeParse({
      title: 'Post',
      slug: 'Post_com_underscore',
    });
    expect(result.success).toBe(false);
  });

  it('rejeita título vazio', () => {
    const result = postSchema.safeParse({ title: '', slug: 'slug' });
    expect(result.success).toBe(false);
  });

  it('rejeita slug vazio', () => {
    const result = postSchema.safeParse({ title: 'Título', slug: '' });
    expect(result.success).toBe(false);
  });
});
