import { describe, it, expect } from 'vitest';
import {
  getApparatusHelpConfig,
  preloadTumblingEChart,
  TUMBLING_E_ROWS,
  getTumblingENextRow,
} from '../apparatusHelpConfig';

describe('Apparatus Help Configuration', () => {
  it('uses static local PNG asset for Tumbling E chart', () => {
    const config = getApparatusHelpConfig('tumbling-e-line');
    expect(config).not.toBeNull();
    expect(config?.imageSrc).toContain('tumbling_e_chart');
    expect(config?.imageSrc).not.toContain('http://');
    expect(config?.imageSrc).not.toContain('https://');
  });

  it('defines explicit TumblingERow metadata for chart rows', () => {
    expect(TUMBLING_E_ROWS.length).toBe(10);
    const row24 = TUMBLING_E_ROWS.find((r) => r.value === '24');
    expect(row24).toBeDefined();
    expect(row24?.yPercent).toBeGreaterThan(30);
    expect(row24?.symbolsLeftPercent).toBeGreaterThan(30);
    expect(row24?.symbolsWidthPercent).toBeGreaterThan(25);
  });

  it('maps selected line to next row correctly using getTumblingENextRow', () => {
    expect(getTumblingENextRow('60').value).toBe('36');
    expect(getTumblingENextRow('36').value).toBe('24');
    expect(getTumblingENextRow('24').value).toBe('18');
    expect(getTumblingENextRow('18').value).toBe('12');
    expect(getTumblingENextRow('12').value).toBe('9');
    expect(getTumblingENextRow('9').value).toBe('6');
  });

  it('dynamically highlights the entire next row for tumbling-e-letters without covering printed line number', () => {
    // Tester selected line 24 -> target row is 18
    const config = getApparatusHelpConfig('tumbling-e-letters', '24');
    expect(config).not.toBeNull();
    expect(config?.highlightCaption).toBe('Count the symbols identified correctly on the highlighted row.');
    expect(config?.imageAlt).toContain('line 18 row');

    const highlight = config?.highlights?.[0];
    expect(highlight).toBeDefined();
    // Highlighting covers symbols (left >= 35%) and does NOT cover left margin line number (which is < 30%)
    expect(highlight?.xPercent).toBeGreaterThanOrEqual(35);
    expect(highlight?.widthPercent).toBeGreaterThan(25);
  });

  it('executes preloadTumblingEChart without errors', () => {
    expect(() => preloadTumblingEChart()).not.toThrow();
  });
});
