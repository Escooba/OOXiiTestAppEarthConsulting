import { describe, it, expect } from 'vitest';
import {
  getApparatusHelpConfig,
  preloadTumblingEChart,
  TUMBLING_E_ROWS,
  parseOoxiiLineIndex,
  resolveOoxiiLineRow,
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
    expect(parseOoxiiLineIndex('24')).toBeNull();
    expect(parseOoxiiLineIndex(undefined)).toBeNull();
  });

  it('contains zero red highlights across Tumbling E help configs', () => {
    const lettersConfig = getApparatusHelpConfig('tumbling-e-letters', 'Line 4');
    expect(lettersConfig?.highlightRegions?.length).toBe(0);
    expect(lettersConfig?.highlights?.length).toBe(0);

    const lineConfig = getApparatusHelpConfig('tumbling-e-line');
    expect(lineConfig?.highlightRegions?.length).toBe(0);
  });

  it('provides clean tester instructions without misleading letter phrasing', () => {
    const config = getApparatusHelpConfig('tumbling-e-letters', 'Line 4');
    expect(config?.instruction).toContain('On the physical chart, move to the row immediately below the last row read completely correctly');
    expect(config?.instruction).not.toContain('3rd letter');
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
