import tumblingEChart from '../../assets/help/tumbling_e_chart.png';
import tumblingEChartLine12 from '../../assets/help/tumbling_e_chart_line12.png';
import tumblingEChartLine9 from '../../assets/help/tumbling_e_chart_line9.png';
import tumblingEChartLine6 from '../../assets/help/tumbling_e_chart_line6.png';
import nearVisionCard from '../../assets/help/near_vision_card.svg';
import wheelPdScale from '../../assets/help/wheel_pd_scale.svg';
import wheelLensDial from '../../assets/help/wheel_lens_dial.svg';
import wheelTwoColourChart from '../../assets/help/wheel_twocolour_chart.svg';
import distanceGlasses from '../../assets/help/distance_glasses.svg';
import readingGlasses from '../../assets/help/reading_glasses.svg';
import sunglassesAsset from '../../assets/help/sunglasses.svg';
import type { ImageFocusRegion } from './cropGeometry';

export type { ImageFocusRegion };

export type OoxiiLineIndex = number; // 0 to 11
export type PrintedChartLabel = '60' | '36' | '24' | '18' | '12' | '9' | '6' | '5' | '4' | '3';

export type ApparatusAssetKind = 'real-photo' | 'official-diagram' | 'illustration' | 'missing';

export type ApparatusHelpHighlight = {
  id: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  label?: string;
};

export type ApparatusHelpConfig = {
  id: string;
  title: string;
  instruction: string;
  imageSrc: string;
  imageAlt: string;
  assetKind: ApparatusAssetKind;
  assetNotice?: string;
  focusRegion?: ImageFocusRegion;
  highlightRegions?: ApparatusHelpHighlight[];
  highlightCaption?: string;
  preload?: boolean;
  /** Backward compatibility alias */
  highlights?: ApparatusHelpHighlight[];
};

export type TumblingERow = {
  value: PrintedChartLabel;
  yPercent: number;
  heightPercent: number;
  symbolsLeftPercent: number;
  symbolsWidthPercent: number;
  fullLeftPercent: number;
  fullWidthPercent: number;
};

export const TUMBLING_E_ROWS: TumblingERow[] = [
  { value: '60', yPercent: 2.0, heightPercent: 15.0, symbolsLeftPercent: 42.0, symbolsWidthPercent: 19.0, fullLeftPercent: 32.0, fullWidthPercent: 29.0 },
  { value: '36', yPercent: 24.4, heightPercent: 9.6, symbolsLeftPercent: 37.0, symbolsWidthPercent: 31.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '24', yPercent: 38.7, heightPercent: 6.5, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.0, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '18', yPercent: 49.9, heightPercent: 4.7, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.0, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '12', yPercent: 59.1, heightPercent: 3.3, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '9',  yPercent: 66.9, heightPercent: 2.2, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '6',  yPercent: 72.7, heightPercent: 1.3, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '5',  yPercent: 78.1, heightPercent: 1.3, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '4',  yPercent: 82.8, heightPercent: 1.3, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
  { value: '3',  yPercent: 87.9, heightPercent: 0.9, symbolsLeftPercent: 36.5, symbolsWidthPercent: 32.5, fullLeftPercent: 25.5, fullWidthPercent: 43.0 },
];

export function parseOoxiiLineIndex(value: string | undefined): OoxiiLineIndex | null {
  if (!value) return null;
  const trimmed = value.trim();
  const match = /^Line\s+(\d+)$/i.exec(trimmed);
  if (match) {
    const index = Number(match[1]);
    return Number.isInteger(index) && index >= 0 && index <= 11 ? index : null;
  }
  const num = Number(trimmed);
  if (Number.isInteger(num) && num >= 0 && num <= 11) {
    return num;
  }
  return null;
}

export type RowResolution =
  | {
      status: 'resolved';
      row: TumblingERow;
      nextRow?: TumblingERow;
    }
  | {
      status: 'unresolved';
      reason: 'missing-selection' | 'unsupported-app-line' | 'unverified-chart-mapping';
    };

export function resolveOoxiiLineRow(selectedLineValue: string | undefined): RowResolution {
  const lineIndex = parseOoxiiLineIndex(selectedLineValue);
  if (lineIndex === null) {
    return { status: 'unresolved', reason: 'missing-selection' };
  }

  const verifiedMap: Record<number, { rowLabel: PrintedChartLabel; nextRowLabel?: PrintedChartLabel }> = {
    0: { rowLabel: '60', nextRowLabel: '36' },
    4: { rowLabel: '24', nextRowLabel: '18' },
    7: { rowLabel: '12', nextRowLabel: '9' },
    10: { rowLabel: '6', nextRowLabel: '5' },
    11: { rowLabel: '5', nextRowLabel: '4' },
  };

  const mapping = verifiedMap[lineIndex];
  if (!mapping) {
    return { status: 'unresolved', reason: 'unverified-chart-mapping' };
  }

  const row = TUMBLING_E_ROWS.find((r) => r.value === mapping.rowLabel)!;
  const nextRow = mapping.nextRowLabel ? TUMBLING_E_ROWS.find((r) => r.value === mapping.nextRowLabel) : undefined;

  return { status: 'resolved', row, nextRow };
}

let tumblingEPreloadPromise: Promise<void> | null = null;

export function preloadTumblingEChart(): Promise<void> {
  if (tumblingEPreloadPromise) {
    return tumblingEPreloadPromise;
  }

  tumblingEPreloadPromise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const image = new Image();
    image.src = tumblingEChart;

    if (image.decode) {
      image.decode().then(resolve).catch(resolve);
    } else {
      image.onload = () => resolve();
      image.onerror = () => resolve();
    }
  });

  return tumblingEPreloadPromise;
}

