import { describe, expect, it } from 'vitest';
import { navModules, getAllItems, type NavModule } from '@/lib/nav-config';

describe('nav-config', () => {
  it('navModules tem início e módulos GROWTH, OPS, PEOPLE, FIN, JUR, GOV', () => {
    const ids = navModules.map((m) => m.id);
    expect(ids).toContain('inicio');
    expect(ids).toContain('growth');
    expect(ids).toContain('ops');
    expect(ids).toContain('people');
    expect(ids).toContain('fin');
    expect(ids).toContain('jur');
    expect(ids).toContain('gov');
  });

  it('módulo inicio tem apenas Dashboard', () => {
    const inicio = navModules.find((m) => m.id === 'inicio')!;
    expect(inicio.items).toHaveLength(1);
    expect(inicio.items![0].href).toBe('/app');
    expect(inicio.items![0].label).toBe('Dashboard');
  });

  it('getAllItems retorna itens planos quando module.items existe', () => {
    const gov = navModules.find((m) => m.id === 'gov')!;
    const items = getAllItems(gov);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.href && i.label)).toBe(true);
    expect(items.map((i) => i.href)).toContain('/app/gov/politicas');
  });

  it('getAllItems retorna itens das áreas quando module.areas existe', () => {
    const growth = navModules.find((m) => m.id === 'growth')!;
    const items = getAllItems(growth);
    expect(items.length).toBeGreaterThan(0);
    expect(items.map((i) => i.href)).toContain('/app/growth/leads');
    expect(items.map((i) => i.href)).toContain('/app/growth/services');
  });

  it('módulo sem items nem areas retorna array vazio', () => {
    const empty: NavModule = { id: 'x', title: 'X', items: [] };
    expect(getAllItems(empty)).toEqual([]);
    const noItems: NavModule = { id: 'y', title: 'Y' };
    expect(getAllItems(noItems)).toEqual([]);
  });
});
