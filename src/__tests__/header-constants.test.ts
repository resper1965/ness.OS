import { describe, expect, it } from 'vitest';
import {
  APP_HEADER_HEIGHT_PX,
  SIDEBAR_WIDTH_PX,
  SECTION_HEADER_HEIGHT_PX,
} from '@/lib/header-constants';

describe('header-constants', () => {
  it('APP_HEADER_HEIGHT_PX é 52', () => {
    expect(APP_HEADER_HEIGHT_PX).toBe(52);
  });

  it('SIDEBAR_WIDTH_PX é 224 (w-56)', () => {
    expect(SIDEBAR_WIDTH_PX).toBe(224);
  });

  it('SECTION_HEADER_HEIGHT_PX é 52', () => {
    expect(SECTION_HEADER_HEIGHT_PX).toBe(52);
  });

  it('valores são positivos para uso em layout', () => {
    expect(APP_HEADER_HEIGHT_PX).toBeGreaterThan(0);
    expect(SIDEBAR_WIDTH_PX).toBeGreaterThan(0);
    expect(SECTION_HEADER_HEIGHT_PX).toBeGreaterThan(0);
  });
});