// TODO: Replace synthetic vector illustration SVG files with genuine apparatus photographs when available.
export const APPARATUS_HELP_CONFIGS: Record<string, ApparatusHelpConfig> = {
  'tumbling-e-line': {
    id: 'tumbling-e-line',
    title: 'Tumbling E Chart — Smallest Line',
    instruction: 'Ask the client to read down the physical chart. Select the OOXii line corresponding to the smallest row they read completely correctly.',
    imageSrc: tumblingEChartLine12,
    imageAlt: 'Tumbling E distance-vision chart with numbered rows of progressively smaller symbols',
    assetKind: 'real-photo',
    preload: true,
    focusRegion: {
      xPercent: 18,
      yPercent: 40,
      widthPercent: 64,
      heightPercent: 44,
    },
    highlightRegions: [],
    highlightCaption: 'Red box highlights the example smallest row read completely correctly.',
  },

  'tumbling-e-result': {
    id: 'tumbling-e-result',
    title: 'Distance Result Score',
    instruction: 'Review the calculated Snellen visual acuity fraction (e.g. 6/12 or 6/6). This score is automatically calculated from the smallest line and letter count.',
    imageSrc: tumblingEChartLine6,
    imageAlt: 'Tumbling E distance vision Snellen scores',
    assetKind: 'real-photo',
    preload: true,
    focusRegion: {
      xPercent: 18,
      yPercent: 40,
      widthPercent: 64,
      heightPercent: 44,
    },
    highlightRegions: [],
    highlightCaption: 'Red box highlights the visual acuity score calculation row.',
  },

  'near-vision-line': {
    id: 'near-vision-line',
    title: 'Near Vision Test Card',
    instruction: 'Hold the near vision card at 33–40 cm from the client. Record the smallest line/N-rating paragraph the client can read comfortably.',
    imageSrc: nearVisionCard,
    imageAlt: 'Near vision test card illustration showing N-rating paragraphs',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    focusRegion: {
      xPercent: 10,
      yPercent: 45,
      widthPercent: 80,
      heightPercent: 50,
    },
    highlightRegions: [],
    highlightCaption: 'Red box highlights the smallest readable N-rating paragraph.',
  },

  'distance-glasses-question': {
    id: 'distance-glasses-question',
    title: 'Distance Glasses Inspection',
    instruction: 'Ask if the client currently owns or wears prescription glasses specifically for distance vision (such as driving, watching television, or outdoors).',
    imageSrc: distanceGlasses,
    imageAlt: 'Distance glasses frame illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },

  'reading-glasses-question': {
    id: 'reading-glasses-question',
    title: 'Reading Glasses Inspection',
    instruction: 'Ask if the client currently uses near vision or reading glasses for close work, reading books, or examining objects.',
    imageSrc: readingGlasses,
    imageAlt: 'Reading glasses frame illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },

  'wheel-pd': {
    id: 'wheel-pd',
    title: 'Reading Pupillary Distance (PD)',
    instruction: 'Place 0.0 lenses in front of both eyes on the wheel apparatus. Turn the central knob until the viewfinders align with the eyes. Read the PD value (in mm) from the scale above the knob.',
    imageSrc: wheelPdScale,
    imageAlt: 'OOXii wheel testing apparatus diagram showing PD scale location',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
    highlightCaption: 'Red box highlights the PD measurement scale window.',
  },

  'wheel-direction': {
    id: 'wheel-direction',
    title: 'Wheel Test — Plus / Minus Direction',
    instruction: 'Cover the non-tested eye. Rotate the lens selector dial on the wheel to test Plus (+), Minus (-), or Neither. Ask the client which lens direction makes the chart clearer.',
    imageSrc: wheelLensDial,
    imageAlt: 'OOXii testing wheel selector dial diagram with Plus and Minus indicators',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
    highlightCaption: 'Red boxes highlight the Plus (+) and Minus (-) selector dials.',
  },

  'wheel-power': {
    id: 'wheel-power',
    title: 'Wheel Test — Lens Power',
    instruction: 'Turn the power dial to cycle through lens strengths (+0.5 to +3.0 or -0.5 to -3.0). Choose the lowest lens strength that provides maximum clarity.',
    imageSrc: wheelLensDial,
    imageAlt: 'OOXii testing wheel lens power dial window diagram',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
    highlightCaption: 'Red box highlights the lens power readout window.',
  },

  'wheel-twocolour': {
    id: 'wheel-twocolour',
    title: 'Two-Colour (Duochrome) Test',
    instruction: 'With the selected wheel lens in place, look at the two-colour target. Ask the client whether letters on the RED side or GREEN side look sharper and darker, or if both look equal.',
    imageSrc: wheelTwoColourChart,
    imageAlt: 'Red and Green duochrome test chart illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
    highlightCaption: 'Red boxes highlight the Red and Green duochrome comparison targets.',
  },

  'wheel-line9': {
    id: 'wheel-line9',
    title: 'Wheel Line 9 Verification',
    instruction: 'Ask whether the client can read OOXii Line 9 or a smaller line while looking through the corrected lenses.',
    imageSrc: tumblingEChartLine9,
    imageAlt: 'Tumbling E distance-vision chart',
    assetKind: 'real-photo',
    preload: true,
    focusRegion: {
      xPercent: 18,
      yPercent: 45,
      widthPercent: 64,
      heightPercent: 44,
    },
    highlightRegions: [],
    highlightCaption: 'Red box highlights Line 9 to verify 6/9 vision clarity.',
  },

  'wheel-distance-improved': {
    id: 'wheel-distance-improved',
    title: 'Distance Improvement at Wheel',
    instruction: 'Measure distance vision looking through the corrected wheel lenses at 3m. Select Yes if visual clarity improved compared to uncorrected vision.',
    imageSrc: wheelLensDial,
    imageAlt: 'Wheel apparatus view finder diagram',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },

  'sunglasses-question': {
    id: 'sunglasses-question',
    title: 'Sunglasses Dispensed',
    instruction: 'Confirm whether UV-protective sunglasses were selected and dispensed to the client following testing.',
    imageSrc: sunglassesAsset,
    imageAlt: 'OOXii sunglasses frame illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },

  'sunglasses-selection': {
    id: 'sunglasses-selection',
    title: 'Sunglasses Model Selection',
    instruction: 'Select the exact model and frame type of the sunglasses being provided to the client.',
    imageSrc: sunglassesAsset,
    imageAlt: 'OOXii sunglasses types illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },

  'dispensed-review': {
    id: 'dispensed-review',
    title: 'Eyewear Dispensed Review',
    instruction: 'Verify distance glasses, reading glasses, and sunglasses dispensed before entering the total amount paid.',
    imageSrc: distanceGlasses,
    imageAlt: 'Eyewear dispensed review illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },

  'distance-glasses-dispensed': {
    id: 'distance-glasses-dispensed',
    title: 'Distance Glasses Dispensed',
    instruction: 'Select frame type (Plastic/Metal), frame colors for front, right arm, and left arm, and frame size for the distance glasses provided to the client.',
    imageSrc: distanceGlasses,
    imageAlt: 'Distance glasses dispensed illustration',
    assetKind: 'illustration',
    assetNotice: 'Illustration only',
    highlightRegions: [],
  },
};

export function getApparatusHelpConfig(id: string, contextLine?: string): ApparatusHelpConfig | null {
  if (id === 'tumbling-e-letters') {
    return {
      id: 'tumbling-e-letters',
      title: 'Tumbling E Chart — Letters Correct',
      instruction: 'On the physical chart, move to the row immediately below the last row read completely correctly. Count how many symbols the client identifies correctly.',
      imageSrc: tumblingEChartLine9,
      imageAlt: 'Tumbling E distance-vision chart',
      assetKind: 'real-photo',
      preload: true,
      focusRegion: {
        xPercent: 18,
        yPercent: 40,
        widthPercent: 64,
        heightPercent: 44,
      },
      highlightRegions: [],
      highlights: [],
      highlightCaption: 'Red box highlights the next row immediately below where you count correct symbols.',
    };
  }

  const cfg = APPARATUS_HELP_CONFIGS[id];
  if (!cfg) return null;

  const highlights = cfg.highlightRegions || cfg.highlights || [];
  return { ...cfg, highlights, highlightRegions: highlights };
}
