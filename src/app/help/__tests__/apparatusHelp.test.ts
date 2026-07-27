import { describe, it, expect } from 'vitest';
import {
  getApparatusHelpConfig,
  preloadTumblingEChart,
  TUMBLING_E_ROWS,
  parseOoxiiLineIndex,
  resolveOoxiiLineRow,
  APPARATUS_HELP_CONFIGS,
} from '../apparatusHelpConfig';

describe('Apparatus Help Configuration', () => {
  it('uses static local PNG asset for Tumbling E chart and avoids remote URLs', () => {
    const config = getApparatusHelpConfig('tumbling-e-line');
    expect(config).not.toBeNull();
    expect(config?.imageSrc).toContain('tumbling_e_chart');
    expect(config?.imageSrc).not.toContain('http://');
    expect(config?.imageSrc).not.toContain('https://');
  });

  it('correctly parses OOXii line indices with parseOoxiiLineIndex', () => {
    expect(parseOoxiiLineIndex('Line 0')).toBe(0);
    expect(parseOoxiiLineIndex('Line 4')).toBe(4);
    expect(parseOoxiiLineIndex('Line 11')).toBe(11);
    expect(parseOoxiiLineIndex('24')).toBeNull(); // 24 is outside 0..11 OOXii line index range
    expect(parseOoxiiLineIndex(undefined)).toBeNull();
    expect(parseOoxiiLineIndex('')).toBeNull();
    expect(parseOoxiiLineIndex('invalid')).toBeNull();
  });

  it('resolves verified OOXii lines and marks unverified mappings as unresolved', () => {
    // Line 4 (6/24) has verified 1-to-1 chart mapping to row '24' -> next row is '18'
    const resLine4 = resolveOoxiiLineRow('Line 4');
    expect(resLine4.status).toBe('resolved');
    if (resLine4.status === 'resolved') {
      expect(resLine4.row.value).toBe('24');
      expect(resLine4.nextRow?.value).toBe('18');
    }

    // Unverified line index (e.g. Line 2 = 6/38) returns unresolved
    const resLine2 = resolveOoxiiLineRow('Line 2');
    expect(resLine2.status).toBe('unresolved');

    // Missing selection returns unresolved
    const resMissing = resolveOoxiiLineRow(undefined);
    expect(resMissing.status).toBe('unresolved');
  });

  it('dynamically highlights the complete next row for tumbling-e-letters when verified', () => {
    // Tester selected "Line 4" (6/24) -> next row is row 18
    const config = getApparatusHelpConfig('tumbling-e-letters', 'Line 4');
    expect(config).not.toBeNull();
    expect(config?.highlightCaption).toBe('Count the symbols identified correctly on the highlighted row.');
    expect(config?.imageAlt).toContain('line 18 row');

    const highlight = config?.highlights?.[0];
    expect(highlight).toBeDefined();
    // Highlighting covers all row symbols (x >= 35%) without covering printed margin line number (x < 30%)
    expect(highlight?.xPercent).toBeGreaterThanOrEqual(35);
    expect(highlight?.widthPercent).toBeGreaterThan(25);
  });

  it('uses safe generic presentation without false precise row highlight for unresolved mappings', () => {
    // Unverified line selection "Line 2" returns generic presentation
    const config = getApparatusHelpConfig('tumbling-e-letters', 'Line 2');
    expect(config).not.toBeNull();
    expect(config?.highlightCaption).toBe('Count correct symbols across the entire next row.');
    expect(config?.highlights?.length).toBe(0);
  });

  it('uses neutral wording for wheel-line9 and removes false 6/6 line claims', () => {
    const config = getApparatusHelpConfig('wheel-line9');
    expect(config).not.toBeNull();
    expect(config?.instruction).not.toContain('6/6 standard line');
    expect(config?.instruction).toContain('OOXii Line 9');
  });

  it('reuses the same singleton preload promise for Tumbling E chart', () => {
    const promise1 = preloadTumblingEChart();
    const promise2 = preloadTumblingEChart();
    expect(promise1).toBe(promise2);
  });

  it('identifies synthetic illustration assets with assetKind and assetNotice', () => {
    const nearCard = getApparatusHelpConfig('near-vision-line');
    expect(nearCard?.assetKind).toBe('illustration');
    expect(nearCard?.assetNotice).toBe('Illustration only');

    const chart = getApparatusHelpConfig('tumbling-e-line');
    expect(chart?.assetKind).toBe('real-photo');
    expect(chart?.assetNotice).toBeUndefined();
  });
});
