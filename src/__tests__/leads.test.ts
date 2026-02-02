import { describe, expect, it, vi } from 'vitest';
import { submitLead } from '@/app/actions/leads';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: () => ({
        insert: () => Promise.resolve({ error: null }),
      }),
    })
  ),
}));

describe('submitLead', () => {
  it('retorna erro quando nome inválido', async () => {
    const formData = new FormData();
    formData.set('name', 'A');
    formData.set('email', 'test@test.com');

    const result = await submitLead({}, formData);

    expect(result).toHaveProperty('error');
  });

  it('retorna erro quando email inválido', async () => {
    const formData = new FormData();
    formData.set('name', 'João Silva');
    formData.set('email', 'invalido');

    const result = await submitLead({}, formData);

    expect(result).toHaveProperty('error');
  });

  it('retorna success quando dados válidos (mock)', async () => {
    const formData = new FormData();
    formData.set('name', 'João Silva');
    formData.set('email', 'joao@empresa.com');

    const result = await submitLead({}, formData);

    expect(result).toHaveProperty('success', true);
  });
});
