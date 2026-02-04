import { describe, expect, it } from 'vitest';
import { getWidgetsForRole, ALL_WIDGETS } from '@/lib/dashboard-widgets';

describe('getWidgetsForRole (Dashboard /app)', () => {
  it('admin e superadmin veem todos os widgets', () => {
    const admin = getWidgetsForRole('admin');
    const superadmin = getWidgetsForRole('superadmin');
    expect(admin).toHaveLength(ALL_WIDGETS.length);
    expect(superadmin).toHaveLength(ALL_WIDGETS.length);
  });

  it('employee vê apenas knowledge-bot e gaps', () => {
    const widgets = getWidgetsForRole('employee');
    const keys = widgets.map((w) => w.key);
    expect(keys).toContain('knowledge-bot');
    expect(keys).toContain('gaps');
    expect(widgets).toHaveLength(2);
  });

  it('role desconhecido fallback para admin (todos)', () => {
    const unknown = getWidgetsForRole('unknown-role');
    expect(unknown).toHaveLength(ALL_WIDGETS.length);
  });

  it('fin e cfo veem contratos e rentabilidade', () => {
    const fin = getWidgetsForRole('fin');
    const keys = fin.map((w) => w.key);
    expect(keys).toEqual(['contratos', 'rentabilidade']);
  });
});
